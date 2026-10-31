/**
 * The Google Health API (the Fitbit Web API's successor), read from Google's
 * own documentation: every data type in Google's data-types table joined to
 * the v4 discovery document, plus the scopes, methods, Fitbit Web API
 * mappings, rate limits, webhooks, errors and release notes.
 *
 * GENERATED — do not hand-edit. Regenerate with:
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-google-health-api.mjs
 *
 * Sources:
 *   https://health.googleapis.com/$discovery/rest?version=v4 (revision 20261030) — fetched 2026-10-31
 *   https://health.googleapis.com/$discovery/rest?version=v4beta (revision 20261030) — fetched 2026-10-31
 *   https://developers.google.com/health/data-types (Last updated 2026-10-06) — fetched 2026-10-31
 *   https://developers.google.com/health/scopes (Last updated 2026-10-09) — fetched 2026-10-31
 *   https://developers.google.com/health/migration/api-specifications (Last updated 2026-09-22) — fetched 2026-10-31
 *   https://developers.google.com/health/about (Last updated 2026-10-23) — fetched 2026-10-31
 *   https://developers.google.com/health/migration (Last updated 2026-09-28) — fetched 2026-10-31
 *   https://developers.google.com/health/rate-limits (Last updated 2026-05-18) — fetched 2026-10-31
 *   https://developers.google.com/health/app-verification (Last updated 2026-09-25) — fetched 2026-10-31
 *   https://developers.google.com/health/webhooks (Last updated 2026-10-20) — fetched 2026-10-31
 *   https://developers.google.com/health/reference/rest/v4/errors (Last updated 2026-10-01) — fetched 2026-10-31
 *   https://developers.google.com/health/troubleshooting (Last updated 2026-09-28) — fetched 2026-10-31
 *   https://developers.google.com/health/release-notes (Last updated 2026-10-14) — fetched 2026-10-31
 *   https://developers.google.com/health/endpoints (Last updated 2026-10-05) — fetched 2026-10-31
 * Fetched: 2026-10-31
 *
 * Copied verbatim: names, ids, filter parameters, record types, storage
 * resolutions, badges, devices, operations, scope strings and consent text,
 * method verbs, path templates and descriptions, field names, types,
 * descriptions and enum values, the mapping tables, rate limits, the error
 * catalog, release notes, and every prose block (as text, code in
 * backticks).
 *
 * Derived, with the text kept beside it:
 *   scope url — Google's prefix (GHAPI_SCOPE_PREFIX_EVIDENCE) + the printed
 *     ".family.access" suffix.
 *   dataPointProperty — the DataPoint property whose description names the
 *     type (dataPointEvidence), checked against DataPoint.name's kebab-case
 *     rule (GHAPI_DATAPOINT_RULE).
 *   rollup / dailyRollup — the RollupDataPoint / DailyRollupDataPoint
 *     property whose description names the type (evidence).
 *   operation → method — exact, case-insensitive ("rollup" → rollUp), or,
 *     for "update", via Google's endpoint-mapping table (evidence).
 *   required — true only where the description opens "Required.".
 *   ISO dates — beside the date as Google prints it.
 *   flags — where Google's own pages disagree, published as found with the
 *     texts that disagree; never corrected here.
 */

export type GhapiSourceKey = "discoveryV4" | "discoveryV4beta" | "dataTypes" | "scopes" | "apiSpecifications" | "about" | "migration" | "rateLimits" | "appVerification" | "webhooks" | "errors" | "troubleshooting" | "releaseNotes" | "endpoints";

export type GhapiSource = {
  key: GhapiSourceKey;
  title: string;
  url: string;
  fetchedOn: string;
  /** The page footer's "Last updated" date; null for the discovery documents. */
  lastUpdated: string | null;
  /** The discovery document's revision; null for guide pages. */
  revision: string | null;
  /** The page footer's licence sentence, verbatim. */
  license: string | null;
};

export type GhapiBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered: boolean; items: { text: string; sub?: string[] }[] }
  | { kind: "table"; caption: string | null; head: string[]; rows: string[][] }
  | { kind: "note"; variant: string; text: string }
  | { kind: "code"; text: string }
  /** A tab heading over an example ("Request", "Response"). */
  | { kind: "label"; text: string };

export type GhapiSection = { id: string | null; heading: string | null; level: number; blocks: GhapiBlock[] };

export type GhapiField = {
  name: string;
  /** The type as the discovery document states it: a schema id, "string/int64", "array<SleepStage>"… */
  type: string;
  ref: string | null;
  itemsRef: string | null;
  /** The behaviour word Google's description opens with ("Required", "Optional", "Output only", "Identifier"); null when none. */
  label: string | null;
  /** True only where the description opens "Required.". */
  required: boolean;
  readOnly: boolean;
  description: string | null;
  enum: { value: string; description: string | null }[] | null;
};

export type GhapiSchema = {
  id: string;
  /** The discovery document the schema was read from. */
  source: "v4" | "v4beta";
  description: string | null;
  /** Required fields first, then by name. */
  fields: GhapiField[];
};

/** A schema by id (in GHAPI_SCHEMAS), with the ids of the schemas its fields
 *  refer to, one level deep. */
export type GhapiSchemaRef = { id: string; nested: string[] };

export type GhapiOperation = {
  /** The operation as Google's data-types table prints it. */
  op: string;
  /** The users.dataTypes.dataPoints method it was matched to; null when none. */
  method: string | null;
  methodId: string | null;
  match: "exact" | "case-insensitive" | "endpoint-mapping" | null;
  httpMethod: string | null;
  /** The discovery document's flatPath template. */
  flatPath: string | null;
  /** rootUrl + flatPath with {dataTypesId} filled with this type's id. */
  path: string | null;
  evidence: string | null;
};

export type GhapiScopeRef = {
  shorthand: string;
  url: string;
  family: string;
  access: "read" | "write";
  /** The Scopes page's permission sentence; null where the page does not list the scope. */
  permission: string | null;
  onScopesPage: boolean;
  inDiscoveryV4: boolean;
};

export type GhapiFlag = {
  kind: string;
  dataType: string | null;
  scope?: string;
  /** One factual sentence naming the disagreement. */
  summary: string;
  /** The texts that disagree, verbatim, with the source each came from. */
  evidence: { source: GhapiSourceKey; text: string }[];
};

export type GhapiRollup = { property: string; evidence: string; schema: GhapiSchemaRef | null };

export type GhapiDataType = {
  /** The hyphenated id used in endpoint URLs, e.g. "heart-rate". */
  dataType: string;
  /** Google's display name, e.g. "Heart Rate". */
  name: string;
  /** The underscored id used as the dataType filter value, e.g. "heart_rate". */
  filterParam: string;
  /** Interval, Sample, Daily, Session or Food, as printed. */
  recordType: string;
  /** Google's definition of that record type, from the table key. */
  recordTypeDefinition: string | null;
  /** e.g. "1 minute"; null where the table states none. */
  storageResolution: string | null;
  webhookSupport: boolean;
  trueZerosSupport: boolean;
  /** "v4", or "v4beta" where the table tags the row. */
  channel: string;
  /** The reference anchor the table's name links to. */
  referenceUrl: string | null;
  operations: GhapiOperation[];
  scopes: GhapiScopeRef[];
  compatibleDevices: { name: string; url: string | null }[];
  guides: { title: string; url: string }[];
  dataPointProperty: string | null;
  /** The DataPoint property's own description, verbatim. */
  dataPointEvidence: string | null;
  /** "description" where that description names the id; "kebab-case rule"
   *  where it does not and GHAPI_DATAPOINT_RULE alone made the match. */
  dataPointMatch: "description" | "kebab-case rule" | null;
  dataPointSource: "v4" | "v4beta" | null;
  schema: GhapiSchemaRef | null;
  /** Set only where the table lists rollup. */
  rollup: GhapiRollup | null;
  /** Set only where the table lists dailyRollup. */
  dailyRollup: GhapiRollup | null;
  webhookOnWebhooksPage: boolean;
  webhookToken: string | null;
  /** Google's Fitbit Web API → Google Health API mapping row; null where it has none. */
  fitbit: { fitbitDataType: string; description: string | null } | null;
  /** Fitbit Web API scopes whose mapping row lists one of this type's scopes. */
  fitbitScopes: string[];
  flags: GhapiFlag[];
};

export type GhapiMethod = {
  id: string | null;
  resource: string;
  name: string;
  httpMethod: string | null;
  flatPath: string | null;
  path: string | null;
  description: string | null;
  scopes: string[];
  parameters: { name: string; location: string | null; required: boolean; type: string | null; description: string | null }[];
  request: string | null;
  response: string | null;
};

/** The date the generator fetched Google's data-types page. */
export const GHAPI_FETCHED_ON = "2026-10-31";

/** Every source read, with its fetch date and Google's own "Last updated". */
export const GHAPI_SOURCES: GhapiSource[] = [
  {
    "key": "discoveryV4",
    "title": "Google Health API discovery document (v4)",
    "url": "https://health.googleapis.com/$discovery/rest?version=v4",
    "fetchedOn": "2026-10-31",
    "lastUpdated": null,
    "revision": "20261030",
    "license": null
  },
  {
    "key": "discoveryV4beta",
    "title": "Google Health API discovery document (v4beta)",
    "url": "https://health.googleapis.com/$discovery/rest?version=v4beta",
    "fetchedOn": "2026-10-31",
    "lastUpdated": null,
    "revision": "20261030",
    "license": null
  },
  {
    "key": "dataTypes",
    "title": "Google Health API data types",
    "url": "https://developers.google.com/health/data-types",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-06",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "scopes",
    "title": "Scopes",
    "url": "https://developers.google.com/health/scopes",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-09",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "apiSpecifications",
    "title": "API specifications",
    "url": "https://developers.google.com/health/migration/api-specifications",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-09-22",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "about",
    "title": "About the Google Health API",
    "url": "https://developers.google.com/health/about",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-23",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "migration",
    "title": "Overview",
    "url": "https://developers.google.com/health/migration",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-09-28",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "rateLimits",
    "title": "Quotas and Rate Limits",
    "url": "https://developers.google.com/health/rate-limits",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-05-18",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "appVerification",
    "title": "App verification",
    "url": "https://developers.google.com/health/app-verification",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-09-25",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "webhooks",
    "title": "Webhook subscriptions",
    "url": "https://developers.google.com/health/webhooks",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-20",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "errors",
    "title": "Google Health API Version v4: Error Catalog",
    "url": "https://developers.google.com/health/reference/rest/v4/errors",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-01",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "troubleshooting",
    "title": "Troubleshooting",
    "url": "https://developers.google.com/health/troubleshooting",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-09-28",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "releaseNotes",
    "title": "Release notes",
    "url": "https://developers.google.com/health/release-notes",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-14",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  },
  {
    "key": "endpoints",
    "title": "Endpoints",
    "url": "https://developers.google.com/health/endpoints",
    "fetchedOn": "2026-10-31",
    "lastUpdated": "2026-10-05",
    "revision": null,
    "license": "Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 4.0 License, and code samples are licensed under the Apache 2.0 License."
  }
];

/** Facts about the v4 and v4beta discovery documents. */
export const GHAPI_DISCOVERY = {
  "url": "https://health.googleapis.com/$discovery/rest?version=v4",
  "betaUrl": "https://health.googleapis.com/$discovery/rest?version=v4beta",
  "title": "Google Health API",
  "description": "The Google Health API lets you view and manage health and fitness metrics and measurement data.",
  "version": "v4",
  "revision": "20261030",
  "betaRevision": "20261030",
  "rootUrl": "https://health.googleapis.com/",
  "documentationLink": "https://developers.google.com/health",
  "schemaCount": 151,
  "betaSchemaCount": 154,
  "dataPointPropertyCount": 44,
  "betaOnlySchemas": ["SensorData","SensorMetadata","SkinTemperatureSensors"],
  "methodCount": 27
};

/** The prefix every scope starts with, and the Scopes page's sentence saying so. */
export const GHAPI_SCOPE_PREFIX = "https://www.googleapis.com/auth/googlehealth";
export const GHAPI_SCOPE_PREFIX_EVIDENCE = "All Google Health API scopes begin with: https://www.googleapis.com/auth/googlehealth";

/** DataPoint.name's sentence on how a dataType id maps to a DataPoint field. */
export const GHAPI_DATAPOINT_RULE = "The `{data_type}` ID corresponds to the kebab-case version of the field names in the DataPoint data union field, e.";

/** The data-types table's own key: what each column means, verbatim. */
export const GHAPI_TABLE_KEY: { field: string; description: string; items: string[] }[] = [
  {"field":"`dataType`","description":"The identifier separated by hyphens (for example, `active-minutes`) used in endpoint URLs.","items":[]},
  {
    "field": "`filter` parameter",
    "description": "The identifier separated by underscores (for example, `active_minutes`) used as the value for the `dataType` filter parameter in daily rollup and rollup requests.",
    "items": []
  },
  {
    "field": "Record type",
    "description": "Indicates the structure and format of the recorded data. Under the hood, this aligns with the resource representation of the data points. The possible values are:",
    "items": [
      "`Interval` (Represents measurements recorded over a duration.)",
      "`Sample` (Represents instantaneous measurements.)",
      "`Daily` (Represents measurements aggregated or recorded on a daily basis.)",
      "`Session` (Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.)",
      "`Food` (Represents a food item or nutrition-related data entity.)"
    ]
  },
  {"field":"Available operations","description":"Lists the API methods supported for the data type (such as `list`, `create`, and `rollUp`).","items":[]},
  {"field":"Scope","description":"The required OAuth scope(s) to access the data type.","items":[]},
  {"field":"Webhook support","description":"Indicates that the data type supports real-time notifications using webhooks when new data is synced.","items":[]},
  {
    "field": "True zeros support",
    "description": "Indicates that the data type supports recording explicit zero values to differentiate between an active zero value (such as zero active minutes) versus missing or unrecorded data.",
    "items": []
  },
  {
    "field": "Storage resolution",
    "description": "The minimum recording or sampling interval at which data points are stored (for example, 1 minute for `steps`). For rollups, this represents the minimum recommended `windowSize` to ensure evenly distributed aggregation without sub-interval data artifacts.",
    "items": []
  },
  {
    "field": "Compatible devices",
    "description": "An expandable list of physical devices that can record and sync this data type to the Google Health API (using the Fitbit app).",
    "items": []
  }
];

/** Every data type in Google's data-types table, in the table's order. */
export const GHAPI_DATA_TYPES: GhapiDataType[] = [
  {
    "dataType": "active-energy-burned",
    "name": "Active Energy Burned",
    "filterParam": "active_energy_burned",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activeenergyburned",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-energy-burned/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-energy-burned/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-energy-burned/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-energy-burned/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Calories and energy guide","url":"https://developers.google.com/health/data-types/calories"}],
    "dataPointProperty": "activeEnergyBurned",
    "dataPointEvidence": "Optional. Data for points in the `active-energy-burned` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"ActiveEnergyBurned","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "activeEnergyBurned",
      "evidence": "Returned by default when rolling up data points from the `active-energy-burned` data type.",
      "schema": {"id":"ActiveEnergyBurnedRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "activeEnergyBurned",
      "evidence": "Returned by default when rolling up data points from the `active-energy-burned` data type.",
      "schema": {"id":"ActiveEnergyBurnedRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {
      "fitbitDataType": "Activity Calories",
      "description": "Represents the calories burned during active periods, inclusive of BMR for those periods. In the Google Health API, this can be reconstructed by adding BMR to the `active-energy-burned` data type (which tracks activity-only burn, excluding basal rate)."
    },
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "active-minutes",
    "name": "Active Minutes",
    "filterParam": "active_minutes",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activeminutes",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-minutes/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-minutes/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-minutes/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-minutes/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"}
    ],
    "guides": [],
    "dataPointProperty": "activeMinutes",
    "dataPointEvidence": "Optional. Data for points in the `active-minutes` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"ActiveMinutes","nested":["ActiveMinutesByActivityLevel","ObservationTimeInterval"]},
    "rollup": {
      "property": "activeMinutes",
      "evidence": "Returned by default when rolling up data points from the `active-minutes` data type, or when requested explicitly using the `active-minutes` rollup type identifier.",
      "schema": {"id":"ActiveMinutesRollupValue","nested":["ActiveMinutesRollupByActivityLevel"]}
    },
    "dailyRollup": {
      "property": "activeMinutes",
      "evidence": "Returned by default when rolling up data points from the `active-minutes` data type, or when requested explicitly using the `active-minutes` rollup type identifier.",
      "schema": {"id":"ActiveMinutesRollupValue","nested":["ActiveMinutesRollupByActivityLevel"]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_ACTIVE_MINUTES",
    "fitbit": null,
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "active-zone-minutes",
    "name": "Active Zone Minutes",
    "filterParam": "active_zone_minutes",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activezoneminutes",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-zone-minutes/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-zone-minutes/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-zone-minutes/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/active-zone-minutes/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "activeZoneMinutes",
    "dataPointEvidence": "Optional. Data for points in the `active-zone-minutes` interval data type collection, measured in minutes.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"ActiveZoneMinutes","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "activeZoneMinutes",
      "evidence": "Returned by default when rolling up data points from the `active-zone-minutes` data type, or when requested explicitly using the `active-zone-minutes` rollup type identifier.",
      "schema": {"id":"ActiveZoneMinutesRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "activeZoneMinutes",
      "evidence": "Returned by default when rolling up data points from the `active-zone-minutes` data type, or when requested explicitly using the `active-zone-minutes` rollup type identifier.",
      "schema": {"id":"ActiveZoneMinutesRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_ACTIVE_ZONE_MINUTES",
    "fitbit": {"fitbitDataType":"Active Zone Minutes","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "activity-level",
    "name": "Activity Level",
    "filterParam": "activity_level",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activitylevel",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/activity-level/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/activity-level/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "activityLevel",
    "dataPointEvidence": "Optional. Data for points in the `activity-level` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"ActivityLevel","nested":["ObservationTimeInterval"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_ACTIVITY_LEVEL",
    "fitbit": {
      "fitbitDataType": "Contains changes to the user's activity levels",
      "description": "Captures the user's activity level (such as sedentary or active) over a specific period of time."
    },
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": [
      {
        "dataType": "activity-level",
        "kind": "rollup-not-in-table",
        "summary": "The discovery document's RollupDataPoint.activityLevel is returned when rolling up activity-level, but the table does not list rollup for activity-level.",
        "evidence": [
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `activity-level` data type, or when requested explicitly using the `activity-level` rollup type identifier."
          },
          {"source":"dataTypes","text":"list, reconcile"}
        ]
      },
      {
        "dataType": "activity-level",
        "kind": "rollup-not-in-table",
        "summary": "The discovery document's DailyRollupDataPoint.activityLevel is returned when rolling up activity-level, but the table does not list dailyRollup for activity-level.",
        "evidence": [
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `activity-level` data type, or when requested explicitly using the `activity-level` rollup type identifier."
          },
          {"source":"dataTypes","text":"list, reconcile"}
        ]
      }
    ]
  },
  {
    "dataType": "altitude",
    "name": "Altitude",
    "filterParam": "altitude",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": true,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#altitude",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/altitude/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/altitude/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/altitude/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/altitude/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "altitude",
    "dataPointEvidence": "Optional. Data for points in the `altitude` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Altitude","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "altitude",
      "evidence": "Returned by default when rolling up data points from the `altitude` data type, or when requested explicitly using the `altitude` rollup type identifier.",
      "schema": {"id":"AltitudeRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "altitude",
      "evidence": "Returned by default when rolling up data points from the `altitude` data type, or when requested explicitly using the `altitude` rollup type identifier.",
      "schema": {"id":"AltitudeRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_ALTITUDE",
    "fitbit": {"fitbitDataType":"Elevation","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "blood-glucose",
    "name": "Blood Glucose",
    "filterParam": "blood_glucose",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#bloodglucose",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/blood-glucose/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/blood-glucose/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/blood-glucose/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/blood-glucose/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/blood-glucose/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "bloodGlucose",
    "dataPointEvidence": "Optional. Data for points in the `blood-glucose` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"BloodGlucose","nested":["ObservationSampleTime"]},
    "rollup": {
      "property": "bloodGlucose",
      "evidence": "Returned by default when rolling up data points from the `blood-glucose` data type.",
      "schema": {"id":"BloodGlucoseRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "bloodGlucose",
      "evidence": "Returned by default when rolling up data points from the `blood-glucose` data type.",
      "schema": {"id":"BloodGlucoseRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_BLOOD_GLUCOSE",
    "fitbit": {"fitbitDataType":"Blood Glucose","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "body-fat",
    "name": "Body Fat",
    "filterParam": "body_fat",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#bodyfat",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/body-fat/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [{"name":"Fitbit Aria","url":null},{"name":"Fitbit Aria 2","url":null},{"name":"Fitbit Aria Air","url":"https://store.google.com/product/fitbit_aria_air"}],
    "guides": [],
    "dataPointProperty": "bodyFat",
    "dataPointEvidence": "Optional. Data for points in the `body-fat` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"BodyFat","nested":["ObservationSampleTime"]},
    "rollup": {
      "property": "bodyFat",
      "evidence": "Returned by default when rolling up data points from the `body-fat` data type, or when requested explicitly using the `body-fat` rollup type identifier.",
      "schema": {"id":"BodyFatRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "bodyFat",
      "evidence": "Returned by default when rolling up data points from the `body-fat` data type, or when requested explicitly using the `body-fat` rollup type identifier.",
      "schema": {"id":"BodyFatRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_BODY_FAT",
    "fitbit": {"fitbitDataType":"Body fat","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "body-fat",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for body-fat, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "calories-in-heart-rate-zone",
    "name": "Calories In Heart Rate Zone",
    "filterParam": "calories_in_heart_rate_zone",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/rollUp#RollupDataPoint.FIELDS.calories_in_heart_rate_zone",
    "operations": [
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/calories-in-heart-rate-zone/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/calories-in-heart-rate-zone/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": null,
    "dataPointEvidence": null,
    "dataPointMatch": null,
    "dataPointSource": null,
    "schema": null,
    "rollup": {
      "property": "caloriesInHeartRateZone",
      "evidence": "Returned by default when rolling up data points from the `calories-in-heart-rate-zone` data type, or when requested explicitly using the `calories-in-heart-rate-zone` rollup type identifier.",
      "schema": {"id":"CaloriesInHeartRateZoneRollupValue","nested":["CaloriesInHeartRateZoneValue"]}
    },
    "dailyRollup": {
      "property": "caloriesInHeartRateZone",
      "evidence": "Returned by default when rolling up data points from the `calories-in-heart-rate-zone` data type, or when requested explicitly using the `calories-in-heart-rate-zone` rollup type identifier.",
      "schema": {"id":"CaloriesInHeartRateZoneRollupValue","nested":["CaloriesInHeartRateZoneValue"]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_CALORIES_IN_HEART_RATE_ZONE",
    "fitbit": {"fitbitDataType":"`caloriesOut` in each heart rate zone","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": [
      {
        "dataType": "calories-in-heart-rate-zone",
        "kind": "no-v4-datapoint-property",
        "summary": "Neither discovery document has a DataPoint property for calories-in-heart-rate-zone; it exists only as a rollup (caloriesInHeartRateZone), matching the table's operations (rollup, dailyRollup).",
        "evidence": [
          {"source":"dataTypes","text":"Calories In Heart Rate Zone"},
          {"source":"dataTypes","text":"rollup, dailyRollup"},
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `calories-in-heart-rate-zone` data type, or when requested explicitly using the `calories-in-heart-rate-zone` rollup type identifier."
          }
        ]
      }
    ]
  },
  {
    "dataType": "core-body-temperature",
    "name": "Core Body Temperature",
    "filterParam": "core_body_temperature",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#corebodytemperature",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/core-body-temperature/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/core-body-temperature/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/core-body-temperature/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/core-body-temperature/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/core-body-temperature/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "coreBodyTemperature",
    "dataPointEvidence": "Optional. Data for points in the `core-body-temperature` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"CoreBodyTemperature","nested":["ObservationSampleTime"]},
    "rollup": {
      "property": "coreBodyTemperature",
      "evidence": "Returned by default when rolling up data points from the `core-body-temperature` data type, or when requested explicitly using the `core-body-temperature` rollup type identifier.",
      "schema": {"id":"CoreBodyTemperatureRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "coreBodyTemperature",
      "evidence": "Returned by default when rolling up data points from the `core-body-temperature` data type, or when requested explicitly using the `core-body-temperature` rollup type identifier.",
      "schema": {"id":"CoreBodyTemperatureRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Temperature (Core)","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "daily-heart-rate-variability",
    "name": "Daily Heart Rate Variability",
    "filterParam": "daily_heart_rate_variability",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyheartratevariability",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-heart-rate-variability/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-heart-rate-variability/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "dailyHeartRateVariability",
    "dataPointEvidence": "Optional. Data for points in the `daily-heart-rate-variability` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyHeartRateVariability","nested":["Date"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_VARIABILITY",
    "fitbit": {"fitbitDataType":"HRV summary","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "daily-heart-rate-variability",
        "kind": "rollup-not-in-table",
        "summary": "The discovery document's DailyRollupDataPoint.heartRateVariabilityPersonalRange is returned when rolling up daily-heart-rate-variability, but the table does not list dailyRollup for daily-heart-rate-variability.",
        "evidence": [
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `daily-heart-rate-variability` data type, or when requested explicitly using the `heart-rate-variability-personal-range` rollup type identifier."
          },
          {"source":"dataTypes","text":"list, reconcile"}
        ]
      }
    ]
  },
  {
    "dataType": "daily-heart-rate-zones",
    "name": "Daily Heart Rate Zones",
    "filterParam": "daily_heart_rate_zones",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyheartratezones",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-heart-rate-zones/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-heart-rate-zones/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "dailyHeartRateZones",
    "dataPointEvidence": "Optional. Data for points in the `daily-heart-rate-zones` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyHeartRateZones","nested":["Date","HeartRateZone"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_ZONES",
    "fitbit": null,
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "daily-oxygen-saturation",
    "name": "Daily Oxygen Saturation",
    "filterParam": "daily_oxygen_saturation",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyoxygensaturation",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-oxygen-saturation/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-oxygen-saturation/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "dailyOxygenSaturation",
    "dataPointEvidence": "Optional. Data for points in the `daily-oxygen-saturation` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyOxygenSaturation","nested":["Date"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_OXYGEN_SATURATION",
    "fitbit": {"fitbitDataType":"SpO2 summary","description":"A daily summary of blood oxygen saturation (SpO2) statistics calculated from validated sleep measurements."},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "daily-respiratory-rate",
    "name": "Daily Respiratory Rate",
    "filterParam": "daily_respiratory_rate",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyrespiratoryrate",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-respiratory-rate/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-respiratory-rate/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "dailyRespiratoryRate",
    "dataPointEvidence": "Optional. Data for points in the `daily-respiratory-rate` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyRespiratoryRate","nested":["Date"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_RESPIRATORY_RATE",
    "fitbit": null,
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "daily-resting-heart-rate",
    "name": "Daily Resting Heart Rate",
    "filterParam": "daily_resting_heart_rate",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyrestingheartrate",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-resting-heart-rate/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-resting-heart-rate/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "dailyRestingHeartRate",
    "dataPointEvidence": "Optional. Data for points in the `daily-resting-heart-rate` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyRestingHeartRate","nested":["Date","DailyRestingHeartRateMetadata"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_RESTING_HEART_RATE",
    "fitbit": {"fitbitDataType":"Resting heart rate","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "daily-resting-heart-rate",
        "kind": "rollup-not-in-table",
        "summary": "The discovery document's DailyRollupDataPoint.restingHeartRatePersonalRange is returned when rolling up daily-resting-heart-rate, but the table does not list dailyRollup for daily-resting-heart-rate.",
        "evidence": [
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `daily-resting-heart-rate` data type, or when requested explicitly using the `resting-heart-rate-personal-range` rollup type identifier."
          },
          {"source":"dataTypes","text":"list, reconcile"}
        ]
      }
    ]
  },
  {
    "dataType": "daily-sleep-temperature-derivations",
    "name": "Daily Sleep Temperature Derivations",
    "filterParam": "daily_sleep_temperature_derivations",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailysleeptemperaturederivations",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-sleep-temperature-derivations/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-sleep-temperature-derivations/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"},
      {"title":"Skin Temperature guide","url":"https://developers.google.com/health/data-types/skin-temperature"}
    ],
    "dataPointProperty": "dailySleepTemperatureDerivations",
    "dataPointEvidence": "Optional. Data for points in the `daily-sleep-temperature-derivations` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailySleepTemperatureDerivations","nested":["Date"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DAILY_SLEEP_TEMPERATURE_DERIVATIONS",
    "fitbit": {"fitbitDataType":"Skin temperature","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "daily-vo2-max",
    "name": "Daily VO2 Max",
    "filterParam": "daily_vo2_max",
    "recordType": "Daily",
    "recordTypeDefinition": "Represents measurements aggregated or recorded on a daily basis.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyvo2max",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-vo2-max/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/daily-vo2-max/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "dailyVo2Max",
    "dataPointEvidence": "Optional. Data for points in the `daily-vo2-max` daily data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"DailyVO2Max","nested":["Date"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "distance",
    "name": "Distance",
    "filterParam": "distance",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": true,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#distance",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/distance/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/distance/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/distance/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/distance/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "distance",
    "dataPointEvidence": "Optional. Data for points in the `distance` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Distance","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "distance",
      "evidence": "Returned by default when rolling up data points from the `distance` data type, or when requested explicitly using the `distance` rollup type identifier.",
      "schema": {"id":"DistanceRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "distance",
      "evidence": "Returned by default when rolling up data points from the `distance` data type, or when requested explicitly using the `distance` rollup type identifier.",
      "schema": {"id":"DistanceRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_DISTANCE",
    "fitbit": {"fitbitDataType":"Distance","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "electrocardiogram",
    "name": "Electrocardiogram (ECG)",
    "filterParam": "electrocardiogram",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#electrocardiogram",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/electrocardiogram/dataPoints",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".ecg.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
        "family": "ecg",
        "access": "read",
        "permission": "See your Google Health ECG data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"}
    ],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "electrocardiogram",
    "dataPointEvidence": "Optional. Data for points in the `electrocardiogram` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Electrocardiogram","nested":["SessionTimeInterval","MedicalDeviceInfo"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Electrocardiogram (ECG)","description":null},
    "fitbitScopes": ["electrocardiogram"],
    "flags": []
  },
  {
    "dataType": "exercise",
    "name": "Exercise",
    "filterParam": "exercise",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#exercise",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/exercise/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Workouts guide","url":"https://developers.google.com/health/data-types/workouts"}],
    "dataPointProperty": "exercise",
    "dataPointEvidence": "Optional. Data for points in the `exercise` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Exercise","nested":["SessionTimeInterval","MetricsSummary","ExerciseEvent","ExerciseMetadata","SplitSummary"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_EXERCISE",
    "fitbit": {
      "fitbitDataType": "Recorded activity",
      "description": "Recorded workouts or exercise sessions, which include start/end times, activity types, and session metrics."
    },
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": [
      {
        "dataType": "exercise",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for exercise, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      },
      {
        "dataType": "exercise",
        "kind": "method-not-in-table",
        "summary": "The discovery document's exportExerciseTcx method is documented for exercise, but the table's operations for exercise do not list it.",
        "evidence": [
          {
            "source": "discoveryV4",
            "text": "Exports exercise data in TCX format. **IMPORTANT:** HTTP clients must append `?alt=media` to the request URL to download the raw TCX file."
          },
          {"source":"dataTypes","text":"list, get, reconcile, create, update, batchDelete"}
        ]
      }
    ]
  },
  {
    "dataType": "floors",
    "name": "Floors",
    "filterParam": "floors",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": true,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/rollUp#RollupDataPoint.FIELDS.floors",
    "operations": [
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/floors/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/floors/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/floors/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "floors",
    "dataPointEvidence": "Optional. Data for points in the `floors` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Floors","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "floors",
      "evidence": "Returned by default when rolling up data points from the `floors` data type, or when requested explicitly using the `floors` rollup type identifier.",
      "schema": {"id":"FloorsRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "floors",
      "evidence": "Returned by default when rolling up data points from the `floors` data type, or when requested explicitly using the `floors` rollup type identifier.",
      "schema": {"id":"FloorsRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_FLOORS",
    "fitbit": {"fitbitDataType":"Floors","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": [
      {
        "dataType": "floors",
        "kind": "reference-anchor-differs",
        "summary": "The table links floors to the reference anchor #RollupDataPoint.FIELDS.floors; the DataPoint property that names it is floors.",
        "evidence": [{"source":"dataTypes","text":"Floors"},{"source":"discoveryV4","text":"Optional. Data for points in the `floors` interval data type collection."}]
      }
    ]
  },
  {
    "dataType": "food",
    "name": "Food",
    "filterParam": "food",
    "recordType": "Food",
    "recordTypeDefinition": "Represents a food item or nutrition-related data entity.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#food",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/food/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/food/dataPoints/{dataPointsId}",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".nutrition.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "family": "nutrition",
        "access": "read",
        "permission": "See your Google Health nutrition data.",
        "onScopesPage": true,
        "inDiscoveryV4": false
      },
      {
        "shorthand": ".nutrition.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
        "family": "nutrition",
        "access": "write",
        "permission": "Add nutrition data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Nutrition guide","url":"https://developers.google.com/health/data-types/nutrition"}],
    "dataPointProperty": "food",
    "dataPointEvidence": "Optional. The food details.",
    "dataPointMatch": "kebab-case rule",
    "dataPointSource": "v4",
    "schema": {"id":"Food","nested":["FoodServing","EnergyQuantity","NutrientQuantity","WeightQuantity"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Food","description":null},
    "fitbitScopes": ["nutrition"],
    "flags": [
      {
        "dataType": "food",
        "kind": "scope-not-in-discovery",
        "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "summary": "The table lists .nutrition.readonly for food, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
        "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
      }
    ]
  },
  {
    "dataType": "food-measurement-unit",
    "name": "Food Measurement Unit",
    "filterParam": "food_measurement_unit",
    "recordType": "Food",
    "recordTypeDefinition": "Represents a food item or nutrition-related data entity.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#foodmeasurementunit",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/food-measurement-unit/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/food-measurement-unit/dataPoints/{dataPointsId}",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".nutrition.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "family": "nutrition",
        "access": "read",
        "permission": "See your Google Health nutrition data.",
        "onScopesPage": true,
        "inDiscoveryV4": false
      },
      {
        "shorthand": ".nutrition.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
        "family": "nutrition",
        "access": "write",
        "permission": "Add nutrition data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [{"title":"Nutrition guide","url":"https://developers.google.com/health/data-types/nutrition"}],
    "dataPointProperty": "foodMeasurementUnit",
    "dataPointEvidence": "Optional. The food measurement unit details.",
    "dataPointMatch": "kebab-case rule",
    "dataPointSource": "v4",
    "schema": {"id":"FoodMeasurementUnit","nested":[]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Food Measurement Unit","description":null},
    "fitbitScopes": ["nutrition"],
    "flags": [
      {
        "dataType": "food-measurement-unit",
        "kind": "scope-not-in-discovery",
        "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "summary": "The table lists .nutrition.readonly for food-measurement-unit, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
        "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
      }
    ]
  },
  {
    "dataType": "heart-rate",
    "name": "Heart Rate",
    "filterParam": "heart_rate",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": "1 second",
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#heartrate",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "heartRate",
    "dataPointEvidence": "Optional. Data for points in the `heart-rate` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"HeartRate","nested":["ObservationSampleTime","HeartRateMetadata"]},
    "rollup": {
      "property": "heartRate",
      "evidence": "Returned by default when rolling up data points from the `heart-rate` data type, or when requested explicitly using the `heart-rate` rollup type identifier.",
      "schema": {"id":"HeartRateRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "heartRate",
      "evidence": "Returned by default when rolling up data points from the `heart-rate` data type, or when requested explicitly using the `heart-rate` rollup type identifier.",
      "schema": {"id":"HeartRateRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_HEART_RATE",
    "fitbit": {"fitbitDataType":"Heart Rate","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "heart-rate-variability",
    "name": "Heart Rate Variability",
    "filterParam": "heart_rate_variability",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#heartratevariability",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate-variability/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/heart-rate-variability/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "heartRateVariability",
    "dataPointEvidence": "Optional. Data for points in the `heart-rate-variability` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"HeartRateVariability","nested":["ObservationSampleTime","HeartRateVariabilityMetadata"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_HEART_RATE_VARIABILITY",
    "fitbit": {"fitbitDataType":"HRV Intraday","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "height",
    "name": "Height",
    "filterParam": "height",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#height",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/height/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "height",
    "dataPointEvidence": "Optional. Data for points in the `height` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Height","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_HEIGHT",
    "fitbit": null,
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "height",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for height, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "hydration-log",
    "name": "Hydration Log",
    "filterParam": "hydration_log",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#hydrationlog",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/hydration-log/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".nutrition.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "family": "nutrition",
        "access": "read",
        "permission": "See your Google Health nutrition data.",
        "onScopesPage": true,
        "inDiscoveryV4": false
      },
      {
        "shorthand": ".nutrition.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
        "family": "nutrition",
        "access": "write",
        "permission": "Add nutrition data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "hydrationLog",
    "dataPointEvidence": "Optional. Data for points in the `hydration-log` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"HydrationLog","nested":["VolumeQuantity","SessionTimeInterval"]},
    "rollup": {
      "property": "hydrationLog",
      "evidence": "Returned by default when rolling up data points from the `hydration-log` data type, or when requested explicitly using the `hydration-log` rollup type identifier.",
      "schema": {"id":"HydrationLogRollupValue","nested":["VolumeQuantityRollup"]}
    },
    "dailyRollup": {
      "property": "hydrationLog",
      "evidence": "Returned by default when rolling up data points from the `hydration-log` data type, or when requested explicitly using the `hydration-log` rollup type identifier.",
      "schema": {"id":"HydrationLogRollupValue","nested":["VolumeQuantityRollup"]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_HYDRATION_LOG",
    "fitbit": null,
    "fitbitScopes": ["nutrition"],
    "flags": [
      {
        "dataType": "hydration-log",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for hydration-log, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      },
      {
        "dataType": "hydration-log",
        "kind": "scope-not-in-discovery",
        "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "summary": "The table lists .nutrition.readonly for hydration-log, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
        "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
      }
    ]
  },
  {
    "dataType": "irregular-rhythm-notification",
    "name": "Irregular Rhythm Notification",
    "filterParam": "irregular_rhythm_notification",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#irregularrhythmnotification",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/irregular-rhythm-notification/dataPoints",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".irn.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.irn.readonly",
        "family": "irn",
        "access": "read",
        "permission": "See your Google Health Irregular Rhythm Notifications data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"}],
    "dataPointProperty": "irregularRhythmNotification",
    "dataPointEvidence": "Optional. Data for points in the `irregular-rhythm-notification` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"IrregularRhythmNotification","nested":["SessionTimeInterval","AlertWindow","MedicalDeviceInfo"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Irregular Rhythm Notifications (IRN)","description":null},
    "fitbitScopes": ["irregular_rhythm_notifications"],
    "flags": []
  },
  {
    "dataType": "menstrual-period",
    "name": "Menstrual Period",
    "filterParam": "menstrual_period",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#menstrualperiod",
    "operations": [
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/menstrual-period/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/menstrual-period/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/menstrual-period/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".reproductive_health.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
        "family": "reproductive_health",
        "access": "write",
        "permission": "Add reproductive health data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Women's Health guide","url":"https://developers.google.com/health/data-types/womens-health"}],
    "dataPointProperty": "menstrualPeriod",
    "dataPointEvidence": "Optional. Data for points in the `menstrual-period` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"MenstrualPeriod","nested":["ObservationTimeInterval"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": [],
    "flags": [
      {
        "dataType": "menstrual-period",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for menstrual-period, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "moods",
    "name": "Moods",
    "filterParam": "moods",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#moods",
    "operations": [
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/moods/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/moods/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/moods/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".mindfulness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
        "family": "mindfulness",
        "access": "write",
        "permission": "Add mindfulness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Women's Health guide","url":"https://developers.google.com/health/data-types/womens-health"}],
    "dataPointProperty": "moods",
    "dataPointEvidence": "Optional. Data for points in the `moods` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Moods","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": [],
    "flags": [
      {
        "dataType": "moods",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for moods, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "nutrition-log",
    "name": "Nutrition Log",
    "filterParam": "nutrition_log",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#nutritionlog",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/nutrition-log/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".nutrition.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "family": "nutrition",
        "access": "read",
        "permission": "See your Google Health nutrition data.",
        "onScopesPage": true,
        "inDiscoveryV4": false
      },
      {
        "shorthand": ".nutrition.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
        "family": "nutrition",
        "access": "write",
        "permission": "Add nutrition data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Nutrition guide","url":"https://developers.google.com/health/data-types/nutrition"}],
    "dataPointProperty": "nutritionLog",
    "dataPointEvidence": "Optional. Data for points in the `nutrition-log` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"NutritionLog","nested":["SessionTimeInterval","EnergyQuantity","NutrientQuantity","Serving","WeightQuantity"]},
    "rollup": {
      "property": "nutritionLog",
      "evidence": "Returned by default when rolling up data points from the `nutrition-log` data type, or when requested explicitly using the `nutrition-log` rollup type identifier.",
      "schema": {"id":"NutritionLogRollupValue","nested":["EnergyQuantityRollup","NutrientQuantityRollup","WeightQuantityRollup"]}
    },
    "dailyRollup": {
      "property": "nutritionLog",
      "evidence": "Returned by default when rolling up data points from the `nutrition-log` data type, or when requested explicitly using the `nutrition-log` rollup type identifier.",
      "schema": {"id":"NutritionLogRollupValue","nested":["EnergyQuantityRollup","NutrientQuantityRollup","WeightQuantityRollup"]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_NUTRITION_LOG",
    "fitbit": {"fitbitDataType":"Food Log","description":null},
    "fitbitScopes": ["nutrition"],
    "flags": [
      {
        "dataType": "nutrition-log",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for nutrition-log, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      },
      {
        "dataType": "nutrition-log",
        "kind": "scope-not-in-discovery",
        "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
        "summary": "The table lists .nutrition.readonly for nutrition-log, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
        "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
      }
    ]
  },
  {
    "dataType": "ovulation-test",
    "name": "Ovulation Test",
    "filterParam": "ovulation_test",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#ovulationtest",
    "operations": [
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/ovulation-test/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/ovulation-test/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/ovulation-test/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".reproductive_health.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
        "family": "reproductive_health",
        "access": "write",
        "permission": "Add reproductive health data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Women's Health guide","url":"https://developers.google.com/health/data-types/womens-health"}],
    "dataPointProperty": "ovulationTest",
    "dataPointEvidence": "Optional. Data for points in the `ovulation-test` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"OvulationTest","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": [],
    "flags": [
      {
        "dataType": "ovulation-test",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for ovulation-test, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "oxygen-saturation",
    "name": "Oxygen Saturation",
    "filterParam": "oxygen_saturation",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": "1 minute",
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#oxygensaturation",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/oxygen-saturation/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/oxygen-saturation/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "oxygenSaturation",
    "dataPointEvidence": "Optional. Data for points in the `oxygen-saturation` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"OxygenSaturation","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {
      "fitbitDataType": "SpO2 Intraday",
      "description": "Returns only validated minute-level SpO2 measurements and excludes readings flagged as invalid due to motion artifacts or low sensor confidence. Because the Fitbit Web API only excluded the 50% sentinel value, the Google Health API returns fewer data points for the same time range. For details, see Oxygen saturation filtering."
    },
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "respiratory-rate-sleep-summary",
    "name": "Respiratory Rate Sleep Summary",
    "filterParam": "respiratory_rate_sleep_summary",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#respiratoryratesleepsummary",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/respiratory-rate-sleep-summary/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/respiratory-rate-sleep-summary/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}
    ],
    "dataPointProperty": "respiratoryRateSleepSummary",
    "dataPointEvidence": "Optional. Data for points in the `respiratory-rate-sleep-summary` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"RespiratoryRateSleepSummary","nested":["RespiratoryRateSleepSummaryStatistics","ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_RESPIRATORY_RATE_SLEEP_SUMMARY",
    "fitbit": null,
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": []
  },
  {
    "dataType": "run-vo2-max",
    "name": "Run VO2 Max",
    "filterParam": "run_vo2_max",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#runvo2max",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/run-vo2-max/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/run-vo2-max/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/run-vo2-max/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/run-vo2-max/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "runVo2Max",
    "dataPointEvidence": "Optional. Data for points in the `run-vo2-max` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"RunVO2Max","nested":["ObservationSampleTime"]},
    "rollup": {
      "property": "runVo2Max",
      "evidence": "Returned by default when rolling up data points from the `run-vo2-max` data type, or when requested explicitly using the `run-vo2-max` rollup type identifier.",
      "schema": {"id":"RunVO2MaxRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "runVo2Max",
      "evidence": "Returned by default when rolling up data points from the `run-vo2-max` data type, or when requested explicitly using the `run-vo2-max` rollup type identifier.",
      "schema": {"id":"RunVO2MaxRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_RUN_VO2_MAX",
    "fitbit": {"fitbitDataType":"VO2 Max value when the user runs","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "sedentary-period",
    "name": "Sedentary Period",
    "filterParam": "sedentary_period",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#sedentaryperiod",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sedentary-period/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sedentary-period/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sedentary-period/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sedentary-period/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "sedentaryPeriod",
    "dataPointEvidence": "Optional. Data for points in the `sedentary-period` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"SedentaryPeriod","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "sedentaryPeriod",
      "evidence": "Returned by default when rolling up data points from the `sedentary-period` data type, or when requested explicitly using the `sedentary-period` rollup type identifier.",
      "schema": {"id":"SedentaryPeriodRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "sedentaryPeriod",
      "evidence": "Returned by default when rolling up data points from the `sedentary-period` data type, or when requested explicitly using the `sedentary-period` rollup type identifier.",
      "schema": {"id":"SedentaryPeriodRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_SEDENTARY_PERIOD",
    "fitbit": {"fitbitDataType":"Activity time series minutes sedentary","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "skin-temperature-sensors",
    "name": "Skin Temperature Sensors",
    "filterParam": "skin_temperature_sensors",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4beta",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4beta/users.dataTypes.dataPoints#skintemperaturesensors",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/skin-temperature-sensors/dataPoints",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Pixel Watch 5","url":"https://store.google.com/product/pixel_watch_5"}
    ],
    "guides": [
      {"title":"Vitals guide","url":"https://developers.google.com/health/data-types/vitals"},
      {"title":"Skin Temperature guide","url":"https://developers.google.com/health/data-types/skin-temperature"},
      {"title":"Women's Health guide","url":"https://developers.google.com/health/data-types/womens-health"}
    ],
    "dataPointProperty": "skinTemperatureSensors",
    "dataPointEvidence": "Optional. Data for points in the `skin-temperature-sensors` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4beta",
    "schema": {"id":"SkinTemperatureSensors","nested":["ObservationSampleTime","SensorData"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "skin-temperature-sensors",
        "kind": "no-v4-datapoint-property",
        "summary": "The v4 discovery document has no DataPoint property for skin-temperature-sensors; the v4beta document has skinTemperatureSensors, matching the table's v4beta tag.",
        "evidence": [
          {"source":"dataTypes","text":"Skin Temperature Sensors"},
          {"source":"dataTypes","text":"list"},
          {"source":"discoveryV4beta","text":"Optional. Data for points in the `skin-temperature-sensors` sample data type collection."}
        ]
      }
    ]
  },
  {
    "dataType": "sleep",
    "name": "Sleep",
    "filterParam": "sleep",
    "recordType": "Session",
    "recordTypeDefinition": "Represents a continuous block of recording, such as a workout or an electrocardiogram (ECG) session.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#sleep",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/sleep/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".sleep.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
        "family": "sleep",
        "access": "read",
        "permission": "See your Google Health sleep data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".sleep.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.sleep.writeonly",
        "family": "sleep",
        "access": "write",
        "permission": "Add sleep data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Sleep guide","url":"https://developers.google.com/health/data-types/sleep"}],
    "dataPointProperty": "sleep",
    "dataPointEvidence": "Optional. Data for points in the `sleep` session data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Sleep","nested":["SessionTimeInterval","SleepMetadata","OutOfBedSegment","SleepStage","SleepSummary"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_SLEEP",
    "fitbit": {"fitbitDataType":"Sleep","description":null},
    "fitbitScopes": ["sleep"],
    "flags": [
      {
        "dataType": "sleep",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for sleep, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "steps",
    "name": "Steps",
    "filterParam": "steps",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": true,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#steps",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/steps/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/steps/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/steps/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/steps/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Steps guide","url":"https://developers.google.com/health/data-types/steps"}],
    "dataPointProperty": "steps",
    "dataPointEvidence": "Optional. Data for points in the `steps` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Steps","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "steps",
      "evidence": "Returned by default when rolling up data points from the `steps` data type, or when requested explicitly using the `steps` rollup type identifier.",
      "schema": {"id":"StepsRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "steps",
      "evidence": "Returned by default when rolling up data points from the `steps` data type, or when requested explicitly using the `steps` rollup type identifier.",
      "schema": {"id":"StepsRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_STEPS",
    "fitbit": {"fitbitDataType":"Steps","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "swim-lengths-data",
    "name": "Swim Lengths Data",
    "filterParam": "swim_lengths_data",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#swimlengthsdata",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/swim-lengths-data/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/swim-lengths-data/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/swim-lengths-data/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/swim-lengths-data/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "swimLengthsData",
    "dataPointEvidence": "Optional. Data for points in the `swim-lengths-data` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"SwimLengthsData","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "swimLengthsData",
      "evidence": "Returned by default when rolling up data points from the `swim-lengths-data` data type, or when requested explicitly using the `swim-lengths-data` rollup type identifier.",
      "schema": {"id":"SwimLengthsDataRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "swimLengthsData",
      "evidence": "Returned by default when rolling up data points from the `swim-lengths-data` data type, or when requested explicitly using the `swim-lengths-data` rollup type identifier.",
      "schema": {"id":"SwimLengthsDataRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"Activity time series swimming strokes","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "symptoms",
    "name": "Symptoms",
    "filterParam": "symptoms",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#symptoms",
    "operations": [
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/symptoms/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/symptoms/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/symptoms/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".logged_symptoms.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
        "family": "logged_symptoms",
        "access": "write",
        "permission": "Add logged symptoms data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [{"title":"Women's Health guide","url":"https://developers.google.com/health/data-types/womens-health"}],
    "dataPointProperty": "symptoms",
    "dataPointEvidence": "Optional. Data for points in the `symptoms` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Symptoms","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": null,
    "fitbitScopes": [],
    "flags": [
      {
        "dataType": "symptoms",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for symptoms, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  },
  {
    "dataType": "time-in-heart-rate-zone",
    "name": "Time in Heart Rate Zone",
    "filterParam": "time_in_heart_rate_zone",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#timeinheartratezone",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/time-in-heart-rate-zone/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/time-in-heart-rate-zone/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/time-in-heart-rate-zone/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/time-in-heart-rate-zone/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [],
    "guides": [],
    "dataPointProperty": "timeInHeartRateZone",
    "dataPointEvidence": "Optional. Data for points in the `time-in-heart-rate-zone` interval data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"TimeInHeartRateZone","nested":["ObservationTimeInterval"]},
    "rollup": {
      "property": "timeInHeartRateZone",
      "evidence": "Returned by default when rolling up data points from the `time-in-heart-rate-zone` data type, or when requested explicitly using the `time-in-heart-rate-zone` rollup type identifier.",
      "schema": {"id":"TimeInHeartRateZoneRollupValue","nested":["TimeInHeartRateZoneValue"]}
    },
    "dailyRollup": {
      "property": "timeInHeartRateZone",
      "evidence": "Returned by default when rolling up data points from the `time-in-heart-rate-zone` data type, or when requested explicitly using the `time-in-heart-rate-zone` rollup type identifier.",
      "schema": {"id":"TimeInHeartRateZoneRollupValue","nested":["TimeInHeartRateZoneValue"]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_TIME_IN_HEART_RATE_ZONE",
    "fitbit": null,
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "total-calories",
    "name": "Total Calories",
    "filterParam": "total_calories",
    "recordType": "Interval",
    "recordTypeDefinition": "Represents measurements recorded over a duration.",
    "storageResolution": "1 minute",
    "webhookSupport": false,
    "trueZerosSupport": true,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/rollUp#RollupDataPoint.FIELDS.total_calories",
    "operations": [
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/total-calories/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/total-calories/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta","url":null},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Flex 2","url":null},
      {"name":"Fitbit Inspire","url":null},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Inspire HR","url":null},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Fitbit MobileTrack","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [{"title":"Calories and energy guide","url":"https://developers.google.com/health/data-types/calories"}],
    "dataPointProperty": null,
    "dataPointEvidence": null,
    "dataPointMatch": null,
    "dataPointSource": null,
    "schema": null,
    "rollup": {
      "property": "totalCalories",
      "evidence": "Returned by default when rolling up data points from the `total-calories` data type, or when requested explicitly using the `total-calories` rollup type identifier.",
      "schema": {"id":"TotalCaloriesRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "totalCalories",
      "evidence": "Returned by default when rolling up data points from the `total-calories` data type, or when requested explicitly using the `total-calories` rollup type identifier.",
      "schema": {"id":"TotalCaloriesRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {
      "fitbitDataType": "Activity `caloriesOut`",
      "description": "The complete number of calories burned by a user over a period of time, inclusive of basal metabolic rate and active energy burned."
    },
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": [
      {
        "dataType": "total-calories",
        "kind": "no-v4-datapoint-property",
        "summary": "Neither discovery document has a DataPoint property for total-calories; it exists only as a rollup (totalCalories), matching the table's operations (rollup, dailyRollup).",
        "evidence": [
          {"source":"dataTypes","text":"Total Calories"},
          {"source":"dataTypes","text":"rollup, dailyRollup"},
          {
            "source": "discoveryV4",
            "text": "Returned by default when rolling up data points from the `total-calories` data type, or when requested explicitly using the `total-calories` rollup type identifier."
          }
        ]
      },
      {
        "dataType": "total-calories",
        "kind": "release-note-webhook-type-not-listed",
        "summary": "Google's release notes for April 14, 2026 list totalCalories under webhook notification support; the data-types table and the webhooks page do not list total-calories as webhook-supported.",
        "evidence": [
          {
            "source": "releaseNotes",
            "text": "Notification support for the data types `activeZoneMinutes`, `altitude`, `bodyFat`, `caloriesInHeartRateZone`, `dailyHeartRateVariability`, `dailyHeartRateZones`, `dailyOxygenSaturation`, `dailyRestingHeartRate`, `dailySleepTemperatureDerivations`, `distance`, `exercise`, `floors`, `heartRate`, `sleep`, `steps`, `totalCalories`, and `weight`."
          }
        ]
      }
    ]
  },
  {
    "dataType": "vo2-max",
    "name": "VO2 Max",
    "filterParam": "vo2_max",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": false,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#vo2max",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/vo2-max/dataPoints",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/vo2-max/dataPoints:reconcile",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".activity_and_fitness.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
        "family": "activity_and_fitness",
        "access": "read",
        "permission": "See your Google Health activity and fitness data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".activity_and_fitness.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
        "family": "activity_and_fitness",
        "access": "write",
        "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [
      {"name":"Fitbit Air","url":"https://store.google.com/product/google_fitbit_air"},
      {"name":"Fitbit Alta HR","url":null},
      {"name":"Fitbit Blaze","url":null},
      {"name":"Fitbit Charge 2","url":null},
      {"name":"Fitbit Charge 3","url":null},
      {"name":"Fitbit Charge 4","url":null},
      {"name":"Fitbit Charge 5","url":null},
      {"name":"Fitbit Charge 6","url":"https://store.google.com/product/fitbit_charge_6"},
      {"name":"Fitbit Inspire 2","url":null},
      {"name":"Fitbit Inspire 3","url":"https://store.google.com/product/fitbit_inspire_3"},
      {"name":"Fitbit Ionic","url":null},
      {"name":"Fitbit Luxe","url":null},
      {"name":"Pixel Watch","url":null},
      {"name":"Pixel Watch 2","url":null},
      {"name":"Pixel Watch 3","url":"https://store.google.com/product/pixel_watch_3"},
      {"name":"Pixel Watch 4","url":"https://store.google.com/product/pixel_watch_4"},
      {"name":"Fitbit Sense","url":null},
      {"name":"Fitbit Sense 2","url":"https://store.google.com/product/fitbit_sense_2"},
      {"name":"Fitbit Versa","url":null},
      {"name":"Fitbit Versa 2","url":null},
      {"name":"Fitbit Versa 3","url":null},
      {"name":"Fitbit Versa 4","url":"https://store.google.com/product/fitbit_versa_4"},
      {"name":"Fitbit Versa Lite","url":null}
    ],
    "guides": [],
    "dataPointProperty": "vo2Max",
    "dataPointEvidence": "Optional. Data for points in the `vo2-max` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"VO2Max","nested":["ObservationSampleTime"]},
    "rollup": null,
    "dailyRollup": null,
    "webhookOnWebhooksPage": false,
    "webhookToken": null,
    "fitbit": {"fitbitDataType":"VO2 Max value","description":null},
    "fitbitScopes": ["activity","cardio_fitness"],
    "flags": []
  },
  {
    "dataType": "weight",
    "name": "Weight",
    "filterParam": "weight",
    "recordType": "Sample",
    "recordTypeDefinition": "Represents instantaneous measurements.",
    "storageResolution": null,
    "webhookSupport": true,
    "trueZerosSupport": false,
    "channel": "v4",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#weight",
    "operations": [
      {
        "op": "list",
        "method": "list",
        "methodId": "health.users.dataTypes.dataPoints.list",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints",
        "evidence": null
      },
      {
        "op": "get",
        "method": "get",
        "methodId": "health.users.dataTypes.dataPoints.get",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints/{dataPointsId}",
        "evidence": null
      },
      {
        "op": "reconcile",
        "method": "reconcile",
        "methodId": "health.users.dataTypes.dataPoints.reconcile",
        "match": "exact",
        "httpMethod": "GET",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints:reconcile",
        "evidence": null
      },
      {
        "op": "rollup",
        "method": "rollUp",
        "methodId": "health.users.dataTypes.dataPoints.rollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints:rollUp",
        "evidence": "Google's table prints \"rollup\"; the discovery document names the method \"rollUp\"."
      },
      {
        "op": "dailyRollup",
        "method": "dailyRollUp",
        "methodId": "health.users.dataTypes.dataPoints.dailyRollUp",
        "match": "case-insensitive",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints:dailyRollUp",
        "evidence": "Google's table prints \"dailyRollup\"; the discovery document names the method \"dailyRollUp\"."
      },
      {
        "op": "create",
        "method": "create",
        "methodId": "health.users.dataTypes.dataPoints.create",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints",
        "evidence": null
      },
      {
        "op": "update",
        "method": "patch",
        "methodId": "health.users.dataTypes.dataPoints.patch",
        "match": "endpoint-mapping",
        "httpMethod": "PATCH",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints/{dataPointsId}",
        "evidence": "Google's endpoint-mapping table: \"CREATE & UPDATE Logs → `patch` method\"; the discovery document's patch method: \"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.\""
      },
      {
        "op": "batchDelete",
        "method": "batchDelete",
        "methodId": "health.users.dataTypes.dataPoints.batchDelete",
        "match": "exact",
        "httpMethod": "POST",
        "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
        "path": "https://health.googleapis.com/v4/users/{usersId}/dataTypes/weight/dataPoints:batchDelete",
        "evidence": null
      }
    ],
    "scopes": [
      {
        "shorthand": ".health_metrics_and_measurements.readonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
        "family": "health_metrics_and_measurements",
        "access": "read",
        "permission": "See your Google Health health metrics and measurement data.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      },
      {
        "shorthand": ".health_metrics_and_measurements.writeonly",
        "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
        "family": "health_metrics_and_measurements",
        "access": "write",
        "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
        "onScopesPage": true,
        "inDiscoveryV4": true
      }
    ],
    "compatibleDevices": [{"name":"Fitbit Aria","url":null},{"name":"Fitbit Aria 2","url":null},{"name":"Fitbit Aria Air","url":"https://store.google.com/product/fitbit_aria_air"}],
    "guides": [],
    "dataPointProperty": "weight",
    "dataPointEvidence": "Optional. Data for points in the `weight` sample data type collection.",
    "dataPointMatch": "description",
    "dataPointSource": "v4",
    "schema": {"id":"Weight","nested":["ObservationSampleTime"]},
    "rollup": {
      "property": "weight",
      "evidence": "Returned by default when rolling up data points from the `weight` data type, or when requested explicitly using the `weight` rollup type identifier.",
      "schema": {"id":"WeightRollupValue","nested":[]}
    },
    "dailyRollup": {
      "property": "weight",
      "evidence": "Returned by default when rolling up data points from the `weight` data type, or when requested explicitly using the `weight` rollup type identifier.",
      "schema": {"id":"WeightRollupValue","nested":[]}
    },
    "webhookOnWebhooksPage": true,
    "webhookToken": "WEBHOOK_DATA_TYPE_WEIGHT",
    "fitbit": {"fitbitDataType":"Weight","description":null},
    "fitbitScopes": ["blood_glucose","heartrate","oxygen_saturation","respiratory_rate","temperature","weight"],
    "flags": [
      {
        "dataType": "weight",
        "kind": "operation-name-differs",
        "summary": "The table lists \"update\" for weight, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
        "evidence": [
          {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
          {"source":"apiSpecifications","text":"`patch` method"},
          {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
        ]
      }
    ]
  }
];

/** The Scopes page's table, in Google's order. */
export const GHAPI_DOCUMENTED_SCOPES: {
  shorthand: string;
  url: string;
  family: string;
  /** The row-group anchor Google's table uses for the family; null where absent. */
  familyAnchor: string | null;
  access: "read" | "write";
  permission: string;
  inDiscoveryV4: boolean;
  discoveryDescription: string | null;
}[] = [
  {
    "shorthand": ".activity_and_fitness.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
    "family": "activity_and_fitness",
    "familyAnchor": "activity_and_fitness",
    "access": "read",
    "permission": "See your Google Health activity and fitness data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health activity and fitness data"
  },
  {
    "shorthand": ".activity_and_fitness.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
    "family": "activity_and_fitness",
    "familyAnchor": "activity_and_fitness",
    "access": "write",
    "permission": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add activity and fitness data to Google Health, and edit or delete the data it adds."
  },
  {
    "shorthand": ".ecg.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
    "family": "ecg",
    "familyAnchor": "ecg",
    "access": "read",
    "permission": "See your Google Health ECG data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health ECG data"
  },
  {
    "shorthand": ".health_metrics_and_measurements.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
    "family": "health_metrics_and_measurements",
    "familyAnchor": "health_metrics_and_measurements",
    "access": "read",
    "permission": "See your Google Health health metrics and measurement data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health health metrics and measurement data"
  },
  {
    "shorthand": ".health_metrics_and_measurements.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
    "family": "health_metrics_and_measurements",
    "familyAnchor": "health_metrics_and_measurements",
    "access": "write",
    "permission": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add health metric and measurements data to Google Health, and edit or delete the data it adds."
  },
  {
    "shorthand": ".irn.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.irn.readonly",
    "family": "irn",
    "familyAnchor": "irn",
    "access": "read",
    "permission": "See your Google Health Irregular Rhythm Notifications data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health Irregular Rhythm Notifications data"
  },
  {
    "shorthand": ".location.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.location.readonly",
    "family": "location",
    "familyAnchor": "location",
    "access": "read",
    "permission": "See your Google Health GPS location recorded during an exercise.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See exercise GPS location data in Google Health"
  },
  {
    "shorthand": ".logged_symptoms.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
    "family": "logged_symptoms",
    "familyAnchor": "logged_symptoms",
    "access": "write",
    "permission": "Add logged symptoms data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add logged symptoms data to Google Health, and edit or delete the data it adds"
  },
  {
    "shorthand": ".mindfulness.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
    "family": "mindfulness",
    "familyAnchor": "mindfulness",
    "access": "write",
    "permission": "Add mindfulness data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add mindfulness data to Google Health, and edit or delete the data it adds"
  },
  {
    "shorthand": ".nutrition.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "family": "nutrition",
    "familyAnchor": "nutrition",
    "access": "read",
    "permission": "See your Google Health nutrition data.",
    "inDiscoveryV4": false,
    "discoveryDescription": null
  },
  {
    "shorthand": ".nutrition.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
    "family": "nutrition",
    "familyAnchor": "nutrition",
    "access": "write",
    "permission": "Add nutrition data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add nutrition data to Google Health, and edit or delete the data it adds."
  },
  {
    "shorthand": ".profile.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.profile.readonly",
    "family": "profile",
    "familyAnchor": "profile",
    "access": "read",
    "permission": "See your Google Health profile data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health profile data"
  },
  {
    "shorthand": ".profile.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.profile.writeonly",
    "family": "profile",
    "familyAnchor": "profile",
    "access": "write",
    "permission": "Add profile data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add profile data to Google Health, and edit or delete the data it adds."
  },
  {
    "shorthand": ".reproductive_health.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
    "family": "reproductive_health",
    "familyAnchor": "reproductive_health",
    "access": "write",
    "permission": "Add reproductive health data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add reproductive health data to Google Health, and edit or delete the data it adds"
  },
  {
    "shorthand": ".settings.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.settings.readonly",
    "family": "settings",
    "familyAnchor": "settings",
    "access": "read",
    "permission": "See your Google Health settings.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health settings"
  },
  {
    "shorthand": ".settings.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.settings.writeonly",
    "family": "settings",
    "familyAnchor": "settings",
    "access": "write",
    "permission": "Add settings data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add settings data to Google Health, and edit or delete the data it adds."
  },
  {
    "shorthand": ".sleep.readonly",
    "url": "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
    "family": "sleep",
    "familyAnchor": "sleep",
    "access": "read",
    "permission": "See your Google Health sleep data.",
    "inDiscoveryV4": true,
    "discoveryDescription": "See your Google Health sleep data"
  },
  {
    "shorthand": ".sleep.writeonly",
    "url": "https://www.googleapis.com/auth/googlehealth.sleep.writeonly",
    "family": "sleep",
    "familyAnchor": "sleep",
    "access": "write",
    "permission": "Add sleep data to Google Health, and edit or delete the data it adds.",
    "inDiscoveryV4": true,
    "discoveryDescription": "Add sleep data to Google Health, and edit or delete the data it adds."
  }
];

/** Every scope the v4 discovery document defines. */
export const GHAPI_DISCOVERY_SCOPES: { url: string; description: string | null; googleHealth: boolean; shorthand: string | null; onScopesPage: boolean; inV4beta: boolean }[] = [
  {
    "url": "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
    "description": "See your Google Health ECG data",
    "googleHealth": true,
    "shorthand": ".ecg.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.sleep.writeonly",
    "description": "Add sleep data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".sleep.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
    "description": "See your Google Health activity and fitness data",
    "googleHealth": true,
    "shorthand": ".activity_and_fitness.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.settings.writeonly",
    "description": "Add settings data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".settings.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
    "description": "See your Google Health reproductive health data",
    "googleHealth": true,
    "shorthand": ".reproductive_health.readonly",
    "onScopesPage": false,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
    "description": "See your Google Health mindfulness data",
    "googleHealth": true,
    "shorthand": ".mindfulness.readonly",
    "onScopesPage": false,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
    "description": "See your Google Health sleep data",
    "googleHealth": true,
    "shorthand": ".sleep.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.location.readonly",
    "description": "See exercise GPS location data in Google Health",
    "googleHealth": true,
    "shorthand": ".location.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
    "description": "Add reproductive health data to Google Health, and edit or delete the data it adds",
    "googleHealth": true,
    "shorthand": ".reproductive_health.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
    "description": "See your Google Health logged symptoms data",
    "googleHealth": true,
    "shorthand": ".logged_symptoms.readonly",
    "onScopesPage": false,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.settings.readonly",
    "description": "See your Google Health settings",
    "googleHealth": true,
    "shorthand": ".settings.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
    "description": "See your Google Health health metrics and measurement data",
    "googleHealth": true,
    "shorthand": ".health_metrics_and_measurements.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.profile.writeonly",
    "description": "Add profile data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".profile.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
    "description": "Add activity and fitness data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".activity_and_fitness.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/cloud-platform",
    "description": "See, edit, configure, and delete your Google Cloud data and see the email address for your Google Account.",
    "googleHealth": false,
    "shorthand": null,
    "onScopesPage": false,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
    "description": "Add health metric and measurements data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".health_metrics_and_measurements.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
    "description": "Add logged symptoms data to Google Health, and edit or delete the data it adds",
    "googleHealth": true,
    "shorthand": ".logged_symptoms.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.irn.readonly",
    "description": "See your Google Health Irregular Rhythm Notifications data",
    "googleHealth": true,
    "shorthand": ".irn.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
    "description": "Add nutrition data to Google Health, and edit or delete the data it adds.",
    "googleHealth": true,
    "shorthand": ".nutrition.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.profile.readonly",
    "description": "See your Google Health profile data",
    "googleHealth": true,
    "shorthand": ".profile.readonly",
    "onScopesPage": true,
    "inV4beta": true
  },
  {
    "url": "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
    "description": "Add mindfulness data to Google Health, and edit or delete the data it adds",
    "googleHealth": true,
    "shorthand": ".mindfulness.writeonly",
    "onScopesPage": true,
    "inV4beta": true
  }
];

/** Every method in the v4 discovery document, by resource. */
export const GHAPI_METHODS: GhapiMethod[] = [
  {
    "id": "health.projects.subscribers.create",
    "resource": "projects.subscribers",
    "name": "create",
    "httpMethod": "POST",
    "flatPath": "v4/projects/{projectsId}/subscribers",
    "path": "v4/{+parent}/subscribers",
    "description": "Registers a new subscriber endpoint to receive notifications. A subscriber represents an application or service that wishes to receive data change notifications for users who have granted consent. **Endpoint Verification:** For a subscriber to be successfully created, the provided `endpoint_uri` must be a valid HTTPS endpoint and must pass an automated verification check. The backend will send two HTTP POST requests to the `endpoint_uri`: 1. **Verification with Authorization:** * **Headers:** Includes `Content-Type: application/json` and `Authorization` (with the exact value from `CreateSubscriberPayload.endpoint_authorization.secret`). * **Body:** `{\"type\": \"verification\"}` * **Expected Response:** HTTP `201 Created`. 2. **Verification without Authorization:** * **Headers:** Includes `Content-Type: application/json`. The `Authorization` header is OMITTED. * **Body:** `{\"type\": \"verification\"}` * **Expected Response:** HTTP `401 Unauthorized` or `403 Forbidden`. Both tests must pass for the subscriber creation to succeed. If verification fails, the operation will not be completed and an error will be returned. This process ensures the endpoint is reachable and correctly validates the `Authorization` header.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "subscriberId",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. The ID to use for the subscriber, which will become the final component of the subscriber's resource name. This value should be 4-36 characters, and valid characters are /[a-z]([a-z0-9-]{2,34}[a-z0-9])/."
      },
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent resource where this subscriber will be created. Format: projects/{project_number} Example: projects/1234567890"
      }
    ],
    "request": "CreateSubscriberPayload",
    "response": "Operation"
  },
  {
    "id": "health.projects.subscribers.delete",
    "resource": "projects.subscribers",
    "name": "delete",
    "httpMethod": "DELETE",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}",
    "path": "v4/{+name}",
    "description": "Deletes a subscriber registration. This will stop all notifications to the subscriber's endpoint.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The name of the subscriber to delete. Format: projects/{project}/subscribers/{subscriber} Example: projects/my-project/subscribers/my-subscriber-123 The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) or system-generated if not provided during creation."
      },
      {
        "name": "force",
        "location": "query",
        "required": false,
        "type": "boolean",
        "description": "Optional. If set to true, any child resources (e.g., subscriptions) will also be deleted. If false (default) and child resources exist, the request will fail."
      }
    ],
    "request": null,
    "response": "Operation"
  },
  {
    "id": "health.projects.subscribers.list",
    "resource": "projects.subscribers",
    "name": "list",
    "httpMethod": "GET",
    "flatPath": "v4/projects/{projectsId}/subscribers",
    "path": "v4/{+parent}/subscribers",
    "description": "Lists all subscribers registered within the owned Google Cloud Project.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent, which owns this collection of subscribers. Format: projects/{project}"
      },
      {
        "name": "pageSize",
        "location": "query",
        "required": false,
        "type": "integer",
        "description": "Optional. The maximum number of subscribers to return. The service may return fewer than this value. If unspecified, at most 50 subscribers will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000."
      },
      {
        "name": "pageToken",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. A page token, received from a previous `ListSubscribers` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSubscribers` must match the call that provided the page token."
      }
    ],
    "request": null,
    "response": "ListSubscribersResponse"
  },
  {
    "id": "health.projects.subscribers.patch",
    "resource": "projects.subscribers",
    "name": "patch",
    "httpMethod": "PATCH",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}",
    "path": "v4/{+name}",
    "description": "Updates the configuration of an existing subscriber, such as the endpoint URI or the data types it's interested in. **Endpoint Verification:** If the `endpoint_uri` or `endpoint_authorization` field is included in the `update_mask`, the backend will re-verify the endpoint. The verification process is the same as described in `CreateSubscriber`: 1. **Verification with Authorization:** POST to the new or existing `endpoint_uri` with the new or existing `Authorization` secret. Expects HTTP `201 Created`. 2. **Verification without Authorization:** POST to the `endpoint_uri` without the `Authorization` header. Expects HTTP `401 Unauthorized` or `403 Forbidden`. Both tests must pass using the potentially updated values for the subscriber update to succeed. If verification fails, the update will not be applied, and an error will be returned.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Identifier. The resource name of the Subscriber. Format: projects/{project}/subscribers/{subscriber} The {project} ID is a Google Cloud Project ID or Project Number. The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) if provided during creation, or system-generated otherwise (e.g., a UUID). Example (User-settable subscriber ID): projects/my-project/subscribers/my-sub-123 Example (System-generated subscriber ID): projects/my-project/subscribers/a1b2c3d4-e5f6-7890-1234-567890abcdef"
      },
      {
        "name": "updateMask",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. A field mask that specifies which fields of the Subscriber message are to be updated. This allows for partial updates. Supported fields: - endpoint_uri - subscriber_configs - endpoint_authorization"
      }
    ],
    "request": "Subscriber",
    "response": "Operation"
  },
  {
    "id": "health.projects.subscribers.subscriptions.create",
    "resource": "projects.subscribers.subscriptions",
    "name": "create",
    "httpMethod": "POST",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}/subscriptions",
    "path": "v4/{+parent}/subscriptions",
    "description": "Creates a subscription for a specific user to a specific subscriber. This method requires the subscriber to have a `SubscriptionCreatePolicy` set to `MANUAL` for the given data types.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "subscriptionId",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. The {subscription_id} is user-settable (4-36 chars, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) or system-generated otherwise. If provided, the ID must be unique within the parent subscriber."
      },
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent subscriber. Format: projects/{project}/subscribers/{subscriber} The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) if provided during creation, or system-generated otherwise."
      }
    ],
    "request": "CreateSubscriptionPayload",
    "response": "Subscription"
  },
  {
    "id": "health.projects.subscribers.subscriptions.delete",
    "resource": "projects.subscribers.subscriptions",
    "name": "delete",
    "httpMethod": "DELETE",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}/subscriptions/{subscriptionsId}",
    "path": "v4/{+name}",
    "description": "Deletes a specific user subscription, stopping notifications for this user to this subscriber.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The resource name of the subscription to delete. Format: `projects/{project}/subscribers/{subscriber}/subscriptions/{subscription}` Example: `projects/my-project/subscribers/my-subscriber-123/subscriptions/my-subscription-456` The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) if provided during creation, or system-generated otherwise. The {subscription} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) or system-generated if not provided during creation."
      }
    ],
    "request": null,
    "response": "Empty"
  },
  {
    "id": "health.projects.subscribers.subscriptions.list",
    "resource": "projects.subscribers.subscriptions",
    "name": "list",
    "httpMethod": "GET",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}/subscriptions",
    "path": "v4/{+parent}/subscriptions",
    "description": "Lists all active subscriptions for a given subscriber. This can be filtered, for example, by user or data type.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent subscriber. Format: projects/{project}/subscribers/{subscriber} The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) if provided during creation, or system-generated otherwise."
      },
      {
        "name": "filter",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. A filter to apply to the list of subscriptions. The filter syntax is described in https://google.aip.dev/160. The filter can be applied to the following fields: - `user` - `data_type` The `user` identifier (e.g., `user1` in `users/user1`) refers to the public `health_user_id` Example: user = \"users/user1\" Example: user = \"users/user1\" OR user = \"users/user2\" Example: user = \"users/user1\" AND (data_type = \"sleep\" OR data_type = \"weight\")"
      },
      {
        "name": "pageSize",
        "location": "query",
        "required": false,
        "type": "integer",
        "description": "Optional. The maximum number of subscriptions to return. The service may return fewer than this value. If unspecified, at most 50 subscriptions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000."
      },
      {
        "name": "pageToken",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. A page token, received from a previous `ListSubscriptions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListSubscriptions` must match the call that provided the page token."
      }
    ],
    "request": null,
    "response": "ListSubscriptionsResponse"
  },
  {
    "id": "health.projects.subscribers.subscriptions.patch",
    "resource": "projects.subscribers.subscriptions",
    "name": "patch",
    "httpMethod": "PATCH",
    "flatPath": "v4/projects/{projectsId}/subscribers/{subscribersId}/subscriptions/{subscriptionsId}",
    "path": "v4/{+name}",
    "description": "Updates the data types for an existing user subscription.",
    "scopes": ["https://www.googleapis.com/auth/cloud-platform"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Identifier. The resource name of the Subscription. Format: `projects/{project}/subscribers/{subscriber}/subscriptions/{subscription}` Example: `projects/my-project/subscribers/my-subscriber-123/subscriptions/my-subscription-456` The {project} ID is mandatory (6-30 characters, matching /a-z{6,30}/) The {subscriber} ID is user-settable (4-36 characters, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) if provided during creation, or system-generated otherwise. The {subscription} ID is user-settable (4-36 chars, matching /[a-z]([a-z0-9-]{2,34}[a-z0-9])/) or system-generated otherwise."
      },
      {"name":"updateMask","location":"query","required":false,"type":"string","description":"Optional. The list of fields to update."}
    ],
    "request": "Subscription",
    "response": "Subscription"
  },
  {
    "id": "health.shl.m.getShlManifest",
    "resource": "shl.m",
    "name": "getShlManifest",
    "httpMethod": "POST",
    "flatPath": "v4/shl/m/{externalShlId}",
    "path": "v4/shl/m/{externalShlId}",
    "description": "Forward a manifest request for a given SHL",
    "scopes": [],
    "parameters": [
      {
        "name": "externalShlId",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. External ID mapping to a ShlSharedLinkCapabilityToken object See https://docs.google.com/document/d/1Pch20pxJHRbsaMxp0EYgs3ZU0Gu7QTUznk8LhvbQvfY/edit?tab=t.0#heading=h.17wg41voij6q"
      }
    ],
    "request": "ManifestParams",
    "response": "HttpBody"
  },
  {
    "id": "health.shl.r.get",
    "resource": "shl.r",
    "name": "get",
    "httpMethod": "GET",
    "flatPath": "v4/shl/r/{externalShlId}/{resourceToken}",
    "path": "v4/shl/r/{externalShlId}/{resourceToken}",
    "description": "Forward a resource request for a given SHL",
    "scopes": [],
    "parameters": [
      {
        "name": "externalShlId",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. External ID mapping to a ShlSharedLinkCapabilityToken object See https://docs.google.com/document/d/1Pch20pxJHRbsaMxp0EYgs3ZU0Gu7QTUznk8LhvbQvfY/edit?tab=t.0#heading=h.17wg41voij6q"
      },
      {
        "name": "resourceToken",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. Encoded, encrypted message containing resource access details"
      }
    ],
    "request": null,
    "response": "HttpBody"
  },
  {
    "id": "health.users.getIdentity",
    "resource": "users",
    "name": "getIdentity",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/identity",
    "path": "v4/{+name}",
    "description": "Gets the user's identity. It includes the legacy Fitbit user ID and the Google user ID and it can be used by migrating clients to map identifiers between the two systems.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.profile.readonly",
      "https://www.googleapis.com/auth/googlehealth.profile.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.settings.readonly",
      "https://www.googleapis.com/auth/googlehealth.settings.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [{"name":"name","location":"path","required":true,"type":"string","description":"Required. The resource name of the Identity. Format: `users/me/identity`"}],
    "request": null,
    "response": "Identity"
  },
  {
    "id": "health.users.getIrnProfile",
    "resource": "users",
    "name": "getIrnProfile",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/irnProfile",
    "path": "v4/{+name}",
    "description": "Returns user's IRN Profile details.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.irn.readonly"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The resource name of the IRN Profile. Format: `users/{user}/irnProfile` Example: `users/1234567890/irnProfile` or `users/me/irnProfile` The {user} ID is a system-generated Google Health API user ID, a string of 1-63 characters consisting of lowercase and uppercase letters, numbers, and hyphens. The literal `me` can also be used to refer to the authenticated user."
      }
    ],
    "request": null,
    "response": "IrnProfile"
  },
  {
    "id": "health.users.getProfile",
    "resource": "users",
    "name": "getProfile",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/profile",
    "path": "v4/{+name}",
    "description": "Returns user Profile details.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.profile.readonly"],
    "parameters": [{"name":"name","location":"path","required":true,"type":"string","description":"Required. The name of the Profile. Format: `users/me/profile`."}],
    "request": null,
    "response": "Profile"
  },
  {
    "id": "health.users.getSettings",
    "resource": "users",
    "name": "getSettings",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/settings",
    "path": "v4/{+name}",
    "description": "Returns user settings details.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.settings.readonly"],
    "parameters": [{"name":"name","location":"path","required":true,"type":"string","description":"Required. The name of the Settings. Format: `users/me/settings`."}],
    "request": null,
    "response": "Settings"
  },
  {
    "id": "health.users.updateProfile",
    "resource": "users",
    "name": "updateProfile",
    "httpMethod": "PATCH",
    "flatPath": "v4/users/{usersId}/profile",
    "path": "v4/{+name}",
    "description": "Updates the user's profile details.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.profile.writeonly"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Identifier. The resource name of this Profile resource. Format: `users/{user}/profile` Example: `users/1234567890/profile` or `users/me/profile` The {user} ID is a system-generated Google Health API user ID, a string of 1-63 characters consisting of lowercase and uppercase letters, numbers, and hyphens. The literal `me` can also be used to refer to the authenticated user. This field is read-only."
      },
      {"name":"updateMask","location":"query","required":false,"type":"string","description":"Optional. The list of fields to be updated."}
    ],
    "request": "Profile",
    "response": "Profile"
  },
  {
    "id": "health.users.updateSettings",
    "resource": "users",
    "name": "updateSettings",
    "httpMethod": "PATCH",
    "flatPath": "v4/users/{usersId}/settings",
    "path": "v4/{+name}",
    "description": "Updates the user's settings details.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.settings.writeonly"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Identifier. The resource name of this Settings resource. Format: `users/{user}/settings` Example: `users/1234567890/settings` or `users/me/settings` The {user} ID is a system-generated Google Health API user ID, a string of 1-63 characters consisting of lowercase and uppercase letters, numbers, and hyphens. The literal `me` can also be used to refer to the authenticated user. This field is read-only."
      },
      {"name":"updateMask","location":"query","required":false,"type":"string","description":"Optional. The list of fields to be updated."}
    ],
    "request": "Settings",
    "response": "Settings"
  },
  {
    "id": "health.users.dataTypes.dataPoints.batchDelete",
    "resource": "users.dataTypes.dataPoints",
    "name": "batchDelete",
    "httpMethod": "POST",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:batchDelete",
    "path": "v4/{+parent}/dataPoints:batchDelete",
    "description": "Delete a batch of identifyable data points.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Optional. Parent (data type) for the Data Point collection Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` - `users/me/dataTypes/-` - `users/1234567890/dataTypes/-` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). For a list of the supported data types see the DataPoint data union field. Deleting data points across multiple data type collections is supported following https://aip.dev/159. If this is set, the parent of all of the data points specified in `names` must match this field."
      }
    ],
    "request": "BatchDeleteDataPointsRequest",
    "response": "Operation"
  },
  {
    "id": "health.users.dataTypes.dataPoints.create",
    "resource": "users.dataTypes.dataPoints",
    "name": "create",
    "httpMethod": "POST",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
    "path": "v4/{+parent}/dataPoints",
    "description": "Creates a single identifiable data point.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent resource name where the data point will be created. Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity)."
      }
    ],
    "request": "DataPoint",
    "response": "Operation"
  },
  {
    "id": "health.users.dataTypes.dataPoints.dailyRollUp",
    "resource": "users.dataTypes.dataPoints",
    "name": "dailyRollUp",
    "httpMethod": "POST",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:dailyRollUp",
    "path": "v4/{+parent}/dataPoints:dailyRollUp",
    "description": "Roll up data points over civil time intervals for supported data types.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. Parent data type of the Data Point collection. Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` - `users/me/dataTypes/distance` - `users/1234567890/dataTypes/distance` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). For a list of the supported data types see the DailyRollupDataPoint value union field."
      }
    ],
    "request": "DailyRollUpDataPointsRequest",
    "response": "DailyRollUpDataPointsResponse"
  },
  {
    "id": "health.users.dataTypes.dataPoints.exportExerciseTcx",
    "resource": "users.dataTypes.dataPoints",
    "name": "exportExerciseTcx",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}:exportExerciseTcx",
    "path": "v4/{+name}:exportExerciseTcx",
    "description": "Exports exercise data in TCX format. **IMPORTANT:** HTTP clients must append `?alt=media` to the request URL to download the raw TCX file. ## Examples: ## `https://health.googleapis.com/v4/users/me/dataTypes/exercise/dataPoints/EXERCISE_ID:exportExerciseTcx?alt=media` `https://health.googleapis.com/v4/users/1234567890/dataTypes/exercise/dataPoints/EXERCISE_ID:exportExerciseTcx?alt=media` Without `alt=media`, the server returns a JSON response (`ExportExerciseTcxResponse`) which is intended primarily for gRPC clients. **Note:** While the Authorization section below states that any one of the listed scopes is accepted, this specific method requires the user to provide both one of the `activity_and_fitness` scopes (`normal` or `readonly`) AND one of the `location` scopes (`normal` or `readonly`) in their access token to succeed.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly","https://www.googleapis.com/auth/googlehealth.location.readonly"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The resource name of the exercise data point to export. Format: `users/{user}/dataTypes/exercise/dataPoints/{data_point}` Examples: - `users/me/dataTypes/exercise/dataPoints/2026443605080188808` - `users/1234567890/dataTypes/exercise/dataPoints/2026443605080188808` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). The `{data_point}` ID maps to the exercise ID, which is a long integer."
      },
      {
        "name": "partialData",
        "location": "query",
        "required": false,
        "type": "boolean",
        "description": "Optional. Indicates whether to include the TCX data points when the GPS data is not available. If not specified, defaults to `false` and partial data will not be included."
      }
    ],
    "request": null,
    "response": "ExportExerciseTcxResponse"
  },
  {
    "id": "health.users.dataTypes.dataPoints.get",
    "resource": "users.dataTypes.dataPoints",
    "name": "get",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
    "path": "v4/{+name}",
    "description": "Get a single identifyable data point.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The name of the data point to retrieve. Format: `users/{user}/dataTypes/{data_type}/dataPoints/{data_point}` ## Examples: ## `users/me/dataTypes/sleep/dataPoints/a1b2c3d4-e5f6-7890-1234-567890abcdef` `users/1234567890/dataTypes/sleep/dataPoints/a1b2c3d4-e5f6-7890-1234-567890abcdef` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). See DataPoint.name for examples and possible values."
      }
    ],
    "request": null,
    "response": "DataPoint"
  },
  {
    "id": "health.users.dataTypes.dataPoints.list",
    "resource": "users.dataTypes.dataPoints",
    "name": "list",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints",
    "path": "v4/{+parent}/dataPoints",
    "description": "Query user health and fitness data points.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {"name":"pageToken","location":"query","required":false,"type":"string","description":"Optional. The `next_page_token` from a previous request, if any."},
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. Parent data type of the Data Point collection. Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` - `users/me/dataTypes/weight` - `users/1234567890/dataTypes/weight` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). For a list of the supported data types see the DataPoint data union field."
      },
      {
        "name": "filter",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. Filter expression following https://google.aip.dev/160. A time range (either physical or civil) can be specified. The supported filter fields are: - Interval start time: - Pattern: `{interval_data_type}.interval.start_time` - Supported comparison operators: `>=`, `<` - Timestamp literal expected in RFC-3339 format - Supported logical operators: `AND` - Example: - `steps.interval.start_time >= \"2023-11-24T00:00:00Z\" AND steps.interval.start_time < \"2023-11-25T00:00:00Z\"` - `distance.interval.start_time >= \"2024-08-14T12:34:56Z\"` - Interval civil start time: - Pattern: `{interval_data_type}.interval.civil_start_time` - Supported comparison operators: `>=`, `<` - Date with optional time literal expected in ISO 8601 `YYYY-MM-DD[THH:mm:ss]` format - Supported logical operators: `AND` - Example: - `steps.interval.civil_start_time >= \"2023-11-24\" AND steps.interval.civil_start_time < \"2023-11-25\"` - `distance.interval.civil_start_time >= \"2024-08-14T12:34:56\"` - Sample observation physical time: - Pattern: `{sample_data_type}.sample_time.physical_time` - Supported comparison operators: `>=`, `<` - Timestamp literal expected in RFC-3339 format - Supported logical operators: `AND` - Example: - `weight.sample_time.physical_time >= \"2023-11-24T00:00:00Z\" AND weight.sample_time.physical_time < \"2023-11-25T00:00:00Z\"` - `weight.sample_time.physical_time >= \"2024-08-14T12:34:56Z\"` - Sample observation civil time: - Pattern: `{sample_data_type}.sample_time.civil_time` - Supported comparison operators: `>=`, `<` - Date with optional time literal expected in ISO 8601 `YYYY-MM-DD[THH:mm:ss]` format - Supported logical operators: `AND` - Example: - `weight.sample_time.civil_time >= \"2023-11-24\" AND weight.sample_time.civil_time < \"2023-11-25\"` - `weight.sample_time.civil_time >= \"2024-08-14T12:34:56\"` - Daily summary date: - Pattern: `{daily_summary_data_type}.date` - Supported comparison operators: `>=`, `<` - Date literal expected in ISO 8601 `YYYY-MM-DD` format - Supported logical operators: `AND` - Example: - `daily_heart_rate_variability.date < \"2024-08-15\"` - Session civil start time (**Excluding Sleep and ECG**): - Pattern: `{session_data_type}.interval.civil_start_time` - Supported comparison operators: `>=`, `<` - Date with optional time literal expected in ISO 8601 `YYYY-MM-DD[THH:mm:ss]` format - Supported logical operators: `AND` - Example: - `exercise.interval.civil_start_time >= \"2023-11-24\" AND exercise.interval.civil_start_time < \"2023-11-25\"` - `exercise.interval.civil_start_time >= \"2024-08-14T12:34:56\"` - Session start time (**ECG specific**): - Pattern: `electrocardiogram.interval.start_time` - Supported comparison operators: `>=` - Timestamp literal expected in RFC-3339 format - Example: - `electrocardiogram.interval.start_time >= \"2024-08-14T12:34:56Z\"` - Note: Only filtering by start time is supported for ECG. Filtering by end time (e.g., `electrocardiogram.interval.end_time`) is not supported. - Session end time (**Sleep specific**): - Pattern: `sleep.interval.end_time` - Supported comparison operators: `>=`, `<` - Timestamp literal expected in RFC-3339 format - Supported logical operators: `AND`, `OR` - Example: - `sleep.interval.end_time >= \"2023-11-24T00:00:00Z\" AND sleep.interval.end_time < \"2023-11-25T00:00:00Z\"` - Session civil end time (**Sleep specific**): - Pattern: `sleep.interval.civil_end_time` - Supported comparison operators: `>=`, `<` - Date with optional time literal expected in ISO 8601 `YYYY-MM-DD[THH:mm:ss]` format - Supported logical operators: `AND`, `OR` - Example: - `sleep.interval.civil_end_time >= \"2023-11-24\" AND sleep.interval.civil_end_time < \"2023-11-25\"` Data points in the response will be ordered by the interval start time in descending order."
      },
      {
        "name": "pageSize",
        "location": "query",
        "required": false,
        "type": "integer",
        "description": "Optional. The maximum number of data points to return. If unspecified, at most 1440 data points will be returned. The maximum page size is 10000; values above that will be truncated accordingly. For `exercise` and `sleep` the default page size is 25. The maximum page size for `exercise` and `sleep` is 25."
      },
      {
        "name": "dataSourceFamily",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. The data source family name to filter by. If empty, data points from all available data sources will be returned. Format: `users/{user}/dataSourceFamilies/{data_source_family}` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID, retrieved via GetIdentity (e.g. `users/me/dataSourceFamilies/...` or `users/1234567890/dataSourceFamilies/...`). The supported values are: - `users/{user}/dataSourceFamilies/all-sources` - Default value. Includes data from all available data sources. - `users/{user}/dataSourceFamilies/google-wearables` - Includes data from Google and Fitbit tracker devices (such as Fitbit trackers and Pixel Watch). Excludes manually logged data. - `users/{user}/dataSourceFamilies/google-sources` - Includes first-party Google data, such as data from tracker devices, manually logged data, and Health Connect. - `users/{user}/dataSourceFamilies/self-sources` - Includes only the data the calling client wrote through this API, that is, data points whose data source was registered through this API with the same OAuth client ID as the caller. Callers that were only granted write scopes for the requested data types may only read the data they wrote themselves: their requests are implicitly restricted to `self-sources`, and requesting any other data source family fails with `PERMISSION_DENIED`. If no data point matches the requested data source family, the response is an empty list rather than an error. Filtering by data source family is not supported for the `sleep`, `food` and `food-measurement-unit` data types, because the underlying listing implementation cannot restrict results by data source. Such requests fail with `INVALID_ARGUMENT` when the data source family is set explicitly, and with `PERMISSION_DENIED` when the restriction is only implied by the caller's scopes. For `sleep`, use ReconcileDataPoints instead."
      }
    ],
    "request": null,
    "response": "ListDataPointsResponse"
  },
  {
    "id": "health.users.dataTypes.dataPoints.patch",
    "resource": "users.dataTypes.dataPoints",
    "name": "patch",
    "httpMethod": "PATCH",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints/{dataPointsId}",
    "path": "v4/{+name}",
    "description": "Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Identifier. Data point name, only supported for the subset of identifiable data types. For the majority of the data types, individual data points do not need to be identified and this field would be empty. Format: `users/{user}/dataTypes/{data_type}/dataPoints/{data_point}` ## Examples: ## `users/me/dataTypes/sleep/dataPoints/a1b2c3d4-e5f6-7890-1234-567890abcdef` `users/1234567890/dataTypes/sleep/dataPoints/a1b2c3d4-e5f6-7890-1234-567890abcdef` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID, which can be retrieved by calling GetIdentity (see Identity.health_user_id). The `{data_type}` ID corresponds to the kebab-case version of the field names in the DataPoint data union field, e.g. `heart-rate` for the `heart_rate` field. The `{data_point}` ID can be client-provided or system-generated. If client-provided, it must be a string of 4-63 characters, containing only lowercase letters, numbers, and hyphens."
      }
    ],
    "request": "DataPoint",
    "response": "Operation"
  },
  {
    "id": "health.users.dataTypes.dataPoints.reconcile",
    "resource": "users.dataTypes.dataPoints",
    "name": "reconcile",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:reconcile",
    "path": "v4/{+parent}/dataPoints:reconcile",
    "description": "Reconcile data points from multiple data sources into a single data stream.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. Parent data type of the Data Point collection. Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` - `users/me/dataTypes/heart-rate` - `users/1234567890/dataTypes/heart-rate` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). For a list of the supported data types see the DataPoint data union field."
      },
      {
        "name": "filter",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. Filter expression based on https://aip.dev/160. A time range, either physical or civil, can be specified. See the ListDataPointsRequest.filter for the supported fields and syntax."
      },
      {
        "name": "dataSourceFamily",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. The data source family name to reconcile. If empty, data points from all data sources will be reconciled. Format: `users/{user}/dataSourceFamilies/{data_source_family}` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID, retrieved via GetIdentity (e.g. `users/me/dataSourceFamilies/...` or `users/1234567890/dataSourceFamilies/...`). The supported values are: - `users/{user}/dataSourceFamilies/all-sources` - Default value. Includes data from all available data sources. - `users/{user}/dataSourceFamilies/google-wearables` - Includes data from Google and Fitbit tracker devices (such as Fitbit trackers and Pixel Watch). Excludes manually logged data. - `users/{user}/dataSourceFamilies/google-sources` - Includes first-party Google data, such as data from tracker devices, manually logged data, and Health Connect. - `users/{user}/dataSourceFamilies/self-sources` - Includes only the data the calling client wrote through this API, that is, data points whose data source was registered through this API with the same OAuth client ID as the caller. Callers that were only granted write scopes for the requested data type may only read the data they wrote themselves: their requests are implicitly restricted to `self-sources`, and requesting any other data source family fails with `PERMISSION_DENIED`. If no data point matches the requested data source family, the response is an empty list rather than an error."
      },
      {
        "name": "pageSize",
        "location": "query",
        "required": false,
        "type": "integer",
        "description": "Optional. The maximum number of data points to return. If unspecified, at most 1440 data points will be returned. The maximum page size is 10000; values above that will be truncated accordingly. For `exercise` and `sleep` the default page size is 25. The maximum page size for `exercise` and `sleep` is 25."
      },
      {"name":"pageToken","location":"query","required":false,"type":"string","description":"Optional. The `next_page_token` from a previous request, if any."}
    ],
    "request": null,
    "response": "ReconcileDataPointsResponse"
  },
  {
    "id": "health.users.dataTypes.dataPoints.rollUp",
    "resource": "users.dataTypes.dataPoints",
    "name": "rollUp",
    "httpMethod": "POST",
    "flatPath": "v4/users/{usersId}/dataTypes/{dataTypesId}/dataPoints:rollUp",
    "path": "v4/{+parent}/dataPoints:rollUp",
    "description": "Roll up data points over physical time intervals for supported data types.",
    "scopes": [
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly",
      "https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.ecg.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly",
      "https://www.googleapis.com/auth/googlehealth.irn.readonly",
      "https://www.googleapis.com/auth/googlehealth.location.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
      "https://www.googleapis.com/auth/googlehealth.logged_symptoms.writeonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
      "https://www.googleapis.com/auth/googlehealth.mindfulness.writeonly",
      "https://www.googleapis.com/auth/googlehealth.nutrition.writeonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
      "https://www.googleapis.com/auth/googlehealth.reproductive_health.writeonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.readonly",
      "https://www.googleapis.com/auth/googlehealth.sleep.writeonly"
    ],
    "parameters": [
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. Parent data type of the Data Point collection. Format: `users/{user}/dataTypes/{data_type}`, e.g.: - `users/me/dataTypes/steps` - `users/1234567890/dataTypes/steps` - `users/me/dataTypes/distance` - `users/1234567890/dataTypes/distance` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID (retrieved via GetIdentity). For a list of the supported data types see the RollupDataPoint value union field."
      }
    ],
    "request": "RollUpDataPointsRequest",
    "response": "RollUpDataPointsResponse"
  },
  {
    "id": "health.users.pairedDevices.get",
    "resource": "users.pairedDevices",
    "name": "get",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/pairedDevices/{pairedDevicesId}",
    "path": "v4/{+name}",
    "description": "Returns user's Device.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.settings.readonly"],
    "parameters": [
      {
        "name": "name",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The name of the device to retrieve. Format: users/{user}/devices/{device}"
      }
    ],
    "request": null,
    "response": "PairedDevice"
  },
  {
    "id": "health.users.pairedDevices.list",
    "resource": "users.pairedDevices",
    "name": "list",
    "httpMethod": "GET",
    "flatPath": "v4/users/{usersId}/pairedDevices",
    "path": "v4/{+parent}/pairedDevices",
    "description": "Returns the user's list of paired 1P trackers and smartwatches.",
    "scopes": ["https://www.googleapis.com/auth/googlehealth.settings.readonly"],
    "parameters": [
      {
        "name": "pageSize",
        "location": "query",
        "required": false,
        "type": "integer",
        "description": "Optional. The maximum number of devices to return. The service may return fewer than this value. If unspecified, at most 5 devices will be returned. The maximum value is 100. values above 100 will be coerced to 100."
      },
      {
        "name": "parent",
        "location": "path",
        "required": true,
        "type": "string",
        "description": "Required. The parent, which owns this collection of devices. Format: users/{user}"
      },
      {
        "name": "pageToken",
        "location": "query",
        "required": false,
        "type": "string",
        "description": "Optional. A page token, received from a previous `ListPairedDevices` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListPairedDevices` must match the call that provided the page token."
      }
    ],
    "request": null,
    "response": "ListPairedDevicesResponse"
  }
];

/** How many table types list an operation that maps to each dataPoints method. */
export const GHAPI_OPERATION_COVERAGE: { method: string; dataTypes: string[] }[] = [
  {
    "method": "batchDelete",
    "dataTypes": ["body-fat","exercise","height","hydration-log","menstrual-period","moods","nutrition-log","ovulation-test","sleep","symptoms","weight"]
  },
  {
    "method": "create",
    "dataTypes": ["body-fat","exercise","height","hydration-log","menstrual-period","moods","nutrition-log","ovulation-test","sleep","symptoms","weight"]
  },
  {
    "method": "dailyRollUp",
    "dataTypes": [
      "active-energy-burned",
      "active-minutes",
      "active-zone-minutes",
      "altitude",
      "blood-glucose",
      "body-fat",
      "calories-in-heart-rate-zone",
      "core-body-temperature",
      "distance",
      "floors",
      "heart-rate",
      "hydration-log",
      "nutrition-log",
      "run-vo2-max",
      "sedentary-period",
      "steps",
      "swim-lengths-data",
      "time-in-heart-rate-zone",
      "total-calories",
      "weight"
    ]
  },
  {"method":"exportExerciseTcx","dataTypes":[]},
  {
    "method": "get",
    "dataTypes": ["blood-glucose","body-fat","core-body-temperature","exercise","food","food-measurement-unit","height","hydration-log","nutrition-log","sleep","weight"]
  },
  {
    "method": "list",
    "dataTypes": [
      "active-energy-burned",
      "active-minutes",
      "active-zone-minutes",
      "activity-level",
      "altitude",
      "blood-glucose",
      "body-fat",
      "core-body-temperature",
      "daily-heart-rate-variability",
      "daily-heart-rate-zones",
      "daily-oxygen-saturation",
      "daily-respiratory-rate",
      "daily-resting-heart-rate",
      "daily-sleep-temperature-derivations",
      "daily-vo2-max",
      "distance",
      "electrocardiogram",
      "exercise",
      "food",
      "food-measurement-unit",
      "heart-rate",
      "heart-rate-variability",
      "height",
      "hydration-log",
      "irregular-rhythm-notification",
      "nutrition-log",
      "oxygen-saturation",
      "respiratory-rate-sleep-summary",
      "run-vo2-max",
      "sedentary-period",
      "skin-temperature-sensors",
      "sleep",
      "steps",
      "swim-lengths-data",
      "time-in-heart-rate-zone",
      "vo2-max",
      "weight"
    ]
  },
  {
    "method": "patch",
    "dataTypes": ["body-fat","exercise","height","hydration-log","menstrual-period","moods","nutrition-log","ovulation-test","sleep","symptoms","weight"]
  },
  {
    "method": "reconcile",
    "dataTypes": [
      "active-energy-burned",
      "active-minutes",
      "active-zone-minutes",
      "activity-level",
      "altitude",
      "blood-glucose",
      "body-fat",
      "core-body-temperature",
      "daily-heart-rate-variability",
      "daily-heart-rate-zones",
      "daily-oxygen-saturation",
      "daily-respiratory-rate",
      "daily-resting-heart-rate",
      "daily-sleep-temperature-derivations",
      "daily-vo2-max",
      "distance",
      "exercise",
      "floors",
      "heart-rate",
      "heart-rate-variability",
      "height",
      "hydration-log",
      "nutrition-log",
      "oxygen-saturation",
      "respiratory-rate-sleep-summary",
      "run-vo2-max",
      "sedentary-period",
      "sleep",
      "steps",
      "swim-lengths-data",
      "time-in-heart-rate-zone",
      "vo2-max",
      "weight"
    ]
  },
  {
    "method": "rollUp",
    "dataTypes": [
      "active-energy-burned",
      "active-minutes",
      "active-zone-minutes",
      "altitude",
      "blood-glucose",
      "body-fat",
      "calories-in-heart-rate-zone",
      "core-body-temperature",
      "distance",
      "floors",
      "heart-rate",
      "hydration-log",
      "nutrition-log",
      "run-vo2-max",
      "sedentary-period",
      "steps",
      "swim-lengths-data",
      "time-in-heart-rate-zone",
      "total-calories",
      "weight"
    ]
  }
];

/** Request bodies the dataPoints methods take (DataPoint itself excluded). */
export const GHAPI_REQUEST_SCHEMAS: GhapiSchemaRef[] = [
  {"id":"BatchDeleteDataPointsRequest","nested":[]},
  {"id":"DailyRollUpDataPointsRequest","nested":["CivilTimeInterval"]},
  {"id":"RollUpDataPointsRequest","nested":["Interval"]}
];

/** Every schema a type, rollup or request refers to (and one level below),
 *  keyed by id, as the discovery documents state them. */
export const GHAPI_SCHEMAS: Record<string, GhapiSchema> = {
  "ActiveEnergyBurned": {
    "id": "ActiveEnergyBurned",
    "source": "v4",
    "description": "Energy burned as part of an activity, excluding the basal energy burn.",
    "fields": [
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval",
        "enum": null
      },
      {
        "name": "kcal",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Energy burned during an activity, measured in kilocalories. Must be in the range `[0, 1000000]`.",
        "enum": null
      }
    ]
  },
  "ActiveEnergyBurnedRollupValue": {
    "id": "ActiveEnergyBurnedRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of active energy burned.",
    "fields": [
      {
        "name": "kcalSum",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Sum of the active energy burned in kilocalories.",
        "enum": null
      }
    ]
  },
  "ActiveMinutes": {
    "id": "ActiveMinutes",
    "source": "v4",
    "description": "Record of active minutes in a given time interval.",
    "fields": [
      {
        "name": "activeMinutesByActivityLevel",
        "type": "array<ActiveMinutesByActivityLevel>",
        "ref": null,
        "itemsRef": "ActiveMinutesByActivityLevel",
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Active minutes by activity level. At most one record per activity level is allowed.",
        "enum": null
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "ActiveMinutesByActivityLevel": {
    "id": "ActiveMinutesByActivityLevel",
    "source": "v4",
    "description": "Active minutes at a given activity level.",
    "fields": [
      {
        "name": "activeMinutes",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Number of whole minutes spent in activity.",
        "enum": null
      },
      {
        "name": "activityLevel",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The level of activity.",
        "enum": [
          {"value":"ACTIVITY_LEVEL_UNSPECIFIED","description":"Activity level is unspecified."},
          {"value":"LIGHT","description":"Light activity level."},
          {"value":"MODERATE","description":"Moderate activity level."},
          {"value":"VIGOROUS","description":"Vigorous activity level."}
        ]
      }
    ]
  },
  "ActiveMinutesRollupByActivityLevel": {
    "id": "ActiveMinutesRollupByActivityLevel",
    "source": "v4",
    "description": "Active minutes by activity level.",
    "fields": [
      {
        "name": "activeMinutesSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Number of whole minutes spent in activity.",
        "enum": null
      },
      {
        "name": "activityLevel",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The level of activity.",
        "enum": [
          {"value":"ACTIVITY_LEVEL_UNSPECIFIED","description":"Activity level is unspecified."},
          {"value":"LIGHT","description":"Light activity level."},
          {"value":"MODERATE","description":"Moderate activity level."},
          {"value":"VIGOROUS","description":"Vigorous activity level."}
        ]
      }
    ]
  },
  "ActiveMinutesRollupValue": {
    "id": "ActiveMinutesRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the active minutes data type.",
    "fields": [
      {
        "name": "activeMinutesRollupByActivityLevel",
        "type": "array<ActiveMinutesRollupByActivityLevel>",
        "ref": null,
        "itemsRef": "ActiveMinutesRollupByActivityLevel",
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Active minutes by activity level. At most one record per activity level is allowed.",
        "enum": null
      }
    ]
  },
  "ActiveZoneMinutes": {
    "id": "ActiveZoneMinutes",
    "source": "v4",
    "description": "Record of active zone minutes in a given time interval.",
    "fields": [
      {
        "name": "activeZoneMinutes",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Number of Active Zone Minutes earned in the given time interval. Note: active_zone_minutes equals to 1 for low intensity (fat burn) zones or 2 for high intensity zones (cardio, peak).",
        "enum": null
      },
      {
        "name": "heartRateZone",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Heart rate zone in which the active zone minutes have been earned, in the given time interval.",
        "enum": [
          {"value":"HEART_RATE_ZONE_UNSPECIFIED","description":"Unspecified heart rate zone."},
          {"value":"FAT_BURN","description":"The fat burn heart rate zone."},
          {"value":"CARDIO","description":"The cardio heart rate zone."},
          {"value":"PEAK","description":"The peak heart rate zone."}
        ]
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "ActiveZoneMinutesRollupValue": {
    "id": "ActiveZoneMinutesRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the active zone minutes data type.",
    "fields": [
      {
        "name": "sumInCardioHeartZone",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Active zone minutes in `HeartRateZone.CARDIO`.",
        "enum": null
      },
      {
        "name": "sumInFatBurnHeartZone",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Active zone minutes in `HeartRateZone.FAT_BURN`.",
        "enum": null
      },
      {
        "name": "sumInPeakHeartZone",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Active zone minutes in `HeartRateZone.PEAK`.",
        "enum": null
      }
    ]
  },
  "ActivityLevel": {
    "id": "ActivityLevel",
    "source": "v4",
    "description": "Internal type to capture activity level during a certain time interval.",
    "fields": [
      {
        "name": "activityLevelType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Activity level type in the given time interval.",
        "enum": [
          {"value":"ACTIVITY_LEVEL_TYPE_UNSPECIFIED","description":"Unspecified activity level type."},
          {"value":"SEDENTARY","description":"Sedentary activity level."},
          {"value":"LIGHTLY_ACTIVE","description":"Lightly active activity level."},
          {"value":"MODERATELY_ACTIVE","description":"Moderately active activity level."},
          {"value":"VERY_ACTIVE","description":"Very active activity level."}
        ]
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "AlertWindow": {
    "id": "AlertWindow",
    "source": "v4",
    "description": "An analysis window evaluated for AFib. Note: The current version of the algorithm will only produce alerts if all windows are positive. So anything returned from the API will always have the positive bit set to true. Internally, windows can be negative, however. We never save \"inconclusive\" windows (they aren't produced by the algorithm).",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The end time of the analysis window.",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The UTC offset of the user's timezone when the analysis window ended.",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval. The start time of the analysis window.",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The UTC offset of the user's timezone when the analysis window started.",
        "enum": null
      },
      {
        "name": "civilEndTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Observed interval end time in civil time in the timezone the subject is in at the end of the observed interval",
        "enum": null
      },
      {
        "name": "civilStartTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Observed interval start time in civil time in the timezone the subject is in at the start of the observed interval",
        "enum": null
      },
      {
        "name": "heartBeats",
        "type": "array<HeartBeat>",
        "ref": null,
        "itemsRef": "HeartBeat",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. All heart beats in the interval contained in this analysis window.",
        "enum": null
      },
      {
        "name": "positive",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Flag indicating whether the window was positive for AFib or not. A `true` value indicates that AFib was detected in this window. A `false` value means AFib was not detected, but does not guarantee the absence of AFib.",
        "enum": null
      }
    ]
  },
  "Altitude": {
    "id": "Altitude",
    "source": "v4",
    "description": "Captures the altitude gain (i.e. deltas), and not level above sea, for a user in millimeters.",
    "fields": [
      {
        "name": "gainMillimeters",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Altitude gain in millimeters over the observed interval. Must be in the range `[-1000000000, 1000000000]`.",
        "enum": null
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "AltitudeRollupValue": {
    "id": "AltitudeRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the user's altitude.",
    "fields": [
      {
        "name": "gainMillimetersSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Sum of the altitude gain in millimeters.",
        "enum": null
      }
    ]
  },
  "BatchDeleteDataPointsRequest": {
    "id": "BatchDeleteDataPointsRequest",
    "source": "v4",
    "description": "Request to delete a batch of identifiable data points.",
    "fields": [
      {
        "name": "names",
        "type": "array<string>",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The names of the DataPoints to delete. A maximum of 10000 data points can be deleted in a single request.",
        "enum": null
      }
    ]
  },
  "BloodGlucose": {
    "id": "BloodGlucose",
    "source": "v4",
    "description": "Represents a blood glucose level measurement. LINT: LEGACY_NAMES",
    "fields": [
      {
        "name": "bloodGlucoseMilligramsPerDeciliter",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Blood glucose level concentration in mg/dL. Must be in the range `[0, 900]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which blood glucose was measured.",
        "enum": null
      },
      {
        "name": "mealType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Meal type of the measurement.",
        "enum": [
          {"value":"MEAL_TYPE_UNSPECIFIED","description":"Unspecified meal type."},
          {"value":"BREAKFAST","description":"Breakfast."},
          {"value":"LUNCH","description":"Lunch."},
          {"value":"DINNER","description":"Dinner."},
          {"value":"SNACK","description":"Snack."}
        ]
      },
      {
        "name": "measurementSource",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Source of the measurement.",
        "enum": [
          {"value":"MEASUREMENT_SOURCE_UNSPECIFIED","description":"Unspecified measurement source."},
          {"value":"SELF_MONITORING_BLOOD_GLUCOSE","description":"Self-monitoring of blood glucose (Blood glucose meter)"},
          {"value":"CONTINUOUS_GLUCOSE_MONITORING","description":"Continuous glucose monitoring device"},
          {"value":"LAB_TEST","description":"Laboratory test"}
        ]
      },
      {
        "name": "measurementTiming",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Timing of the measurement.",
        "enum": [
          {"value":"MEASUREMENT_TIMING_UNSPECIFIED","description":"Unspecified measurement timing."},
          {"value":"AFTER_MEAL","description":"Measurement taken after meal."},
          {"value":"BEFORE_MEAL","description":"Measurement taken before meal."},
          {"value":"FASTING","description":"Measurement taken while fasting."},
          {"value":"GENERAL","description":"General measurement (not associated with a meal or time of day)."},
          {"value":"BEFORE_BED","description":"Measurement taken before bed."},
          {"value":"OVER_NIGHT","description":"Measurement taken over night."}
        ]
      },
      {
        "name": "notes",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard free-form notes captured at manual logging.",
        "enum": null
      },
      {
        "name": "specimen",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Type of body fluid used to measure the blood glucose.",
        "enum": [
          {"value":"SPECIMEN_UNSPECIFIED","description":"Unspecified specimen."},
          {"value":"CAPILLARY_BLOOD","description":"Capillary blood."},
          {"value":"INTERSTITIAL_FLUID","description":"Interstitial fluid."},
          {"value":"PLASMA","description":"Plasma."},
          {"value":"SERUM","description":"Serum."},
          {"value":"TEARS","description":"Tears."},
          {"value":"WHOLE_BLOOD","description":"Whole blood."}
        ]
      }
    ]
  },
  "BloodGlucoseRollupValue": {
    "id": "BloodGlucoseRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the blood glucose data type. LINT: LEGACY_NAMES",
    "fields": [
      {
        "name": "bloodGlucoseMilligramsPerDeciliterAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Average blood glucose level in mg/dL.",
        "enum": null
      }
    ]
  },
  "BodyFat": {
    "id": "BodyFat",
    "source": "v4",
    "description": "Body fat measurement.",
    "fields": [
      {
        "name": "percentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Body fat percentage. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which body fat was measured.",
        "enum": null
      }
    ]
  },
  "BodyFatRollupValue": {
    "id": "BodyFatRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the body fat data type.",
    "fields": [
      {
        "name": "bodyFatPercentageAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Average body fat percentage.",
        "enum": null
      }
    ]
  },
  "CaloriesInHeartRateZoneRollupValue": {
    "id": "CaloriesInHeartRateZoneRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the calories in heart rate zone data type.",
    "fields": [
      {
        "name": "caloriesInHeartRateZones",
        "type": "array<CaloriesInHeartRateZoneValue>",
        "ref": null,
        "itemsRef": "CaloriesInHeartRateZoneValue",
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "List of calories burned in each heart rate zone.",
        "enum": null
      }
    ]
  },
  "CaloriesInHeartRateZoneValue": {
    "id": "CaloriesInHeartRateZoneValue",
    "source": "v4",
    "description": "Represents the amount of kilocalories burned in a specific heart rate zone.",
    "fields": [
      {
        "name": "heartRateZone",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The heart rate zone.",
        "enum": [
          {"value":"HEART_RATE_ZONE_TYPE_UNSPECIFIED","description":"Unspecified heart rate zone."},
          {"value":"LIGHT","description":"The light heart rate zone."},
          {"value":"MODERATE","description":"The moderate heart rate zone."},
          {"value":"VIGOROUS","description":"The vigorous heart rate zone."},
          {"value":"PEAK","description":"The peak heart rate zone."}
        ]
      },
      {
        "name": "kcal",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The amount of kilocalories burned in the specified heart rate zone.",
        "enum": null
      }
    ]
  },
  "CivilTimeInterval": {
    "id": "CivilTimeInterval",
    "source": "v4",
    "description": "Counterpart of google.type.Interval, but using CivilDateTime.",
    "fields": [
      {
        "name": "end",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The exclusive end of the range.",
        "enum": null
      },
      {
        "name": "start",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The inclusive start of the range.",
        "enum": null
      }
    ]
  },
  "CoreBodyTemperature": {
    "id": "CoreBodyTemperature",
    "source": "v4",
    "description": "Core body temperature measurement, distinct from peripheral body temperature, reflects the temperature of the body's internal organs.",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which core body temperature was measured.",
        "enum": null
      },
      {
        "name": "temperatureCelsius",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The core body temperature in Celsius. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "id",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The unique identifier of the core body temperature measurement.",
        "enum": null
      },
      {
        "name": "measurementLocation",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The location of the core body temperature measurement.",
        "enum": [
          {"value":"MEASUREMENT_LOCATION_UNSPECIFIED","description":"Measurement location is unspecified."},
          {"value":"OTHER","description":"Other measurement location."},
          {"value":"ARMPIT","description":"Armpit measurement location."},
          {"value":"BODY","description":"Body measurement location."},
          {"value":"EAR","description":"Ear measurement location."},
          {"value":"FINGER","description":"Finger measurement location."},
          {"value":"GASTRO_INTESTINAL","description":"Gastro-intestinal measurement location."},
          {"value":"MOUTH","description":"Mouth measurement location."},
          {"value":"RECTUM","description":"Rectum measurement location."},
          {"value":"TOE","description":"Toe measurement location."},
          {"value":"EAR_DRUM","description":"Ear drum measurement location."},
          {"value":"TEMPORAL_ARTERY","description":"Temporal artery measurement location."},
          {"value":"FOREHEAD","description":"Forehead measurement location."},
          {"value":"URINARY_BLADDER","description":"Urinary bladder measurement location."},
          {"value":"NASAL","description":"Nasal measurement location."},
          {"value":"NASOPHARYNGEAL","description":"Nasopharyngeal measurement location."},
          {"value":"WRIST","description":"Wrist measurement location."},
          {"value":"VAGINA","description":"Vagina measurement location."}
        ]
      }
    ]
  },
  "CoreBodyTemperatureRollupValue": {
    "id": "CoreBodyTemperatureRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the core body temperature data type.",
    "fields": [
      {
        "name": "temperatureCelsiusAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Average core body temperature in Celsius.",
        "enum": null
      },
      {
        "name": "temperatureCelsiusMax",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Maximum core body temperature in Celsius.",
        "enum": null
      },
      {
        "name": "temperatureCelsiusMin",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Minimum core body temperature in Celsius.",
        "enum": null
      }
    ]
  },
  "DailyHeartRateVariability": {
    "id": "DailyHeartRateVariability",
    "source": "v4",
    "description": "Represents the daily heart rate variability data type. At least one of the following fields must be set: - `average_heart_rate_variability_milliseconds` - `non_rem_heart_rate_beats_per_minute` - `entropy` - `deep_sleep_root_mean_square_of_successive_differences_milliseconds`",
    "fields": [
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Date (in the user's timezone) of heart rate variability measurement.",
        "enum": null
      },
      {
        "name": "averageHeartRateVariabilityMilliseconds",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. A user's average heart rate variability calculated using the root mean square of successive differences (RMSSD) in times between heartbeats.",
        "enum": null
      },
      {
        "name": "deepSleepRootMeanSquareOfSuccessiveDifferencesMilliseconds",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The root mean square of successive differences (RMSSD) value during deep sleep.",
        "enum": null
      },
      {
        "name": "entropy",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The Shanon entropy of heartbeat intervals. Entropy quantifies randomness or disorder in a system. High entropy indicates high HRV. Entropy is measured from the histogram of time interval between successive heart beats values measured during sleep.",
        "enum": null
      },
      {
        "name": "nonRemHeartRateBeatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Non-REM heart rate",
        "enum": null
      }
    ]
  },
  "DailyHeartRateZones": {
    "id": "DailyHeartRateZones",
    "source": "v4",
    "description": "User's heart rate zone thresholds based on the Karvonen algorithm for a specific day.",
    "fields": [
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Date (in user's timezone) of the heart rate zones record.",
        "enum": null
      },
      {
        "name": "heartRateZones",
        "type": "array<HeartRateZone>",
        "ref": null,
        "itemsRef": "HeartRateZone",
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The heart rate zones.",
        "enum": null
      }
    ]
  },
  "DailyOxygenSaturation": {
    "id": "DailyOxygenSaturation",
    "source": "v4",
    "description": "A daily oxygen saturation (SpO2) record. Represents the user's daily oxygen saturation summary, typically calculated during sleep.",
    "fields": [
      {
        "name": "averagePercentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The average value of the oxygen saturation samples during the sleep. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Date (in user's timezone) of the daily oxygen saturation record.",
        "enum": null
      },
      {
        "name": "lowerBoundPercentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The lower bound of the confidence interval of oxygen saturation samples during sleep. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "upperBoundPercentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The upper bound of the confidence interval of oxygen saturation samples during sleep. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "standardDeviationPercentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard deviation of the daily oxygen saturation averages from the past 7-30 days.",
        "enum": null
      }
    ]
  },
  "DailyRespiratoryRate": {
    "id": "DailyRespiratoryRate",
    "source": "v4",
    "description": "A daily average respiratory rate (breaths per minute) for a day of the year. One data point per day calculated for the main sleep.",
    "fields": [
      {
        "name": "breathsPerMinute",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The average number of breaths taken per minute.",
        "enum": null
      },
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The date on which the respiratory rate was measured.",
        "enum": null
      }
    ]
  },
  "DailyRestingHeartRate": {
    "id": "DailyRestingHeartRate",
    "source": "v4",
    "description": "Measures the daily resting heart rate for a user, calculated using the all day heart rate measurements.",
    "fields": [
      {
        "name": "beatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The resting heart rate value in beats per minute.",
        "enum": null
      },
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Date (in the user's timezone) of the resting heart rate measurement.",
        "enum": null
      },
      {
        "name": "dailyRestingHeartRateMetadata",
        "type": "DailyRestingHeartRateMetadata",
        "ref": "DailyRestingHeartRateMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Metadata for the daily resting heart rate.",
        "enum": null
      }
    ]
  },
  "DailyRestingHeartRateMetadata": {
    "id": "DailyRestingHeartRateMetadata",
    "source": "v4",
    "description": "Metadata for the daily resting heart rate.",
    "fields": [
      {
        "name": "calculationMethod",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The method used to calculate the resting heart rate.",
        "enum": [
          {"value":"CALCULATION_METHOD_UNSPECIFIED","description":"The calculation method is unspecified."},
          {"value":"WITH_SLEEP","description":"The resting heart rate is calculated using the sleep data."},
          {"value":"ONLY_WITH_AWAKE_DATA","description":"The resting heart rate is calculated using only awake data."}
        ]
      }
    ]
  },
  "DailyRollUpDataPointsRequest": {
    "id": "DailyRollUpDataPointsRequest",
    "source": "v4",
    "description": "Request to roll up data points by civil time intervals.",
    "fields": [
      {
        "name": "range",
        "type": "CivilTimeInterval",
        "ref": "CivilTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Closed-open range of data points that will be rolled up. The start time must be aligned with the aggregation window. The maximum range for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes` and `total-calories` is 14 days. The maximum range for all other data types is 90 days.",
        "enum": null
      },
      {
        "name": "dataSourceFamily",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The data source family name to roll up. If empty, data points from all available data sources will be rolled up. Format: `users/{user}/dataSourceFamilies/{data_source_family}` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID, retrieved via GetIdentity (e.g. `users/me/dataSourceFamilies/...` or `users/1234567890/dataSourceFamilies/...`). The supported values are: - `users/{user}/dataSourceFamilies/all-sources` - Default value. Includes data from all available data sources. - `users/{user}/dataSourceFamilies/google-wearables` - Includes data from Google and Fitbit tracker devices (such as Fitbit trackers and Pixel Watch). Excludes manually logged data. - `users/{user}/dataSourceFamilies/google-sources` - Includes first-party Google data, such as data from tracker devices, manually logged data, and Health Connect. - `users/{user}/dataSourceFamilies/self-sources` - Includes only the data the calling client wrote through this API, that is, data points whose data source was registered through this API with the same OAuth client ID as the caller. Callers that were only granted write scopes for the requested data type may only read the data they wrote themselves: their requests are implicitly restricted to `self-sources`, and requesting any other data source family fails with `PERMISSION_DENIED`. If no data point matches the requested data source family, the response is an empty list rather than an error.",
        "enum": null
      },
      {
        "name": "pageSize",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The maximum number of data points to return. If unspecified, at most `90` data points will be returned. The maximum page size is `90`. For `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`, the default and maximum page size is `14`.",
        "enum": null
      },
      {
        "name": "pageToken",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The next_page_token from a previous request, if any. All other request fields need to be the same as in the initial request when the page token is specified.",
        "enum": null
      },
      {
        "name": "windowSizeDays",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Aggregation window size, in number of days. Defaults to 1 if not specified. If the requested range is not an exact multiple of `window_size_days`, the final bucket chronologically will be truncated at the upper endpoint of the range and will cover a duration shorter than `window_size_days`.",
        "enum": null
      }
    ]
  },
  "DailySleepTemperatureDerivations": {
    "id": "DailySleepTemperatureDerivations",
    "source": "v4",
    "description": "Provides derived sleep temperature values, calculated from skin or internal device temperature readings during sleep.",
    "fields": [
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Date for which the sleep temperature derivations are calculated.",
        "enum": null
      },
      {
        "name": "nightlyTemperatureCelsius",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The user's nightly skin temperature. It is the mean of skin temperature samples taken from the user’s sleep.",
        "enum": null
      },
      {
        "name": "baselineTemperatureCelsius",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The user's baseline skin temperature. It is the median of the user's nightly skin temperature over the past 30 days.",
        "enum": null
      },
      {
        "name": "relativeNightlyStddev30dCelsius",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The standard deviation of the user’s relative nightly skin temperature (temperature - baseline) over the past 30 days.",
        "enum": null
      }
    ]
  },
  "DailyVO2Max": {
    "id": "DailyVO2Max",
    "source": "v4",
    "description": "Contains a daily summary of the user's VO2 max (cardio fitness score), which is the maximum rate of oxygen the body can use during exercise.",
    "fields": [
      {
        "name": "date",
        "type": "Date",
        "ref": "Date",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The date for which the Daily VO2 max was measured.",
        "enum": null
      },
      {
        "name": "vo2Max",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Daily VO2 max value measured as in ml consumed oxygen / kg of body weight / min. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "cardioFitnessLevel",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Represents the user's cardio fitness level based on their VO2 max.",
        "enum": [
          {"value":"CARDIO_FITNESS_LEVEL_UNSPECIFIED","description":"Unspecified cardio fitness level."},
          {"value":"POOR","description":"Poor cardio fitness level."},
          {"value":"FAIR","description":"Fair cardio fitness level."},
          {"value":"AVERAGE","description":"Average cardio fitness level."},
          {"value":"GOOD","description":"Good cardio fitness level."},
          {"value":"VERY_GOOD","description":"Very good cardio fitness level."},
          {"value":"EXCELLENT","description":"Excellent cardio fitness level."}
        ]
      },
      {
        "name": "estimated",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. An estimated field is added to indicate when the confidence has decreased sufficiently to consider the value an estimation.",
        "enum": null
      },
      {
        "name": "vo2MaxCovariance",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The covariance of the VO2 max value.",
        "enum": null
      }
    ]
  },
  "Date": {
    "id": "Date",
    "source": "v4",
    "description": "Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp",
    "fields": [
      {
        "name": "day",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        "enum": null
      },
      {
        "name": "month",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        "enum": null
      },
      {
        "name": "year",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        "enum": null
      }
    ]
  },
  "Distance": {
    "id": "Distance",
    "source": "v4",
    "description": "Distance traveled over an interval of time.",
    "fields": [
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      },
      {
        "name": "millimeters",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Distance in millimeters over the observed interval. Must be in the range `[0, 1000000000]`.",
        "enum": null
      }
    ]
  },
  "DistanceRollupValue": {
    "id": "DistanceRollupValue",
    "source": "v4",
    "description": "Result of the rollup of the user's distance.",
    "fields": [
      {
        "name": "millimetersSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Sum of the distance in millimeters.",
        "enum": null
      }
    ]
  },
  "Electrocardiogram": {
    "id": "Electrocardiogram",
    "source": "v4",
    "description": "Represents an Electrocardiogram (ECG) measurement session. This data type is based on SaMD feature and any changes to it may require additional review.",
    "fields": [
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval. NOTE: Historical ECG data lacks timezone offsets, so `start_utc_offset` and `end_utc_offset` will be missing or default to zero. As a result, the civil time fields within this interval will default to UTC. It is recommended to use physical time fields instead for accurate time referencing. NOTE: The `start_time` and `end_time` of the interval are equal, representing the reading time.",
        "enum": null
      },
      {
        "name": "beatsPerMinuteAvg",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Average heart rate recorded during ECG reading in beats per minute.",
        "enum": null
      },
      {
        "name": "leadNumber",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The number of leads used for ECG reading.",
        "enum": null
      },
      {
        "name": "medicalDeviceInfo",
        "type": "MedicalDeviceInfo",
        "ref": "MedicalDeviceInfo",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The meta information for the compatible device used to conduct the measurement. ECG measurements typically populate `firmware_version`, `feature_version`, and `device_model`.",
        "enum": null
      },
      {
        "name": "millivoltsScalingFactor",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The factor by which to divide waveform samples to get voltage in millivolts: millivolts = waveform_sample / millivolts_scaling_factor.",
        "enum": null
      },
      {
        "name": "resultClassification",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The result classification of the ECG reading.",
        "enum": [
          {"value":"RESULT_CLASSIFICATION_UNSPECIFIED","description":"Unspecified result classification."},
          {"value":"NORMAL_SINUS_RHYTHM","description":"Heart rhythm appears normal. Corresponds to result \"Normal Sinus Rhythm\"."},
          {"value":"ATRIAL_FIBRILLATION","description":"Signs of Atrial Fibrillation detected. Corresponds to result \"Atrial Fibrillation\"."},
          {"value":"INCONCLUSIVE","description":"The reading is inconclusive as it could not be classified. Corresponds to result \"Inconclusive\"."},
          {
            "value": "INCONCLUSIVE_HIGH_HEART_RATE",
            "description": "The reading is inconclusive as it could not be classified because heart rate is high (>120bpm). Corresponds to result \"Inconclusive: High heart rate\"."
          },
          {
            "value": "INCONCLUSIVE_LOW_HEART_RATE",
            "description": "The reading is inconclusive as it could not be classified because heart rate is low (<50bpm). Corresponds to result \"Inconclusive: Low heart rate\"."
          },
          {"value":"UNREADABLE","description":"The reading is unreadable."},
          {"value":"NOT_ANALYZED","description":"The reading was not analyzed."}
        ]
      },
      {
        "name": "samplingFrequencyHertz",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The sampling frequency of waveform samples in hertz.",
        "enum": null
      },
      {
        "name": "waveformSamples",
        "type": "array<integer/int32>",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. An array of voltage values representing lead I ECG values. Each sample represents voltage difference in ECG graph. The first value in array corresponds to the start of the reading.",
        "enum": null
      }
    ]
  },
  "EnergyQuantity": {
    "id": "EnergyQuantity",
    "source": "v4",
    "description": "Represents the energy quantity.",
    "fields": [
      {
        "name": "kcal",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The energy value in kilocalories. Must be in the range `[0, 100000]`.",
        "enum": null
      },
      {
        "name": "userProvidedUnit",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the user provided unit.",
        "enum": [
          {"value":"ENERGY_UNIT_UNSPECIFIED","description":"Unspecified energy unit."},
          {"value":"JOULE","description":"Value representing joule."},
          {"value":"KILOJOULE","description":"Value representing kilojoule."},
          {"value":"KILOCALORIE","description":"Value representing kilocalorie."},
          {"value":"SMALL_CALORIE","description":"Value representing small calorie."},
          {"value":"CALORIE","description":"Value representing calorie."}
        ]
      }
    ]
  },
  "EnergyQuantityRollup": {
    "id": "EnergyQuantityRollup",
    "source": "v4",
    "description": "Rollup for the energy quantity.",
    "fields": [
      {
        "name": "kcalSum",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The sum of the energy in kilocalories.",
        "enum": null
      },
      {
        "name": "userProvidedUnitLast",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The user provided unit on the last element.",
        "enum": [
          {"value":"ENERGY_UNIT_UNSPECIFIED","description":"Unspecified energy unit."},
          {"value":"JOULE","description":"Value representing joule."},
          {"value":"KILOJOULE","description":"Value representing kilojoule."},
          {"value":"KILOCALORIE","description":"Value representing kilocalorie."},
          {"value":"SMALL_CALORIE","description":"Value representing small calorie."},
          {"value":"CALORIE","description":"Value representing calorie."}
        ]
      }
    ]
  },
  "Exercise": {
    "id": "Exercise",
    "source": "v4",
    "description": "An exercise that stores information about a physical activity.",
    "fields": [
      {
        "name": "displayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The localized, human-readable name of the exercise. For all exercise types other than `OTHER`, the system ignores client input and overrides this field with a generated name based on `exercise_type` (e.g., \"Walking\" for `WALKING`). If `exercise_type` is `OTHER`, this field can contain the user's custom, free-form display name.",
        "enum": null
      },
      {
        "name": "exerciseType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The type of activity performed during an exercise.",
        "enum": [
          {"value":"EXERCISE_TYPE_UNSPECIFIED","description":"Exercise type is unspecified."},
          {"value":"AEROBIC_WORKOUT","description":"Aerobic workout type."},
          {"value":"ARCHERY","description":"Archery type."},
          {"value":"ASSAULT_BIKE","description":"Assault bike type."},
          {"value":"BACKPACKING","description":"Backpacking type."},
          {"value":"BADMINTON","description":"Badminton type."},
          {"value":"BALLET","description":"Ballet type."},
          {"value":"BALLROOM_DANCE","description":"Ballroom dance type."},
          {"value":"BARRE_CLASS","description":"Barre class type."},
          {"value":"BASEBALL","description":"Baseball type."},
          {"value":"BASKETBALL","description":"Basketball type."},
          {"value":"BIKING","description":"Biking type."},
          {"value":"BILLIARDS","description":"Billiards type."},
          {"value":"BODY_WEIGHT","description":"Body weight type."},
          {"value":"BOOTCAMP","description":"Bootcamp type."},
          {"value":"BOWLING","description":"Bowling type."},
          {"value":"BOXING","description":"Boxing type."},
          {"value":"BREAKDANCING","description":"Breakdancing type."},
          {"value":"CALISTHENICS","description":"Calisthenics type."},
          {"value":"CANOEING","description":"Canoeing type."},
          {"value":"CARDIO_SCULPT","description":"Cardio sculpt type."},
          {"value":"CARDIO_WORKOUT","description":"Cardio workout type."},
          {"value":"CARPENTRY","description":"Carpentry type."},
          {"value":"CHEERLEADING","description":"Cheerleading type."},
          {"value":"CIRCUIT_TRAINING","description":"Circuit training type."},
          {"value":"CLEANING","description":"Cleaning type."},
          {"value":"CLIMBING","description":"Climbing type."},
          {"value":"CORE_TRAINING","description":"Core training type."},
          {"value":"CRICKET","description":"Cricket type."},
          {"value":"CROQUET","description":"Croquet type."},
          {"value":"CROSS_COUNTRY_SKI","description":"Cross country ski type."},
          {"value":"CROSS_TRAINING","description":"Cross training type."},
          {"value":"CROSSFIT","description":"Crossfit type."},
          {"value":"CURLING","description":"Curling type."},
          {"value":"DANCING","description":"Dancing type."},
          {"value":"DIVING","description":"Diving type."},
          {"value":"ELECTRIC_BIKE","description":"Electric bike type."},
          {"value":"ELECTRIC_SCOOTER","description":"Electric scooter type."},
          {"value":"ELLIPTICAL","description":"Elliptical type."},
          {"value":"EQUESTRIAN_SPORTS","description":"Equestrian sports type."},
          {"value":"EXERCISE_CLASS","description":"Exercise class type."},
          {"value":"FENCING","description":"Fencing type."},
          {"value":"FIELD_HOCKEY","description":"Field hockey type."},
          {"value":"FISHING","description":"Fishing type."},
          {"value":"FITNESS_GAMING","description":"Fitness gaming type."},
          {"value":"FOILING","description":"Foiling type."},
          {"value":"FOOTBALL_AMERICAN","description":"Football american type."},
          {"value":"FOOTBALL_AUSTRALIAN","description":"Football australian type."},
          {"value":"FREE_WEIGHTS","description":"Free weights type."},
          {"value":"FRISBEE_PLAYING_GENERAL","description":"Frisbee playing general type."},
          {"value":"FUNCTIONAL_STRENGTH_TRAINING","description":"Functional strength training type."},
          {"value":"GARDENING","description":"Gardening type."},
          {"value":"GOLF","description":"Golf type."},
          {"value":"GYMNASTICS","description":"Gymnastics type."},
          {"value":"HANDBALL","description":"Handball type."},
          {"value":"HAND_CYCLING","description":"Hand cycling type."},
          {"value":"HIIT","description":"Hiit type."},
          {"value":"HIKING","description":"Hiking type."},
          {"value":"HIP_HOP","description":"Hip hop type."},
          {"value":"HOCKEY","description":"Hockey type."},
          {"value":"HOEING","description":"Hoeing type."},
          {"value":"HOUSEHOLD_CHORES","description":"Household chores type."},
          {"value":"HUNTING","description":"Hunting type."},
          {"value":"ICE_SKATING","description":"Ice skating type."},
          {"value":"INCLINE_RUN","description":"Incline run type."},
          {"value":"INCLINE_WALK","description":"Incline walk type."},
          {"value":"INDOOR_CLIMBING","description":"Indoor climbing type."},
          {"value":"INTERVAL_WORKOUT","description":"Interval workout type."},
          {"value":"JAZZ_DANCE","description":"Jazz dance type."},
          {"value":"JIU_JITSU","description":"Jiu jitsu type."},
          {"value":"JUMPING_ROPE","description":"Jumping rope type."},
          {"value":"KARATE","description":"Karate type."},
          {"value":"KAYAKING","description":"Kayaking type."},
          {"value":"KICKBOXING","description":"Kickboxing type."},
          {"value":"KITESURFING","description":"Kitesurfing type."},
          {"value":"LACROSSE","description":"Lacrosse type."},
          {"value":"MARTIAL_ARTS","description":"Martial arts type."},
          {"value":"MEDITATE","description":"Meditate type."},
          {"value":"MODERN_DANCE","description":"Modern dance type."},
          {"value":"MOTOCROSS","description":"Motocross type."},
          {"value":"MOTORCYCLE","description":"Motorcycle type."},
          {"value":"MOUNTAIN_BIKE","description":"Mountain bike type."},
          {"value":"MOWING_LAWN","description":"Mowing lawn type."},
          {"value":"MUAY_THAI","description":"Muay thai type."},
          {"value":"MULTISPORT","description":"Multisport type."},
          {"value":"MUSICAL_PERFORMANCE","description":"Musical performance type."},
          {"value":"NORDIC_WALKING","description":"Nordic walking type."},
          {"value":"ORIENTEERING","description":"Orienteering type."},
          {"value":"OTHER","description":"Other type."},
          {"value":"OUTDOOR_BIKE","description":"Outdoor bike type."},
          {"value":"OUTDOOR_WORKOUT","description":"Outdoor workout type."},
          {"value":"PADDLEBOARDING","description":"Paddleboarding type."},
          {"value":"PADEL","description":"Padel type."},
          {"value":"PAINTING","description":"Painting type."},
          {"value":"PARAGLIDING","description":"Paragliding type."},
          {"value":"PARKOUR","description":"Parkour type."},
          {"value":"PICKELBALL","description":"Pickelball type."},
          {"value":"PILATES","description":"Pilates type."},
          {"value":"POLO","description":"Polo type."},
          {"value":"POWERLIFTING","description":"Powerlifting type."},
          {"value":"POWER_WALKING","description":"Power walking type."},
          {"value":"RACKET_SPORTS","description":"Racket sports type."},
          {"value":"RACQUETBALL","description":"Racquetball type."},
          {"value":"RESISTANCE_BANDS","description":"Resistance bands type."},
          {"value":"ROCK_CLIMBING","description":"Rock climbing type."},
          {"value":"ROLLERBLADING","description":"Rollerblading type."},
          {"value":"ROLLER_SKATING","description":"Roller skating type."},
          {"value":"ROWING","description":"Rowing type."},
          {"value":"ROWING_MACHINE","description":"Rowing machine type."},
          {"value":"RUCKING","description":"Rucking type."},
          {"value":"RUGBY","description":"Rugby type."},
          {"value":"RUNNING","description":"Running type."},
          {"value":"SAILING","description":"Sailing type."},
          {"value":"SCOOTERING","description":"Scootering type."},
          {"value":"SCUBA_DIVING","description":"Scuba diving type."},
          {"value":"SHOOTING","description":"Shooting type."},
          {"value":"SHOVELING","description":"Shoveling type."},
          {"value":"SKATEBOARDING","description":"Skateboarding type."},
          {"value":"SKATING","description":"Skating type."},
          {"value":"SKIING","description":"Skiing type."},
          {"value":"SKYDIVING","description":"Skydiving type."},
          {"value":"SNORKELING","description":"Snorkeling type."},
          {"value":"SNOWBOARDING","description":"Snowboarding type."},
          {"value":"SNOWMOBILING","description":"Snowmobiling type."},
          {"value":"SNOWSHOEING","description":"Snowshoeing type."},
          {"value":"SNOW_SPORT","description":"Snow sport type."},
          {"value":"SOCCER","description":"Soccer type."},
          {"value":"SOFTBALL","description":"Softball type."},
          {"value":"SPEED_SKATING","description":"Speed skating type."},
          {"value":"SPINNING","description":"Spinning type."},
          {"value":"SPORT","description":"Sport type."},
          {"value":"SQUASH","description":"Squash type."},
          {"value":"STAIRCLIMBER","description":"Stairclimber type."},
          {"value":"STATIONARY_BIKE","description":"Stationary bike type."},
          {"value":"STEP_TRAINING","description":"Step training type."},
          {"value":"STRENGTH_TRAINING","description":"Strength training type."},
          {"value":"STRETCHING","description":"Stretching type."},
          {"value":"STROLLER_WALK","description":"Stroller walk type."},
          {"value":"SURFING","description":"Surfing type."},
          {"value":"SWIMMING","description":"Swimming type."},
          {"value":"SWIMMING_OPEN_WATER","description":"Swimming open water type."},
          {"value":"SWIMMING_POOL","description":"Swimming pool type."},
          {"value":"SYNCHRONIZED_SWIMMING","description":"Synchronized swimming type."},
          {"value":"TABATA_WORKOUT","description":"Tabata workout type."},
          {"value":"TABLE_TENNIS","description":"Table tennis type."},
          {"value":"TAEKWONDO","description":"Taekwondo type."},
          {"value":"TAI_CHI","description":"Tai chi type."},
          {"value":"TANGO","description":"Tango type."},
          {"value":"TENNIS","description":"Tennis type."},
          {"value":"TRACK_AND_FIELD","description":"Track and field type."},
          {"value":"TRAIL_RUN","description":"Trail run type."},
          {"value":"TRAMPOLINE","description":"Trampoline type."},
          {"value":"TREADMILL","description":"Treadmill type."},
          {"value":"TREADMILL_WALK","description":"Treadmill walk type."},
          {"value":"TRX","description":"Trx type."},
          {"value":"ULTIMATE_FRISBEE","description":"Ultimate frisbee type."},
          {"value":"UNICYCLING","description":"Unicycling type."},
          {"value":"VOLLEYBALL","description":"Volleyball type."},
          {"value":"VOLLEYBALL_BEACH","description":"Volleyball beach type."},
          {"value":"WAKEBOARDING","description":"Wakeboarding type."},
          {"value":"WALKING","description":"Walking type."},
          {"value":"WALK_WITH_WEIGHTS","description":"Walk with weights type."},
          {"value":"WATER_AEROBICS","description":"Water aerobics type."},
          {"value":"WATER_JOGGING","description":"Water jogging type."},
          {"value":"WATER_POLO","description":"Water polo type."},
          {"value":"WATER_SKIING","description":"Water skiing type."},
          {"value":"WATER_SPORT","description":"Water sport type."},
          {"value":"WATER_VOLLEYBALL","description":"Water volleyball type."},
          {"value":"WEEDING","description":"Weeding type."},
          {"value":"WEIGHTLIFTING","description":"Weightlifting type."},
          {"value":"WEIGHT_MACHINES","description":"Weight machines type."},
          {"value":"WEIGHTS","description":"Weights type."},
          {"value":"WHEELCHAIR","description":"Wheelchair type."},
          {"value":"WINDSURFING","description":"Windsurfing type."},
          {"value":"WORKOUT","description":"Workout type."},
          {"value":"WRESTLING","description":"Wrestling type."},
          {"value":"YOGA","description":"Yoga type."},
          {"value":"YOGA_BIKRAM","description":"Yoga bikram type."},
          {"value":"YOGA_HATHA","description":"Yoga hatha type."},
          {"value":"YOGA_POWER","description":"Yoga power type."},
          {"value":"YOGA_VINYASA","description":"Yoga vinyasa type."},
          {"value":"ZUMBA","description":"Zumba type."}
        ]
      },
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed exercise interval",
        "enum": null
      },
      {
        "name": "metricsSummary",
        "type": "MetricsSummary",
        "ref": "MetricsSummary",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Summary metrics for this exercise ( )",
        "enum": null
      },
      {
        "name": "activeDuration",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Duration excluding pauses.",
        "enum": null
      },
      {
        "name": "createTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Represents the timestamp of the creation of the exercise.",
        "enum": null
      },
      {
        "name": "exerciseEvents",
        "type": "array<ExerciseEvent>",
        "ref": null,
        "itemsRef": "ExerciseEvent",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Exercise events that happen during an exercise, such as pause & restarts.",
        "enum": null
      },
      {
        "name": "exerciseMetadata",
        "type": "ExerciseMetadata",
        "ref": "ExerciseMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Additional exercise metadata.",
        "enum": null
      },
      {
        "name": "notes",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard free-form notes captured at manual logging.",
        "enum": null
      },
      {
        "name": "splits",
        "type": "array<SplitSummary>",
        "ref": null,
        "itemsRef": "SplitSummary",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The default split is 1 km or 1 mile. - if the movement distance is less than the default, then there are no splits - if the movement distance is greater than or equal to the default, then we have splits",
        "enum": null
      },
      {
        "name": "splitSummaries",
        "type": "array<SplitSummary>",
        "ref": null,
        "itemsRef": "SplitSummary",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Laps or splits recorded within an exercise. Laps could be split based on distance or other criteria (duration, etc.) Laps should not be overlapping with each other.",
        "enum": null
      },
      {
        "name": "updateTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. This is the timestamp of the last update to the exercise.",
        "enum": null
      }
    ]
  },
  "ExerciseEvent": {
    "id": "ExerciseEvent",
    "source": "v4",
    "description": "Represents instantaneous events that happen during an exercise, such as start, stop, pause, split.",
    "fields": [
      {
        "name": "eventTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Exercise event time",
        "enum": null
      },
      {
        "name": "eventUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Exercise event time offset from UTC",
        "enum": null
      },
      {
        "name": "exerciseEventType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The type of the event, such as start, stop, pause, resume.",
        "enum": [
          {"value":"EXERCISE_EVENT_TYPE_UNSPECIFIED","description":"Exercise event type is unspecified."},
          {"value":"START","description":"Exercise start event."},
          {"value":"STOP","description":"Exercise stop event."},
          {"value":"PAUSE","description":"Exercise pause event."},
          {"value":"RESUME","description":"Exercise resume event."},
          {"value":"AUTO_PAUSE","description":"Exercise auto-pause event."},
          {"value":"AUTO_RESUME","description":"Exercise auto-resume event."}
        ]
      }
    ]
  },
  "ExerciseMetadata": {
    "id": "ExerciseMetadata",
    "source": "v4",
    "description": "Additional exercise metadata.",
    "fields": [
      {
        "name": "hasGps",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Whether the exercise had GPS tracking.",
        "enum": null
      },
      {
        "name": "poolLengthMillimeters",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Pool length in millimeters. Only present in the swimming exercises.",
        "enum": null
      }
    ]
  },
  "Floors": {
    "id": "Floors",
    "source": "v4",
    "description": "Gained elevation measured in floors over the time interval",
    "fields": [
      {
        "name": "count",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Number of floors in the recorded interval. Must be in the range `[0, 1000000]`.",
        "enum": null
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval",
        "enum": null
      }
    ]
  },
  "FloorsRollupValue": {
    "id": "FloorsRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the user's floors.",
    "fields": [
      {
        "name": "countSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Sum of the floors count.",
        "enum": null
      }
    ]
  },
  "Food": {
    "id": "Food",
    "source": "v4",
    "description": "Represents a food item.",
    "fields": [
      {
        "name": "accessLevel",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The access level of the food.",
        "enum": [
          {"value":"FOOD_ACCESS_LEVEL_UNSPECIFIED","description":"Unspecified food access level."},
          {"value":"FOOD_ACCESS_LEVEL_PUBLIC","description":"Public food access level."},
          {"value":"FOOD_ACCESS_LEVEL_PRIVATE","description":"Private food access level."}
        ]
      },
      {
        "name": "defaultServing",
        "type": "FoodServing",
        "ref": "FoodServing",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Value representing the default serving of the food.",
        "enum": null
      },
      {
        "name": "displayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The display name of the food.",
        "enum": null
      },
      {
        "name": "brand",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The brand of the food.",
        "enum": null
      },
      {
        "name": "description",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The description of the food.",
        "enum": null
      },
      {
        "name": "energyAvg",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the average energy of the food for the default serving.",
        "enum": null
      },
      {
        "name": "energyFromFat",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the energy from fat of the food for the default serving.",
        "enum": null
      },
      {
        "name": "energyMax",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the maximum energy of the food for the default serving.",
        "enum": null
      },
      {
        "name": "energyMin",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the minimum energy of the food for the default serving.",
        "enum": null
      },
      {
        "name": "languageCode",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The language code where the food is available in format xx-XX. Supported values are defined in Settings.food_language_code.",
        "enum": null
      },
      {
        "name": "mealType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The meal type associated with this food.",
        "enum": [
          {"value":"MEAL_TYPE_UNSPECIFIED","description":"Unspecified meal type."},
          {"value":"BEFORE_BREAKFAST","description":"Value representing a meal before breakfast."},
          {"value":"BREAKFAST","description":"Value representing a breakfast."},
          {"value":"BEFORE_LUNCH","description":"Value representing a morning snack."},
          {"value":"LUNCH","description":"Value representing a lunch."},
          {"value":"BEFORE_DINNER","description":"Value representing an afternoon snack."},
          {"value":"DINNER","description":"Value representing dinner."},
          {"value":"AFTER_DINNER","description":"Value representing an evening snack."},
          {"value":"SNACK","description":"Value representing any meal outside of the usual three meals per day."},
          {"value":"ANYTIME","description":"Value representing any time (legacy NA)."}
        ]
      },
      {
        "name": "nutrients",
        "type": "array<NutrientQuantity>",
        "ref": null,
        "itemsRef": "NutrientQuantity",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the nutrients of the food for the default serving.",
        "enum": null
      },
      {
        "name": "servings",
        "type": "array<FoodServing>",
        "ref": null,
        "itemsRef": "FoodServing",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The serving of the food.",
        "enum": null
      },
      {
        "name": "totalCarbohydrate",
        "type": "WeightQuantity",
        "ref": "WeightQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the total carbohydrate of the food for the default serving.",
        "enum": null
      },
      {
        "name": "totalFat",
        "type": "WeightQuantity",
        "ref": "WeightQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the total fat of the food for the default serving.",
        "enum": null
      }
    ]
  },
  "FoodMeasurementUnit": {
    "id": "FoodMeasurementUnit",
    "source": "v4",
    "description": "Represents a food measurement unit.",
    "fields": [
      {
        "name": "displayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The display name of the food measurement unit (e.g., \"gram\", \"piece\").",
        "enum": null
      },
      {
        "name": "pluralDisplayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The plural display name of the food measurement unit (e.g., \"grams\", \"pieces\").",
        "enum": null
      }
    ]
  },
  "FoodServing": {
    "id": "FoodServing",
    "source": "v4",
    "description": "Represents different properties and information about the serving of a specific food.",
    "fields": [
      {
        "name": "foodMeasurementUnit",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Food measurement unit",
        "enum": null
      },
      {
        "name": "amount",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Amount of food consumed, fractional values are supported.",
        "enum": null
      },
      {
        "name": "foodMeasurementUnitDisplayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Legacy measurement unit for serving size in singular form (e.g. \"piece\", \"gram\").",
        "enum": null
      },
      {
        "name": "foodMeasurementUnitDisplayNamePlural",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Legacy measurement unit for serving size in plural form (e.g. \"pieces\", \"grams\").",
        "enum": null
      },
      {
        "name": "multiplier",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the multiplier used to compute the energy when using this serving instead of the default serving.",
        "enum": null
      }
    ]
  },
  "HeartRate": {
    "id": "HeartRate",
    "source": "v4",
    "description": "A heart rate measurement.",
    "fields": [
      {
        "name": "beatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The heart rate value in beats per minute. Must be in the range `[1, 300]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observation time",
        "enum": null
      },
      {
        "name": "metadata",
        "type": "HeartRateMetadata",
        "ref": "HeartRateMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Metadata about the heart rate sample.",
        "enum": null
      }
    ]
  },
  "HeartRateMetadata": {
    "id": "HeartRateMetadata",
    "source": "v4",
    "description": "Heart rate metadata.",
    "fields": [
      {
        "name": "motionContext",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Indicates the user’s level of activity when the heart rate sample was measured",
        "enum": [
          {"value":"MOTION_CONTEXT_UNSPECIFIED","description":"The default value when no data is available."},
          {"value":"ACTIVE","description":"The user is active."},
          {"value":"SEDENTARY","description":"The user is inactive."}
        ]
      },
      {
        "name": "sensorLocation",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Indicates the location of the sensor that measured the heart rate.",
        "enum": [
          {"value":"SENSOR_LOCATION_UNSPECIFIED","description":"The default value when no data is available."},
          {"value":"CHEST","description":"Chest sensor."},
          {"value":"WRIST","description":"Wrist sensor."},
          {"value":"FINGER","description":"Finger sensor."},
          {"value":"HAND","description":"Hand sensor."},
          {"value":"EAR_LOBE","description":"Ear lobe sensor."},
          {"value":"FOOT","description":"Foot sensor."}
        ]
      }
    ]
  },
  "HeartRateRollupValue": {
    "id": "HeartRateRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the heart rate data type.",
    "fields": [
      {
        "name": "beatsPerMinuteAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The average heart rate value in the interval.",
        "enum": null
      },
      {
        "name": "beatsPerMinuteMax",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The maximum heart rate value in the interval.",
        "enum": null
      },
      {
        "name": "beatsPerMinuteMin",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The minimum heart rate value in the interval.",
        "enum": null
      }
    ]
  },
  "HeartRateVariability": {
    "id": "HeartRateVariability",
    "source": "v4",
    "description": "Captures user's heart rate variability (HRV) as measured by the root mean square of successive differences (RMSSD) between normal heartbeats or by standard deviation of the inter-beat intervals (SDNN).",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time of the heart rate variability measurement.",
        "enum": null
      },
      {
        "name": "metadata",
        "type": "HeartRateVariabilityMetadata",
        "ref": "HeartRateVariabilityMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Additional information about the heart rate variability measurement.",
        "enum": null
      },
      {
        "name": "rootMeanSquareOfSuccessiveDifferencesMilliseconds",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The root mean square of successive differences between normal heartbeats. This is a measure of heart rate variability used by Google Health. Must be in the range `[1, 200]`.",
        "enum": null
      },
      {
        "name": "standardDeviationMilliseconds",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The standard deviation of the heart rate variability measurement.",
        "enum": null
      }
    ]
  },
  "HeartRateVariabilityMetadata": {
    "id": "HeartRateVariabilityMetadata",
    "source": "v4",
    "description": "Metadata for HeartRateVariability.",
    "fields": [
      {
        "name": "highFrequencyPower",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The power in interbeat interval fluctuations within the high frequency band (0.15 Hz - 0.4 Hz).",
        "enum": null
      },
      {
        "name": "lowFrequencyPower",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The power in interbeat interval fluctuations within the low frequency band (0.04 Hz - 0.15 Hz).",
        "enum": null
      }
    ]
  },
  "HeartRateZone": {
    "id": "HeartRateZone",
    "source": "v4",
    "description": "The heart rate zone.",
    "fields": [
      {
        "name": "heartRateZoneType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The heart rate zone type.",
        "enum": [
          {"value":"HEART_RATE_ZONE_TYPE_UNSPECIFIED","description":"Unspecified heart rate zone."},
          {"value":"LIGHT","description":"The light heart rate zone."},
          {"value":"MODERATE","description":"The moderate heart rate zone."},
          {"value":"VIGOROUS","description":"The vigorous heart rate zone."},
          {"value":"PEAK","description":"The peak heart rate zone."}
        ]
      },
      {
        "name": "maxBeatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Maximum heart rate for this zone in beats per minute.",
        "enum": null
      },
      {
        "name": "minBeatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Minimum heart rate for this zone in beats per minute.",
        "enum": null
      }
    ]
  },
  "Height": {
    "id": "Height",
    "source": "v4",
    "description": "Body height measurement.",
    "fields": [
      {
        "name": "heightMillimeters",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Height of the user in millimeters. Must be in the range `[0, 3000]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which the height was recorded.",
        "enum": null
      }
    ]
  },
  "HydrationLog": {
    "id": "HydrationLog",
    "source": "v4",
    "description": "Holds information about a user logged hydration.",
    "fields": [
      {
        "name": "amountConsumed",
        "type": "VolumeQuantity",
        "ref": "VolumeQuantity",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Amount of liquid (ex. water) consumed.",
        "enum": null
      },
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "HydrationLogRollupValue": {
    "id": "HydrationLogRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the hydration log data type.",
    "fields": [
      {
        "name": "amountConsumed",
        "type": "VolumeQuantityRollup",
        "ref": "VolumeQuantityRollup",
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Rollup for amount consumed.",
        "enum": null
      }
    ]
  },
  "Interval": {
    "id": "Interval",
    "source": "v4",
    "description": "Represents a time interval, encoded as a Timestamp start (inclusive) and a Timestamp end (exclusive). The start must be less than or equal to the end. When the start equals the end, the interval is empty (matches no time). When both start and end are unspecified, the interval matches any time.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Exclusive end of the interval. If specified, a Timestamp matching this interval will have to be before the end.",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Inclusive start of the interval. If specified, a Timestamp matching this interval will have to be the same or after the start.",
        "enum": null
      }
    ]
  },
  "IrregularRhythmNotification": {
    "id": "IrregularRhythmNotification",
    "source": "v4",
    "description": "Represents an Irregular Rhythm Notification alert, indicating a potential sign of atrial fibrillation (AFib). This data type is based on SaMD feature and any changes to it may require additional review.",
    "fields": [
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      },
      {
        "name": "alertWindows",
        "type": "array<AlertWindow>",
        "ref": null,
        "itemsRef": "AlertWindow",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The overlapping analysis windows that were used to evaluate rhythm for potential AFib, containing specific information about the user's heart rhythm.",
        "enum": null
      },
      {
        "name": "medicalDeviceInfo",
        "type": "MedicalDeviceInfo",
        "ref": "MedicalDeviceInfo",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The meta information for the compatible device used to conduct the measurement. Irregular Rhythm Notification measurements typically populate `algorithm_version`, `service_version`, and `device_model`.",
        "enum": null
      }
    ]
  },
  "MedicalDeviceInfo": {
    "id": "MedicalDeviceInfo",
    "source": "v4",
    "description": "Software as Medical Device (SaMD) metadata. Used to construct the Unique Device Identifier (UDI).",
    "fields": [
      {
        "name": "algorithmVersion",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The algorithm version used by the feature.",
        "enum": null
      },
      {
        "name": "deviceModel",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The model name or device type of the compatible device used to collect the data.",
        "enum": null
      },
      {
        "name": "featureVersion",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The version of the feature/app running on the device.",
        "enum": null
      },
      {
        "name": "firmwareVersion",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The firmware version running on the compatible device used to collect the data.",
        "enum": null
      },
      {
        "name": "serviceVersion",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The service version used by the feature.",
        "enum": null
      }
    ]
  },
  "MenstrualPeriod": {
    "id": "MenstrualPeriod",
    "source": "v4",
    "description": "Menstrual period record.",
    "fields": [
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      },
      {
        "name": "notes",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard free-form notes captured at manual logging.",
        "enum": null
      }
    ]
  },
  "MetricsSummary": {
    "id": "MetricsSummary",
    "source": "v4",
    "description": "Summary metrics for an exercise.",
    "fields": [
      {
        "name": "activeZoneMinutes",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Total active zone minutes for the exercise.",
        "enum": null
      },
      {
        "name": "averageHeartRateBeatsPerMinute",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Average heart rate during the exercise.",
        "enum": null
      },
      {
        "name": "averagePaceSecondsPerMeter",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Average pace in seconds per meter.",
        "enum": null
      },
      {
        "name": "averageSpeedMillimetersPerSecond",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Average speed in millimeters per second.",
        "enum": null
      },
      {
        "name": "caloriesKcal",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Total calories burned by the user during the exercise.",
        "enum": null
      },
      {
        "name": "distanceMillimeters",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Total distance covered by the user during the exercise.",
        "enum": null
      },
      {
        "name": "elevationGainMillimeters",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Total elevation gain during the exercise.",
        "enum": null
      },
      {
        "name": "heartRateZoneDurations",
        "type": "TimeInHeartRateZones",
        "ref": "TimeInHeartRateZones",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Time spent in each heart rate zone.",
        "enum": null
      },
      {
        "name": "mobilityMetrics",
        "type": "MobilityMetrics",
        "ref": "MobilityMetrics",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Mobility workouts specific metrics. Only present in the advanced running exercises.",
        "enum": null
      },
      {
        "name": "runVo2Max",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Run VO2 max value for the exercise. Only present in the running exercises at the top level as in the summary of the whole exercise.",
        "enum": null
      },
      {
        "name": "steps",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Total steps taken during the exercise.",
        "enum": null
      },
      {
        "name": "totalSwimLengths",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Number of full pool lengths completed during the exercise. Only present in the swimming exercises at the top level as in the summary of the whole exercise.",
        "enum": null
      }
    ]
  },
  "Moods": {
    "id": "Moods",
    "source": "v4",
    "description": "Moods record.",
    "fields": [
      {
        "name": "moods",
        "type": "array<string>",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The moods logged.",
        "enum": [
          {"value":"MOOD_UNSPECIFIED","description":"Unspecified mood."},
          {"value":"AMAZED","description":"Amazed."},
          {"value":"AMUSED","description":"Amused."},
          {"value":"ANGRY","description":"Angry."},
          {"value":"ANNOYED","description":"Annoyed."},
          {"value":"ANXIOUS","description":"Anxious."},
          {"value":"HAPPY","description":"Happy."},
          {"value":"CONTENT","description":"Content."},
          {"value":"SAD","description":"Sad."},
          {"value":"WORRIED","description":"Worried."},
          {"value":"FRUSTRATED","description":"Frustrated."},
          {"value":"EXCITED","description":"Excited."},
          {"value":"CALM","description":"Calm."},
          {"value":"STRESSED","description":"Stressed."},
          {"value":"ASHAMED","description":"Ashamed."},
          {"value":"BRAVE","description":"Brave."},
          {"value":"CONFIDENT","description":"Confident."},
          {"value":"DISAPPOINTED","description":"Disappointed."},
          {"value":"DISCOURAGED","description":"Discouraged."},
          {"value":"DISGUSTED","description":"Disgusted."},
          {"value":"DRAINED","description":"Drained."},
          {"value":"EMBARRASSED","description":"Embarrassed."},
          {"value":"GRATEFUL","description":"Grateful."},
          {"value":"GUILTY","description":"Guilty."},
          {"value":"HOPEFUL","description":"Hopeful."},
          {"value":"HOPELESS","description":"Hopeless."},
          {"value":"INDIFFERENT","description":"Indifferent."},
          {"value":"IRRITATED","description":"Irritated."},
          {"value":"JEALOUS","description":"Jealous."},
          {"value":"JOYFUL","description":"Joyful."},
          {"value":"LONELY","description":"Lonely."},
          {"value":"OVERWHELMED","description":"Overwhelmed."},
          {"value":"PASSIONATE","description":"Passionate."},
          {"value":"PEACEFUL","description":"Peaceful."},
          {"value":"PROUD","description":"Proud."},
          {"value":"RELIEVED","description":"Relieved."},
          {"value":"SATISFIED","description":"Satisfied."},
          {"value":"SCARED","description":"Scared."},
          {"value":"SURPRISED","description":"Surprised."},
          {"value":"ENERGIZED","description":"Energized."},
          {"value":"FATIGUED","description":"Fatigued."},
          {"value":"VERY_CALM","description":"Very calm."},
          {"value":"VERY_STRESSED","description":"Very stressed."},
          {"value":"NEUTRAL","description":"Neutral."},
          {"value":"AFRAID","description":"Afraid."},
          {"value":"HURTING","description":"Hurting."},
          {"value":"BORED","description":"Bored."},
          {"value":"BITTER","description":"Bitter."},
          {"value":"ENVIOUS","description":"Envious."},
          {"value":"CONFUSED","description":"Confused."},
          {"value":"CURIOUS","description":"Curious."},
          {"value":"AWESTRUCK","description":"Awestruck."},
          {"value":"INSPIRED","description":"Inspired."},
          {"value":"LONGING","description":"Longing."},
          {"value":"ACCOMPLISHED","description":"Accomplished."},
          {"value":"LOVING","description":"Loving."},
          {"value":"COMPASSIONATE","description":"Compassionate."},
          {"value":"DEPRESSED","description":"Depressed."},
          {"value":"GOOD","description":"Good."},
          {"value":"LOW_ENERGY","description":"Low energy."},
          {"value":"OBSESSIVE_THOUGHTS","description":"Obsessive thoughts."},
          {"value":"PANIC","description":"Panic."},
          {"value":"PLAYFUL","description":"Playful."},
          {"value":"PLEASED","description":"Pleased."},
          {"value":"SENSITIVE","description":"Sensitive."},
          {"value":"SLEEPY","description":"Sleepy."},
          {"value":"SWINGS","description":"Mood swings."},
          {"value":"UNHAPPY","description":"Unhappy."},
          {"value":"VERY_SELF_CRITICAL","description":"Very self-critical."}
        ]
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which moods were measured.",
        "enum": null
      },
      {
        "name": "valences",
        "type": "array<string>",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The valences.",
        "enum": [
          {"value":"VALENCE_UNSPECIFIED","description":"Unspecified valence."},
          {"value":"UNPLEASANT","description":"Unpleasant."},
          {"value":"BASELINE","description":"Baseline."},
          {"value":"PLEASANT","description":"Pleasant."}
        ]
      }
    ]
  },
  "NutrientQuantity": {
    "id": "NutrientQuantity",
    "source": "v4",
    "description": "Represents the quantity of a nutrient.",
    "fields": [
      {
        "name": "nutrient",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The nutrient type.",
        "enum": [
          {"value":"NUTRIENT_UNSPECIFIED","description":"Unspecified nutrient."},
          {"value":"BIOTIN","description":"Value representing biotin nutrient."},
          {"value":"CAFFEINE","description":"Value representing caffeine nutrient."},
          {"value":"CALCIUM","description":"Value representing calcium nutrient."},
          {"value":"CHLORIDE","description":"Value representing chloride nutrient."},
          {"value":"CARBOHYDRATES","description":"Value representing carbohydrates nutrient."},
          {"value":"CHOLESTEROL","description":"Value representing cholesterol nutrient."},
          {"value":"CHROMIUM","description":"Value representing chromium nutrient."},
          {"value":"COPPER","description":"Value representing copper nutrient."},
          {"value":"DIETARY_FIBER","description":"Value representing dietary fiber nutrient."},
          {"value":"FOLIC_ACID","description":"Value representing folic acid nutrient."},
          {"value":"IODINE","description":"Value representing iodine nutrient."},
          {"value":"IRON","description":"Value representing iron nutrient."},
          {"value":"MAGNESIUM","description":"Value representing magnesium nutrient."},
          {"value":"MANGANESE","description":"Value representing manganese nutrient."},
          {"value":"MOLYBDENUM","description":"Value representing molybdenum nutrient."},
          {"value":"MONOUNSATURATED_FAT","description":"Value representing monounsaturated fat nutrient."},
          {"value":"NIACIN","description":"Value representing niacin nutrient."},
          {"value":"PANTOTHENIC_ACID","description":"Value representing pantothenic acid nutrient."},
          {"value":"PHOSPHORUS","description":"Value representing phosphorus nutrient."},
          {"value":"POLYUNSATURATED_FAT","description":"Value representing polyunsaturated fat nutrient."},
          {"value":"POTASSIUM","description":"Value representing potassium nutrient."},
          {"value":"PROTEIN","description":"Value representing protein nutrient."},
          {"value":"RIBOFLAVIN","description":"Value representing riboflavin nutrient."},
          {"value":"SATURATED_FAT","description":"Value representing saturated fat nutrient."},
          {"value":"SELENIUM","description":"Value representing selenium nutrient."},
          {"value":"SODIUM","description":"Value representing sodium nutrient."},
          {"value":"SUGAR","description":"Value representing sugar nutrient."},
          {"value":"THIAMIN","description":"Value representing thiamin nutrient."},
          {"value":"TRANS_FAT","description":"Value representing trans fat nutrient."},
          {"value":"UNSATURATED_FAT","description":"Value representing unsaturated fat nutrient."},
          {"value":"VITAMIN_A","description":"Value representing vitamin A nutrient."},
          {"value":"VITAMIN_B12","description":"Value representing vitamin B12 nutrient."},
          {"value":"VITAMIN_B6","description":"Value representing vitamin B6 nutrient."},
          {"value":"VITAMIN_C","description":"Value representing vitamin C nutrient."},
          {"value":"VITAMIN_D","description":"Value representing vitamin D nutrient."},
          {"value":"VITAMIN_E","description":"Value representing vitamin E nutrient."},
          {"value":"VITAMIN_K","description":"Value representing vitamin K nutrient."},
          {"value":"ZINC","description":"Value representing zinc nutrient."},
          {"value":"FOLATE","description":"Value representing folate nutrient."}
        ]
      },
      {
        "name": "quantity",
        "type": "WeightQuantity",
        "ref": "WeightQuantity",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The quantity of the nutrient, measured in grams.",
        "enum": null
      }
    ]
  },
  "NutrientQuantityRollup": {
    "id": "NutrientQuantityRollup",
    "source": "v4",
    "description": "Nutrient quantity rollup.",
    "fields": [
      {
        "name": "nutrient",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Aggregated nutrient.",
        "enum": [
          {"value":"NUTRIENT_UNSPECIFIED","description":"Unspecified nutrient."},
          {"value":"BIOTIN","description":"Value representing biotin nutrient."},
          {"value":"CAFFEINE","description":"Value representing caffeine nutrient."},
          {"value":"CALCIUM","description":"Value representing calcium nutrient."},
          {"value":"CHLORIDE","description":"Value representing chloride nutrient."},
          {"value":"CARBOHYDRATES","description":"Value representing carbohydrates nutrient."},
          {"value":"CHOLESTEROL","description":"Value representing cholesterol nutrient."},
          {"value":"CHROMIUM","description":"Value representing chromium nutrient."},
          {"value":"COPPER","description":"Value representing copper nutrient."},
          {"value":"DIETARY_FIBER","description":"Value representing dietary fiber nutrient."},
          {"value":"FOLIC_ACID","description":"Value representing folic acid nutrient."},
          {"value":"IODINE","description":"Value representing iodine nutrient."},
          {"value":"IRON","description":"Value representing iron nutrient."},
          {"value":"MAGNESIUM","description":"Value representing magnesium nutrient."},
          {"value":"MANGANESE","description":"Value representing manganese nutrient."},
          {"value":"MOLYBDENUM","description":"Value representing molybdenum nutrient."},
          {"value":"MONOUNSATURATED_FAT","description":"Value representing monounsaturated fat nutrient."},
          {"value":"NIACIN","description":"Value representing niacin nutrient."},
          {"value":"PANTOTHENIC_ACID","description":"Value representing pantothenic acid nutrient."},
          {"value":"PHOSPHORUS","description":"Value representing phosphorus nutrient."},
          {"value":"POLYUNSATURATED_FAT","description":"Value representing polyunsaturated fat nutrient."},
          {"value":"POTASSIUM","description":"Value representing potassium nutrient."},
          {"value":"PROTEIN","description":"Value representing protein nutrient."},
          {"value":"RIBOFLAVIN","description":"Value representing riboflavin nutrient."},
          {"value":"SATURATED_FAT","description":"Value representing saturated fat nutrient."},
          {"value":"SELENIUM","description":"Value representing selenium nutrient."},
          {"value":"SODIUM","description":"Value representing sodium nutrient."},
          {"value":"SUGAR","description":"Value representing sugar nutrient."},
          {"value":"THIAMIN","description":"Value representing thiamin nutrient."},
          {"value":"TRANS_FAT","description":"Value representing trans fat nutrient."},
          {"value":"UNSATURATED_FAT","description":"Value representing unsaturated fat nutrient."},
          {"value":"VITAMIN_A","description":"Value representing vitamin A nutrient."},
          {"value":"VITAMIN_B12","description":"Value representing vitamin B12 nutrient."},
          {"value":"VITAMIN_B6","description":"Value representing vitamin B6 nutrient."},
          {"value":"VITAMIN_C","description":"Value representing vitamin C nutrient."},
          {"value":"VITAMIN_D","description":"Value representing vitamin D nutrient."},
          {"value":"VITAMIN_E","description":"Value representing vitamin E nutrient."},
          {"value":"VITAMIN_K","description":"Value representing vitamin K nutrient."},
          {"value":"ZINC","description":"Value representing zinc nutrient."},
          {"value":"FOLATE","description":"Value representing folate nutrient."}
        ]
      },
      {
        "name": "quantity",
        "type": "WeightQuantityRollup",
        "ref": "WeightQuantityRollup",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Aggregated nutrient weight.",
        "enum": null
      }
    ]
  },
  "NutritionLog": {
    "id": "NutritionLog",
    "source": "v4",
    "description": "Holds information about food logged by a user. There are two ways of creating a nutrition log based on the food type: 1. Identified food: Using the food field, which is a reference to a Food resource. In this case fields `nutrients`, `energy`, `energy_from_fat`, `total_carbohydrate`, `total_fat`, `food_display_name` will be populated based on the referenced food. 2. Anonymous food: Using the `food_display_name` field and setting the `nutrients`, `energy`, `energy_from_fat`, `total_carbohydrate`, `total_fat` fields manually. The identified food is preferred over the anonymous food. Nutrition logs created from anonymous food are not editable.",
    "fields": [
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time window when the food was logged.",
        "enum": null
      },
      {
        "name": "energy",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The total energy of the food, measured in kilocalories (`kcal`).",
        "enum": null
      },
      {
        "name": "energyFromFat",
        "type": "EnergyQuantity",
        "ref": "EnergyQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The energy from fat, measured in kilocalories (`kcal`).",
        "enum": null
      },
      {
        "name": "food",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The resource name of the Food item. Required when creating a nutrition log from an identified food. For anonymous food logs, use the `food_display_name` field instead.",
        "enum": null
      },
      {
        "name": "foodDisplayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The display name of the food. For identified food logs, this is populated automatically from the referenced food.",
        "enum": null
      },
      {
        "name": "mealType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The meal category. One of `BREAKFAST`, `LUNCH`, `DINNER`, or `SNACK`.",
        "enum": [
          {"value":"MEAL_TYPE_UNSPECIFIED","description":"Unspecified meal type."},
          {"value":"BEFORE_BREAKFAST","description":"Value representing a meal before breakfast."},
          {"value":"BREAKFAST","description":"Value representing a breakfast."},
          {"value":"BEFORE_LUNCH","description":"Value representing a morning snack."},
          {"value":"LUNCH","description":"Value representing a lunch."},
          {"value":"BEFORE_DINNER","description":"Value representing an afternoon snack."},
          {"value":"DINNER","description":"Value representing dinner."},
          {"value":"AFTER_DINNER","description":"Value representing an evening snack."},
          {"value":"SNACK","description":"Value representing any meal outside of the usual three meals per day."},
          {"value":"ANYTIME","description":"Value representing any time (legacy NA)."}
        ]
      },
      {
        "name": "nutrients",
        "type": "array<NutrientQuantity>",
        "ref": null,
        "itemsRef": "NutrientQuantity",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. An array of individual nutrient values for the nutrition log.",
        "enum": null
      },
      {
        "name": "serving",
        "type": "Serving",
        "ref": "Serving",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The serving information for the logged food.",
        "enum": null
      },
      {
        "name": "totalCarbohydrate",
        "type": "WeightQuantity",
        "ref": "WeightQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The total carbohydrate content, measured in grams.",
        "enum": null
      },
      {
        "name": "totalFat",
        "type": "WeightQuantity",
        "ref": "WeightQuantity",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The total fat content, measured in grams.",
        "enum": null
      }
    ]
  },
  "NutritionLogRollupValue": {
    "id": "NutritionLogRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the nutrition log data type.",
    "fields": [
      {
        "name": "energy",
        "type": "EnergyQuantityRollup",
        "ref": "EnergyQuantityRollup",
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Energy rollup.",
        "enum": null
      },
      {
        "name": "energyFromFat",
        "type": "EnergyQuantityRollup",
        "ref": "EnergyQuantityRollup",
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Value Energy from fat rollup.",
        "enum": null
      },
      {
        "name": "nutrients",
        "type": "array<NutrientQuantityRollup>",
        "ref": null,
        "itemsRef": "NutrientQuantityRollup",
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "List of the nutrient roll-ups by the nutrient type.",
        "enum": null
      },
      {
        "name": "totalCarbohydrate",
        "type": "WeightQuantityRollup",
        "ref": "WeightQuantityRollup",
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Total carbohydrate rollup.",
        "enum": null
      },
      {
        "name": "totalFat",
        "type": "WeightQuantityRollup",
        "ref": "WeightQuantityRollup",
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Total fat rollup.",
        "enum": null
      }
    ]
  },
  "ObservationSampleTime": {
    "id": "ObservationSampleTime",
    "source": "v4",
    "description": "Represents a sample time of an observed data point.",
    "fields": [
      {
        "name": "physicalTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time of the observation.",
        "enum": null
      },
      {
        "name": "utcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time during the observation relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "civilTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. The civil time in the timezone the subject is in at the time of the observation.",
        "enum": null
      }
    ]
  },
  "ObservationTimeInterval": {
    "id": "ObservationTimeInterval",
    "source": "v4",
    "description": "Represents a time interval of an observed data point.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval end time.",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the end of the observation relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval start time.",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the start of the observation relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "civilEndTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Observed interval end time in civil time in the timezone the subject is in at the end of the observed interval",
        "enum": null
      },
      {
        "name": "civilStartTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Observed interval start time in civil time in the timezone the subject is in at the start of the observed interval",
        "enum": null
      }
    ]
  },
  "OutOfBedSegment": {
    "id": "OutOfBedSegment",
    "source": "v4",
    "description": "A time interval to represent an out-of-bed segment.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Segment end time.",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the end of the segment relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Segment tart time.",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the start of the segment relative to the Coordinated Universal Time (UTC).",
        "enum": null
      }
    ]
  },
  "OvulationTest": {
    "id": "OvulationTest",
    "source": "v4",
    "description": "Ovulation test record.",
    "fields": [
      {
        "name": "result",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The result of the ovulation test.",
        "enum": [
          {"value":"OVULATION_TEST_RESULT_UNSPECIFIED","description":"Unspecified result."},
          {"value":"NEGATIVE","description":"Negative result."},
          {"value":"LUTEINIZING_HORMONE_SURGE","description":"Luteinizing hormone surge."},
          {"value":"ESTROGEN_SURGE","description":"Estrogen surge."},
          {"value":"POSITIVE","description":"Positive result."},
          {"value":"INDETERMINATE","description":"Indeterminate result."}
        ]
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which ovulation test was measured.",
        "enum": null
      }
    ]
  },
  "OxygenSaturation": {
    "id": "OxygenSaturation",
    "source": "v4",
    "description": "Captures the user's instantaneous oxygen saturation percentage (SpO2).",
    "fields": [
      {
        "name": "percentage",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The oxygen saturation percentage. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which oxygen saturation was measured.",
        "enum": null
      }
    ]
  },
  "RespiratoryRateSleepSummary": {
    "id": "RespiratoryRateSleepSummary",
    "source": "v4",
    "description": "Records respiratory rate details during sleep. Can have multiple per day if the user sleeps multiple times.",
    "fields": [
      {
        "name": "fullSleepStats",
        "type": "RespiratoryRateSleepSummaryStatistics",
        "ref": "RespiratoryRateSleepSummaryStatistics",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Full respiratory rate statistics.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which respiratory rate was measured.",
        "enum": null
      },
      {
        "name": "deepSleepStats",
        "type": "RespiratoryRateSleepSummaryStatistics",
        "ref": "RespiratoryRateSleepSummaryStatistics",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Respiratory rate statistics for deep sleep.",
        "enum": null
      },
      {
        "name": "lightSleepStats",
        "type": "RespiratoryRateSleepSummaryStatistics",
        "ref": "RespiratoryRateSleepSummaryStatistics",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Respiratory rate statistics for light sleep.",
        "enum": null
      },
      {
        "name": "remSleepStats",
        "type": "RespiratoryRateSleepSummaryStatistics",
        "ref": "RespiratoryRateSleepSummaryStatistics",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Respiratory rate statistics for REM sleep.",
        "enum": null
      }
    ]
  },
  "RespiratoryRateSleepSummaryStatistics": {
    "id": "RespiratoryRateSleepSummaryStatistics",
    "source": "v4",
    "description": "Respiratory rate statistics for a given sleep stage.",
    "fields": [
      {
        "name": "breathsPerMinute",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Average breaths per minute.",
        "enum": null
      },
      {
        "name": "signalToNoise",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. How trustworthy the data is for the computation.",
        "enum": null
      },
      {
        "name": "standardDeviation",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard deviation of the respiratory rate during sleep.",
        "enum": null
      }
    ]
  },
  "RollUpDataPointsRequest": {
    "id": "RollUpDataPointsRequest",
    "source": "v4",
    "description": "Request to roll up data points by physical time intervals.",
    "fields": [
      {
        "name": "range",
        "type": "Interval",
        "ref": "Interval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Closed-open range of data points that will be rolled up. The maximum range for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes` and `total-calories` is 14 days. The maximum range for all other data types is 90 days.",
        "enum": null
      },
      {
        "name": "windowSize",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The size of the time window to group data points into before applying the aggregation functions. Must be at least 1 second. If the requested range is not an exact multiple of `window_size`, the final bucket chronologically will be truncated at the upper endpoint of the range and will cover a duration shorter than `window_size`.",
        "enum": null
      },
      {
        "name": "dataSourceFamily",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The data source family name to roll up. If empty, data points from all available data sources will be rolled up. Format: `users/{user}/dataSourceFamilies/{data_source_family}` The `{user}` can be either the alias `me` or the authenticated user's numeric Health User ID, retrieved via GetIdentity (e.g. `users/me/dataSourceFamilies/...` or `users/1234567890/dataSourceFamilies/...`). The supported values are: - `users/{user}/dataSourceFamilies/all-sources` - Default value. Includes data from all available data sources. - `users/{user}/dataSourceFamilies/google-wearables` - Includes data from Google and Fitbit tracker devices (such as Fitbit trackers and Pixel Watch). Excludes manually logged data. - `users/{user}/dataSourceFamilies/google-sources` - Includes first-party Google data, such as data from tracker devices, manually logged data, and Health Connect. - `users/{user}/dataSourceFamilies/self-sources` - Includes only the data the calling client wrote through this API, that is, data points whose data source was registered through this API with the same OAuth client ID as the caller. Callers that were only granted write scopes for the requested data type may only read the data they wrote themselves: their requests are implicitly restricted to `self-sources`, and requesting any other data source family fails with `PERMISSION_DENIED`. If no data point matches the requested data source family, the response is an empty list rather than an error.",
        "enum": null
      },
      {
        "name": "pageSize",
        "type": "integer/int32",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The maximum number of data points to return. If unspecified, at most 1440 data points will be returned. The maximum page size is 10000; values above that will be truncated accordingly.",
        "enum": null
      },
      {
        "name": "pageToken",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The next_page_token from a previous request, if any. All other request fields need to be the same as in the initial request when the page token is specified.",
        "enum": null
      }
    ]
  },
  "RunVO2Max": {
    "id": "RunVO2Max",
    "source": "v4",
    "description": "VO2 max value calculated based on the user's running activity. Value stored in ml/kg/min.",
    "fields": [
      {
        "name": "runVo2Max",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Run VO2 max value in ml/kg/min. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which the metric was measured.",
        "enum": null
      }
    ]
  },
  "RunVO2MaxRollupValue": {
    "id": "RunVO2MaxRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the user's daily heart rate variability personal range.",
    "fields": [
      {
        "name": "rateAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Average value of run VO2 max in the interval.",
        "enum": null
      },
      {
        "name": "rateMax",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Maximum value of run VO2 max in the interval.",
        "enum": null
      },
      {
        "name": "rateMin",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Minimum value of run VO2 max in the interval..",
        "enum": null
      }
    ]
  },
  "SedentaryPeriod": {
    "id": "SedentaryPeriod",
    "source": "v4",
    "description": "SedentaryPeriod SedentaryPeriod data represents the periods of time that the user was sedentary (i.e. not moving while wearing the device).",
    "fields": [
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "SedentaryPeriodRollupValue": {
    "id": "SedentaryPeriodRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the user's sedentary periods.",
    "fields": [
      {
        "name": "durationSum",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The total time user spent sedentary during the interval.",
        "enum": null
      }
    ]
  },
  "SensorData": {
    "id": "SensorData",
    "source": "v4beta",
    "description": "Individual sensor reading and metadata.",
    "fields": [
      {
        "name": "temperatureCelsius",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The temperature reading in Celsius.",
        "enum": null
      },
      {
        "name": "metadata",
        "type": "SensorMetadata",
        "ref": "SensorMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Metadata for the sensor reading.",
        "enum": null
      }
    ]
  },
  "Serving": {
    "id": "Serving",
    "source": "v4",
    "description": "Represents different properties and information about the serving of a specific food.",
    "fields": [
      {
        "name": "foodMeasurementUnit",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Food measurement unit",
        "enum": null
      },
      {
        "name": "amount",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The number of servings.",
        "enum": null
      },
      {
        "name": "foodMeasurementUnitDisplayName",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Legacy measurement unit for serving size in singular form (e.g. \"piece\", \"gram\").",
        "enum": null
      }
    ]
  },
  "SessionTimeInterval": {
    "id": "SessionTimeInterval",
    "source": "v4",
    "description": "Represents a time interval of session data point, which bundles multiple observed metrics together.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The end time of the observed session.",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the end of the session relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The start time of the observed session.",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the start of the session relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "civilEndTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Session end time in civil time in the timezone the subject is in at the end of the session.",
        "enum": null
      },
      {
        "name": "civilStartTime",
        "type": "CivilDateTime",
        "ref": "CivilDateTime",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Session start time in civil time in the timezone the subject is in at the start of the session.",
        "enum": null
      }
    ]
  },
  "SkinTemperatureSensors": {
    "id": "SkinTemperatureSensors",
    "source": "v4beta",
    "description": "Skin temperature sensor data containing multi-sensor readings.",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The observation sample time.",
        "enum": null
      },
      {
        "name": "sensorData",
        "type": "array<SensorData>",
        "ref": null,
        "itemsRef": "SensorData",
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Repeated sensor data readings for this sample.",
        "enum": null
      }
    ]
  },
  "Sleep": {
    "id": "Sleep",
    "source": "v4",
    "description": "A sleep session possibly including stages.",
    "fields": [
      {
        "name": "interval",
        "type": "SessionTimeInterval",
        "ref": "SessionTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed sleep interval.",
        "enum": null
      },
      {
        "name": "createTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Creation time of this sleep observation.",
        "enum": null
      },
      {
        "name": "metadata",
        "type": "SleepMetadata",
        "ref": "SleepMetadata",
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Sleep metadata: `processed`, `main_sleep`, `manually_edited`, and `stages_status`.",
        "enum": null
      },
      {
        "name": "outOfBedSegments",
        "type": "array<OutOfBedSegment>",
        "ref": null,
        "itemsRef": "OutOfBedSegment",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. “Out of bed” segments that can overlap with sleep stages.",
        "enum": null
      },
      {
        "name": "shortAwakenings",
        "type": "array<SleepStage>",
        "ref": null,
        "itemsRef": "SleepStage",
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. List of short awake segments (under a set threshold) that are part of the sleep session. These can overlap with sleep stages.",
        "enum": null
      },
      {
        "name": "stages",
        "type": "array<SleepStage>",
        "ref": null,
        "itemsRef": "SleepStage",
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. List of non-overlapping contiguous sleep stage segments that cover the sleep period.",
        "enum": null
      },
      {
        "name": "summary",
        "type": "SleepSummary",
        "ref": "SleepSummary",
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Sleep summary: metrics and stages summary.",
        "enum": null
      },
      {
        "name": "type",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. SleepType: classic or stages.",
        "enum": [
          {"value":"SLEEP_TYPE_UNSPECIFIED","description":"Sleep type is unspecified."},
          {"value":"CLASSIC","description":"Classic sleep is a sleep with 3 stages types: AWAKE, RESTLESS and ASLEEP."},
          {
            "value": "STAGES",
            "description": "On top of \"classic\" sleep stages an additional processing pass can calculate stages more precisely, overwriting the prior stages with AWAKE, LIGHT, REM and DEEP."
          }
        ]
      },
      {
        "name": "updateTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Last update time of this sleep observation.",
        "enum": null
      }
    ]
  },
  "SleepMetadata": {
    "id": "SleepMetadata",
    "source": "v4",
    "description": "Additional information about how the sleep was processed.",
    "fields": [
      {
        "name": "externalId",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Sleep identifier relevant in the context of the data source.",
        "enum": null
      },
      {
        "name": "mainSleep",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. `main_sleep`: the longest sleep session with stages within one day. If no sleep session has stages, then the longest sleep is the `main_sleep`. If there are multiple days of sleep in the response, there is one `main_sleep` per day.",
        "enum": null
      },
      {
        "name": "manuallyEdited",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Some sleeps autodetected by algorithms can be manually edited by users.",
        "enum": null
      },
      {
        "name": "nap",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Naps are sleeps without stages and relatively short durations.",
        "enum": null
      },
      {
        "name": "processed",
        "type": "boolean",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Sleep and sleep stages algorithms finished processing. A `true` value indicates whether all data processing for the session is complete. A `false` value means sleep period is detected but sleep stages is still processing.",
        "enum": null
      },
      {
        "name": "stagesStatus",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Sleep stages algorithm processing status.",
        "enum": [
          {"value":"STAGES_STATE_UNSPECIFIED","description":"Output only. Sleep stages status is unspecified."},
          {"value":"REJECTED_COVERAGE","description":"Output only. Sleep stages cannot be computed due to low RR coverage."},
          {"value":"REJECTED_MAX_GAP","description":"Output only. Sleep stages cannot be computed due to the large middle gap (2h)."},
          {"value":"REJECTED_START_GAP","description":"Output only. Sleep stages cannot be computed due to the large start gap (1h)."},
          {"value":"REJECTED_END_GAP","description":"Output only. Sleep stages cannot be computed due to the large end gap (1h)."},
          {"value":"REJECTED_NAP","description":"Output only. Sleep stages cannot be computed because the sleep log is a nap (has < 3h duration)."},
          {"value":"REJECTED_SERVER","description":"Output only. Sleep stages cannot be computed because input data is not available (PPGV2, wake magnitude, etc)."},
          {"value":"TIMEOUT","description":"Output only. Sleep stages cannot be computed due to server timeout."},
          {"value":"SUCCEEDED","description":"Output only. Sleep stages successfully computed."},
          {"value":"PROCESSING_INTERNAL_ERROR","description":"Output only. Sleep stages cannot be computed due to server internal error."}
        ]
      }
    ]
  },
  "SleepStage": {
    "id": "SleepStage",
    "source": "v4",
    "description": "Sleep stage segment.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Sleep stage end time.",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the end of the sleep stage relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Sleep stage start time.",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The offset of the user's local time at the start of the sleep stage relative to the Coordinated Universal Time (UTC).",
        "enum": null
      },
      {
        "name": "type",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Sleep stage type: AWAKE, DEEP, REM, LIGHT etc.",
        "enum": [
          {"value":"SLEEP_STAGE_TYPE_UNSPECIFIED","description":"The default unset value."},
          {"value":"AWAKE","description":"Sleep stage AWAKE."},
          {"value":"LIGHT","description":"Sleep stage LIGHT."},
          {"value":"DEEP","description":"Sleep stage DEEP."},
          {"value":"REM","description":"Sleep stage REM."},
          {"value":"ASLEEP","description":"Sleep stage ASLEEP."},
          {"value":"RESTLESS","description":"Sleep stage RESTLESS."}
        ]
      },
      {
        "name": "createTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Creation time of this sleep stages segment.",
        "enum": null
      },
      {
        "name": "updateTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Last update time of this sleep stages segment.",
        "enum": null
      }
    ]
  },
  "SleepSummary": {
    "id": "SleepSummary",
    "source": "v4",
    "description": " Sleep summary: metrics and stages summary.",
    "fields": [
      {
        "name": "minutesAfterWakeUp",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Minutes after wake up calculated by restlessness algorithm.",
        "enum": null
      },
      {
        "name": "minutesAsleep",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Total number of minutes asleep. For classic sleep it is the sum of ASLEEP stages (excluding AWAKE and RESTLESS). For \"stages\" sleep it is the sum of LIGHT, REM and DEEP stages (excluding AWAKE).",
        "enum": null
      },
      {
        "name": "minutesAwake",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Total number of minutes awake. It is a sum of all AWAKE stages.",
        "enum": null
      },
      {
        "name": "minutesInSleepPeriod",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Delta between wake time and bedtime. It is the sum of all stages.",
        "enum": null
      },
      {
        "name": "minutesToFallAsleep",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Minutes to fall asleep calculated by restlessness algorithm.",
        "enum": null
      },
      {
        "name": "stagesSummary",
        "type": "array<StageSummary>",
        "ref": null,
        "itemsRef": "StageSummary",
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. List of summaries (total duration and segment count) per each sleep stage type.",
        "enum": null
      }
    ]
  },
  "SplitSummary": {
    "id": "SplitSummary",
    "source": "v4",
    "description": "Represents splits or laps recorded within an exercise. Lap events partition a workout into segments based on criteria like distance, time, or calories.",
    "fields": [
      {
        "name": "endTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Lap end time",
        "enum": null
      },
      {
        "name": "endUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Lap end time offset from UTC",
        "enum": null
      },
      {
        "name": "metricsSummary",
        "type": "MetricsSummary",
        "ref": "MetricsSummary",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Summary metrics for this split.",
        "enum": null
      },
      {
        "name": "splitType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Method used to split the exercise laps. Users may manually mark the lap as complete even if the tracking is automatic.",
        "enum": [
          {"value":"SPLIT_TYPE_UNSPECIFIED","description":"Split type is unspecified."},
          {"value":"MANUAL","description":"Manual split."},
          {"value":"DURATION","description":"Split by duration."},
          {"value":"DISTANCE","description":"Split by distance."},
          {"value":"CALORIES","description":"Split by calories."}
        ]
      },
      {
        "name": "startTime",
        "type": "string/google-datetime",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Lap start time",
        "enum": null
      },
      {
        "name": "startUtcOffset",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Lap start time offset from UTC",
        "enum": null
      },
      {
        "name": "activeDuration",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": "Output only",
        "required": false,
        "readOnly": true,
        "description": "Output only. Lap time excluding the pauses.",
        "enum": null
      }
    ]
  },
  "Steps": {
    "id": "Steps",
    "source": "v4",
    "description": "Step count over the time interval.",
    "fields": [
      {
        "name": "count",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Number of steps in the recorded interval. Must be in the range `[0, 1000000]`.",
        "enum": null
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "StepsRollupValue": {
    "id": "StepsRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the steps data type.",
    "fields": [
      {
        "name": "countSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Total number of steps in the interval.",
        "enum": null
      }
    ]
  },
  "SwimLengthsData": {
    "id": "SwimLengthsData",
    "source": "v4",
    "description": "Swim lengths data over the time interval.",
    "fields": [
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      },
      {
        "name": "strokeCount",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Number of strokes in the lap.",
        "enum": null
      },
      {
        "name": "swimStrokeType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Swim stroke type.",
        "enum": [
          {"value":"SWIM_STROKE_TYPE_UNSPECIFIED","description":"Swim stroke type is unspecified."},
          {"value":"FREESTYLE","description":"Freestyle swim stroke type."},
          {"value":"BACKSTROKE","description":"Backstroke swim stroke type."},
          {"value":"BREASTSTROKE","description":"Breaststroke swim stroke type."},
          {"value":"BUTTERFLY","description":"Butterfly swim stroke type."}
        ]
      }
    ]
  },
  "SwimLengthsDataRollupValue": {
    "id": "SwimLengthsDataRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the swim lengths data type.",
    "fields": [
      {
        "name": "strokeCountSum",
        "type": "string/int64",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Total number of swim strokes in the interval.",
        "enum": null
      }
    ]
  },
  "Symptoms": {
    "id": "Symptoms",
    "source": "v4",
    "description": "Symptoms logged by the user.",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Time when the symptoms were logged.",
        "enum": null
      },
      {
        "name": "symptoms",
        "type": "array<string>",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. List of symptoms experienced.",
        "enum": [
          {"value":"SYMPTOM_VALUE_UNSPECIFIED","description":"Unspecified symptom value."},
          {"value":"CRAMPS","description":"Abdominal cramps."},
          {"value":"HEADACHE","description":"Headache."},
          {"value":"TENDER_BREASTS","description":"Tender breasts."},
          {"value":"ACNE","description":"Acne."},
          {"value":"SICK","description":"Feeling sick or unwell."},
          {"value":"BLOATED","description":"Bloating or abdominal swelling."},
          {"value":"HOT_FLASHES","description":"Hot flashes."},
          {"value":"PMS","description":"Premenstrual syndrome symptoms."},
          {"value":"COUGH","description":"Coughing."},
          {"value":"FEVER","description":"Fever or elevated body temperature."},
          {"value":"DIFFICULTY_BREATHING","description":"Difficulty breathing or shortness of breath."},
          {"value":"BACK_PAIN","description":"Back pain."},
          {"value":"SHAKINESS","description":"Shakiness or tremors."},
          {"value":"HUNGER","description":"Excessive hunger."},
          {"value":"SWEATING","description":"Excessive sweating."},
          {"value":"ANXIETY","description":"Anxiety or nervousness."},
          {"value":"THIRST","description":"Excessive thirst."},
          {"value":"FREQUENT_URINATION","description":"Frequent urination."},
          {"value":"BLURRED_VISION","description":"Blurred vision."},
          {"value":"OTHER","description":"Other symptoms."},
          {"value":"SEX_DRIVE_HIGH","description":"High sex drive."},
          {"value":"SEX_DRIVE_MEDIUM","description":"Medium sex drive."},
          {"value":"SEX_DRIVE_LOW","description":"Low sex drive."},
          {"value":"HEART_PALPITATIONS","description":"Heart palpitations or racing heart."},
          {"value":"FAINTING","description":"Fainting or loss of consciousness."},
          {"value":"CHEST_PAIN","description":"Chest pain or discomfort."},
          {"value":"FATIGUE","description":"Fatigue or extreme tiredness."},
          {"value":"CONFUSION","description":"Confusion or mental fogginess."},
          {"value":"DIZZINESS","description":"Dizziness or lightheadedness."},
          {"value":"ABDOMINAL_PAIN","description":"Abdominal pain."},
          {"value":"BLADDER_LEAKS","description":"Bladder leaks."},
          {"value":"BLEEDING_GUMS","description":"Bleeding gums."},
          {"value":"BRAIN_FOG","description":"Brain fog."},
          {"value":"BURNING_MOUTH","description":"Burning mouth."},
          {"value":"CONSTIPATION","description":"Constipation."},
          {"value":"CRAVINGS","description":"Food cravings."},
          {"value":"DECREASED_APPETITE","description":"Decreased appetite."},
          {"value":"DIARRHEA","description":"Diarrhea."},
          {"value":"DRAWING_PAIN","description":"Drawing pain."},
          {"value":"DRY_EYES","description":"Dry eyes."},
          {"value":"DRY_HAIR","description":"Dry hair."},
          {"value":"DRY_SKIN","description":"Dry skin."},
          {"value":"EXHAUSTION","description":"Exhaustion."},
          {"value":"FEEL_GOOD","description":"Feeling good or well."},
          {"value":"FOOD_AVERSIONS","description":"Food aversions."},
          {"value":"HAIR_LOSS","description":"Hair loss."},
          {"value":"HEARTBURN","description":"Heartburn."},
          {"value":"HYPERPIGMENTATION","description":"Hyperpigmentation."},
          {"value":"INCREASED_APPETITE","description":"Increased appetite."},
          {"value":"INCREASED_APPETITE_V2","description":"Increased appetite V2."},
          {"value":"INSOMNIA","description":"Insomnia or difficulty sleeping."},
          {"value":"JOINT_PAIN","description":"Joint pain."},
          {"value":"LEG_CRAMPS","description":"Leg cramps."},
          {"value":"MILKY_NIPPLE_DISCHARGE","description":"Milky nipple discharge."},
          {"value":"NAUSEA","description":"Nausea."},
          {"value":"NIGHT_SWEATS","description":"Night sweats."},
          {"value":"NORMAL_DIGESTION","description":"Normal digestion."},
          {"value":"NORMAL_STOOL","description":"Normal stool."},
          {"value":"PERINEUM_PAIN","description":"Perineum pain."},
          {"value":"SLEEPINESS","description":"Sleepiness or drowsiness."},
          {"value":"STRETCH_MARKS","description":"Stretch marks."},
          {"value":"SWELLING","description":"Swelling."},
          {"value":"VAGINAL_DRYNESS","description":"Vaginal dryness."},
          {"value":"VAGINAL_ITCHING","description":"Vaginal itching."},
          {"value":"VOMITING","description":"Vomiting."}
        ]
      }
    ]
  },
  "TimeInHeartRateZone": {
    "id": "TimeInHeartRateZone",
    "source": "v4",
    "description": "Time in heart rate zone record. It's an interval spent in specific heart rate zone.",
    "fields": [
      {
        "name": "heartRateZoneType",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Heart rate zone type.",
        "enum": [
          {"value":"HEART_RATE_ZONE_TYPE_UNSPECIFIED","description":"Unspecified heart rate zone."},
          {"value":"LIGHT","description":"The light heart rate zone."},
          {"value":"MODERATE","description":"The moderate heart rate zone."},
          {"value":"VIGOROUS","description":"The vigorous heart rate zone."},
          {"value":"PEAK","description":"The peak heart rate zone."}
        ]
      },
      {
        "name": "interval",
        "type": "ObservationTimeInterval",
        "ref": "ObservationTimeInterval",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Observed interval.",
        "enum": null
      }
    ]
  },
  "TimeInHeartRateZoneRollupValue": {
    "id": "TimeInHeartRateZoneRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the time in heart rate zone data type.",
    "fields": [
      {
        "name": "timeInHeartRateZones",
        "type": "array<TimeInHeartRateZoneValue>",
        "ref": null,
        "itemsRef": "TimeInHeartRateZoneValue",
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "List of time spent in each heart rate zone.",
        "enum": null
      }
    ]
  },
  "TimeInHeartRateZoneValue": {
    "id": "TimeInHeartRateZoneValue",
    "source": "v4",
    "description": "Represents the total time spent in a specific heart rate zone.",
    "fields": [
      {
        "name": "duration",
        "type": "string/google-duration",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The total time spent in the specified heart rate zone.",
        "enum": null
      },
      {
        "name": "heartRateZone",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "The heart rate zone.",
        "enum": [
          {"value":"HEART_RATE_ZONE_TYPE_UNSPECIFIED","description":"Unspecified heart rate zone."},
          {"value":"LIGHT","description":"The light heart rate zone."},
          {"value":"MODERATE","description":"The moderate heart rate zone."},
          {"value":"VIGOROUS","description":"The vigorous heart rate zone."},
          {"value":"PEAK","description":"The peak heart rate zone."}
        ]
      }
    ]
  },
  "TotalCaloriesRollupValue": {
    "id": "TotalCaloriesRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the user's total calories. Note: Queries for the `total-calories` data type must include a time interval filter (such as `total_calories.interval.start_time` or `total_calories.interval.civil_start_time`). The maximum range is 14 days. Example filter query: `total_calories.interval.start_time >= \"2026-04-20T00:00:00Z\" AND total_calories.interval.start_time < \"2026-04-21T00:00:00Z\"`",
    "fields": [
      {
        "name": "kcalSum",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Sum of the total calories in kilocalories.",
        "enum": null
      }
    ]
  },
  "VO2Max": {
    "id": "VO2Max",
    "source": "v4",
    "description": "VO2 max measurement.",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which VO2 max was measured.",
        "enum": null
      },
      {
        "name": "vo2Max",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. VO2 max value measured as in ml consumed oxygen / kg of body weight / min. Must be in the range `[0, 100]`.",
        "enum": null
      },
      {
        "name": "measurementMethod",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The method used to measure the VO2 max value.",
        "enum": [
          {"value":"MEASUREMENT_METHOD_UNSPECIFIED","description":"Unspecified measurement method."},
          {"value":"FITBIT_RUN","description":"Fitbit specific, measures VO2 max rate during a run."},
          {"value":"GOOGLE_DEMOGRAPHIC","description":"Google specific, measures VO2 max rate for a user based on their demographic data."},
          {"value":"COOPER_TEST","description":"Run as far as possible for 12 minutes. Distance correlated with age and gender translates to a VO2 max value."},
          {"value":"HEART_RATE_RATIO","description":"Maximum heart rate divided by the resting heart rate, with a multiplier applied. Does not require any exercise."},
          {"value":"METABOLIC_CART","description":"Measured by a medical device called metabolic cart."},
          {"value":"MULTISTAGE_FITNESS_TEST","description":"Continuous 20m back-and-forth runs with increasing difficulty, until exhaustion."},
          {"value":"ROCKPORT_FITNESS_TEST","description":"Measured using walking exercise."},
          {
            "value": "MAX_EXERCISE",
            "description": "Healthkit specific, measures VO2 max rate by monitoring exercise to the user’s physical limit. Similar to COOPER_TEST or MULTISTAGE_FITNESS_TEST."
          },
          {
            "value": "PREDICTION_SUB_MAX_EXERCISE",
            "description": "Healthkit specific, estimates VO2 max rate based on low-intensity exercise. Similar to ROCKPORT_FITNESS_TEST."
          },
          {"value":"PREDICTION_NON_EXERCISE","description":"Healthkit specific, estimates VO2 max rate without any exercise. Similar to HEART_RATE_RATIO."},
          {"value":"OTHER","description":"Use when the method is not covered in this enum."}
        ]
      }
    ]
  },
  "VolumeQuantity": {
    "id": "VolumeQuantity",
    "source": "v4",
    "description": "Represents the volume quantity.",
    "fields": [
      {
        "name": "milliliters",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Value representing the volume in milliliters. Must be in the range `[0, 100000]`.",
        "enum": null
      },
      {
        "name": "userProvidedUnit",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the user provided unit, used only for user-facing input and display purposes. In the API format, all volume quantities are converted to milliliters.",
        "enum": [
          {"value":"VOLUME_UNIT_UNSPECIFIED","description":"Unspecified volume unit."},
          {"value":"CUP_IMPERIAL","description":"Cup (imperial)"},
          {"value":"CUP_US","description":"Cup (US)"},
          {"value":"FLUID_OUNCE_IMPERIAL","description":"Fluid ounce (imperial)"},
          {"value":"FLUID_OUNCE_US","description":"Fluid ounce (US)"},
          {"value":"LITER","description":"Liter"},
          {"value":"MILLILITER","description":"Milliliter"},
          {"value":"PINT_IMPERIAL","description":"Pint (imperial)"},
          {"value":"PINT_US","description":"Pint (US)"}
        ]
      }
    ]
  },
  "VolumeQuantityRollup": {
    "id": "VolumeQuantityRollup",
    "source": "v4",
    "description": "Rollup for volume quantity.",
    "fields": [
      {
        "name": "millilitersSum",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The sum of volume in milliliters.",
        "enum": null
      },
      {
        "name": "userProvidedUnitLast",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The user provided unit on the last element.",
        "enum": [
          {"value":"VOLUME_UNIT_UNSPECIFIED","description":"Unspecified volume unit."},
          {"value":"CUP_IMPERIAL","description":"Cup (imperial)"},
          {"value":"CUP_US","description":"Cup (US)"},
          {"value":"FLUID_OUNCE_IMPERIAL","description":"Fluid ounce (imperial)"},
          {"value":"FLUID_OUNCE_US","description":"Fluid ounce (US)"},
          {"value":"LITER","description":"Liter"},
          {"value":"MILLILITER","description":"Milliliter"},
          {"value":"PINT_IMPERIAL","description":"Pint (imperial)"},
          {"value":"PINT_US","description":"Pint (US)"}
        ]
      }
    ]
  },
  "Weight": {
    "id": "Weight",
    "source": "v4",
    "description": "Body weight measurement.",
    "fields": [
      {
        "name": "sampleTime",
        "type": "ObservationSampleTime",
        "ref": "ObservationSampleTime",
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The time at which the weight was measured",
        "enum": null
      },
      {
        "name": "weightGrams",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. Weight of a user in grams. Must be in the range `[0, 1000000]`.",
        "enum": null
      },
      {
        "name": "notes",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Standard free-form notes captured at manual logging.",
        "enum": null
      }
    ]
  },
  "WeightQuantity": {
    "id": "WeightQuantity",
    "source": "v4",
    "description": "Represents the weight quantity.",
    "fields": [
      {
        "name": "grams",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The weight value in grams. Must be in the range `[0, 100000]`.",
        "enum": null
      },
      {
        "name": "userProvidedUnit",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. Value representing the user provided unit.",
        "enum": [
          {"value":"WEIGHT_UNIT_UNSPECIFIED","description":"Unspecified weight unit."},
          {"value":"GRAM","description":"Value representing gram."},
          {"value":"KILOGRAM","description":"Value representing kilogram."},
          {"value":"OUNCE","description":"Value representing ounce."},
          {"value":"POUND","description":"Value representing pound."},
          {"value":"STONE","description":"Value representing stone."},
          {"value":"MILLIGRAM","description":"Value representing milligram."},
          {"value":"MICROGRAM","description":"Value representing microgram."},
          {"value":"NANOGRAM","description":"Value representing nanogram."}
        ]
      }
    ]
  },
  "WeightQuantityRollup": {
    "id": "WeightQuantityRollup",
    "source": "v4",
    "description": "Rollup for the weight.",
    "fields": [
      {
        "name": "gramsSum",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": "Required",
        "required": true,
        "readOnly": false,
        "description": "Required. The sum of the weight in grams.",
        "enum": null
      },
      {
        "name": "userProvidedUnitLast",
        "type": "string",
        "ref": null,
        "itemsRef": null,
        "label": "Optional",
        "required": false,
        "readOnly": false,
        "description": "Optional. The user provided unit on the last element.",
        "enum": [
          {"value":"WEIGHT_UNIT_UNSPECIFIED","description":"Unspecified weight unit."},
          {"value":"GRAM","description":"Value representing gram."},
          {"value":"KILOGRAM","description":"Value representing kilogram."},
          {"value":"OUNCE","description":"Value representing ounce."},
          {"value":"POUND","description":"Value representing pound."},
          {"value":"STONE","description":"Value representing stone."},
          {"value":"MILLIGRAM","description":"Value representing milligram."},
          {"value":"MICROGRAM","description":"Value representing microgram."},
          {"value":"NANOGRAM","description":"Value representing nanogram."}
        ]
      }
    ]
  },
  "WeightRollupValue": {
    "id": "WeightRollupValue",
    "source": "v4",
    "description": "Represents the result of the rollup of the weight data type.",
    "fields": [
      {
        "name": "weightGramsAvg",
        "type": "number/double",
        "ref": null,
        "itemsRef": null,
        "label": null,
        "required": false,
        "readOnly": false,
        "description": "Average weight in grams.",
        "enum": null
      }
    ]
  }
};

/** Google's Fitbit Web API scope → Google Health API scope table. */
export const GHAPI_SCOPE_MAPPING: { fitbitScope: string; googleScopes: string[]; googleScopeUrls: string[] }[] = [
  {
    "fitbitScope": "activity",
    "googleScopes": [".activity_and_fitness.readonly",".activity_and_fitness.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly","https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly"]
  },
  {
    "fitbitScope": "blood_glucose",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  },
  {
    "fitbitScope": "cardio_fitness",
    "googleScopes": [".activity_and_fitness.readonly",".activity_and_fitness.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly","https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly"]
  },
  {"fitbitScope":"electrocardiogram","googleScopes":[".ecg.readonly"],"googleScopeUrls":["https://www.googleapis.com/auth/googlehealth.ecg.readonly"]},
  {
    "fitbitScope": "heartrate",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  },
  {
    "fitbitScope": "irregular_rhythm_notifications",
    "googleScopes": [".irn.readonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.irn.readonly"]
  },
  {"fitbitScope":"location","googleScopes":[".location.readonly"],"googleScopeUrls":["https://www.googleapis.com/auth/googlehealth.location.readonly"]},
  {
    "fitbitScope": "nutrition",
    "googleScopes": [".nutrition.readonly",".nutrition.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.nutrition.readonly","https://www.googleapis.com/auth/googlehealth.nutrition.writeonly"]
  },
  {
    "fitbitScope": "oxygen_saturation",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  },
  {
    "fitbitScope": "profile",
    "googleScopes": [".profile.readonly",".profile.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.profile.readonly","https://www.googleapis.com/auth/googlehealth.profile.writeonly"]
  },
  {
    "fitbitScope": "respiratory_rate",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  },
  {
    "fitbitScope": "settings",
    "googleScopes": [".settings.readonly",".settings.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.settings.readonly","https://www.googleapis.com/auth/googlehealth.settings.writeonly"]
  },
  {
    "fitbitScope": "sleep",
    "googleScopes": [".sleep.readonly",".sleep.writeonly"],
    "googleScopeUrls": ["https://www.googleapis.com/auth/googlehealth.sleep.readonly","https://www.googleapis.com/auth/googlehealth.sleep.writeonly"]
  },
  {
    "fitbitScope": "temperature",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  },
  {
    "fitbitScope": "weight",
    "googleScopes": [".health_metrics_and_measurements.readonly",".health_metrics_and_measurements.writeonly"],
    "googleScopeUrls": [
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly",
      "https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly"
    ]
  }
];

/** Google's Fitbit Web API data type → Google Health API dataType table. */
export const GHAPI_DATA_TYPE_MAPPING: { fitbitDataType: string; googleName: string; googleDataType: string; description: string | null; referenceUrl: string | null }[] = [
  {
    "fitbitDataType": "Activity Calories",
    "googleName": "Active Energy Burned",
    "googleDataType": "active-energy-burned",
    "description": "Represents the calories burned during active periods, inclusive of BMR for those periods. In the Google Health API, this can be reconstructed by adding BMR to the `active-energy-burned` data type (which tracks activity-only burn, excluding basal rate).",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activeenergyburned"
  },
  {
    "fitbitDataType": "Active Zone Minutes",
    "googleName": "Active Zone Minutes",
    "googleDataType": "active-zone-minutes",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activezoneminutes"
  },
  {
    "fitbitDataType": "Contains changes to the user's activity levels",
    "googleName": "Activity Level",
    "googleDataType": "activity-level",
    "description": "Captures the user's activity level (such as sedentary or active) over a specific period of time.",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#activitylevel"
  },
  {
    "fitbitDataType": "Elevation",
    "googleName": "Altitude",
    "googleDataType": "altitude",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#altitude"
  },
  {
    "fitbitDataType": "Activity `caloriesBMR`",
    "googleName": "Basal Energy Burned",
    "googleDataType": "basal-energy-burned",
    "description": "The calories burned due to Basal Metabolic Rate (BMR) over a specific period of time.",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#basalenergyburned"
  },
  {
    "fitbitDataType": "Blood Glucose",
    "googleName": "Blood Glucose",
    "googleDataType": "blood-glucose",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#bloodglucose"
  },
  {
    "fitbitDataType": "Body fat",
    "googleName": "Body Fat",
    "googleDataType": "body-fat",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#bodyfat"
  },
  {
    "fitbitDataType": "`caloriesOut` in each heart rate zone",
    "googleName": "Calories In Heart Rate Zone",
    "googleDataType": "calories-in-heart-rate-zone",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#caloriesinheartratezone"
  },
  {
    "fitbitDataType": "Temperature (Core)",
    "googleName": "Core Body Temperature",
    "googleDataType": "core-body-temperature",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#corebodytemperature"
  },
  {
    "fitbitDataType": "HRV summary",
    "googleName": "Daily Heart Rate Variability",
    "googleDataType": "daily-heart-rate-variability",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyheartratevariability"
  },
  {
    "fitbitDataType": "SpO2 summary",
    "googleName": "Daily Oxygen Saturation",
    "googleDataType": "daily-oxygen-saturation",
    "description": "A daily summary of blood oxygen saturation (SpO2) statistics calculated from validated sleep measurements.",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyoxygensaturation"
  },
  {
    "fitbitDataType": "Resting heart rate",
    "googleName": "Daily Resting Heart Rate",
    "googleDataType": "daily-resting-heart-rate",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailyrestingheartrate"
  },
  {
    "fitbitDataType": "Skin temperature",
    "googleName": "Daily Sleep Temperature Derivations",
    "googleDataType": "daily-sleep-temperature-derivations",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#dailysleeptemperaturederivations"
  },
  {
    "fitbitDataType": "Distance",
    "googleName": "Distance",
    "googleDataType": "distance",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#distance"
  },
  {
    "fitbitDataType": "Electrocardiogram (ECG)",
    "googleName": "Electrocardiogram (ECG)",
    "googleDataType": "electrocardiogram",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#electrocardiogram"
  },
  {
    "fitbitDataType": "Recorded activity",
    "googleName": "Exercise",
    "googleDataType": "exercise",
    "description": "Recorded workouts or exercise sessions, which include start/end times, activity types, and session metrics.",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#exercise"
  },
  {
    "fitbitDataType": "Floors",
    "googleName": "Floors",
    "googleDataType": "floors",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#floors"
  },
  {
    "fitbitDataType": "Food",
    "googleName": "Food",
    "googleDataType": "food",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#food"
  },
  {
    "fitbitDataType": "Food Measurement Unit",
    "googleName": "Food Measurement Unit",
    "googleDataType": "food-measurement-unit",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#foodmeasurementunit"
  },
  {
    "fitbitDataType": "Heart Rate",
    "googleName": "Heart Rate",
    "googleDataType": "heart-rate",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#heartrate"
  },
  {
    "fitbitDataType": "HRV Intraday",
    "googleName": "Heart Rate Variability",
    "googleDataType": "heart-rate-variability",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#heartratevariability"
  },
  {
    "fitbitDataType": "Irregular Rhythm Notifications (IRN)",
    "googleName": "Irregular Rhythm Notification",
    "googleDataType": "irregular-rhythm-notification",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#irregularrhythmnotification"
  },
  {
    "fitbitDataType": "Food Log",
    "googleName": "Nutrition Log",
    "googleDataType": "nutrition-log",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#nutritionlog"
  },
  {
    "fitbitDataType": "SpO2 Intraday",
    "googleName": "Oxygen Saturation",
    "googleDataType": "oxygen-saturation",
    "description": "Returns only validated minute-level SpO2 measurements and excludes readings flagged as invalid due to motion artifacts or low sensor confidence. Because the Fitbit Web API only excluded the 50% sentinel value, the Google Health API returns fewer data points for the same time range. For details, see Oxygen saturation filtering.",
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#oxygensaturation"
  },
  {
    "fitbitDataType": "VO2 Max value when the user runs",
    "googleName": "Run VO2 Max",
    "googleDataType": "run-vo2-max",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#runvo2max"
  },
  {
    "fitbitDataType": "Activity time series minutes sedentary",
    "googleName": "Sedentary Period",
    "googleDataType": "sedentary-period",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#sedentaryperiod"
  },
  {
    "fitbitDataType": "Sleep",
    "googleName": "Sleep",
    "googleDataType": "sleep",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#sleep"
  },
  {
    "fitbitDataType": "Steps",
    "googleName": "Steps",
    "googleDataType": "steps",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#steps"
  },
  {
    "fitbitDataType": "Activity time series swimming strokes",
    "googleName": "Swim Lengths Data",
    "googleDataType": "swim-lengths-data",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#swimlengthsdata"
  },
  {
    "fitbitDataType": "Activity `caloriesOut`",
    "googleName": "Total Calories",
    "googleDataType": "total-calories",
    "description": "The complete number of calories burned by a user over a period of time, inclusive of basal metabolic rate and active energy burned.",
    "referenceUrl": null
  },
  {
    "fitbitDataType": "VO2 Max value",
    "googleName": "VO2 Max",
    "googleDataType": "vo2-max",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#vo2max"
  },
  {
    "fitbitDataType": "Weight",
    "googleName": "Weight",
    "googleDataType": "weight",
    "description": null,
    "referenceUrl": "https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints#weight"
  }
];

/** Google's Fitbit Web API endpoint type → Google Health API method table. */
export const GHAPI_ENDPOINT_MAPPING: { fitbitEndpointType: string; googleHealthApi: string }[] = [
  {
    "fitbitEndpointType": "GET (Log | Summary | Daily Summary) where you are requesting a single day of data",
    "googleHealthApi": "`dailyRollup` method with `windowSize` = 1 day"
  },
  {"fitbitEndpointType":"GET (Intraday) where you are requesting granular data","googleHealthApi":"`list` method"},
  {"fitbitEndpointType":"GET (Time Series) by Date or Interval","googleHealthApi":"`rollUp` or `dailyRollUp` method including a date range"},
  {"fitbitEndpointType":"GET (Log List)","googleHealthApi":"`list` method"},
  {"fitbitEndpointType":"CREATE & UPDATE Logs","googleHealthApi":"`patch` method"},
  {"fitbitEndpointType":"DELETE Logs","googleHealthApi":"`batchDelete` method"},
  {
    "fitbitEndpointType": "GET Profile",
    "googleHealthApi": "`users.getProfile` returns the user's specific information\n`users.getSettings` returns the user's units and timezones"
  },
  {
    "fitbitEndpointType": "UPDATE Profile",
    "googleHealthApi": "`users.updateProfile` modifies the user's specific information\n`users.updateSettings` modifies the user's units and timezones"
  },
  {"fitbitEndpointType":"Get User ID","googleHealthApi":"`users.getIdentity` returns the user's Fitbit legacy and Google user ID."},
  {"fitbitEndpointType":"Get Devices","googleHealthApi":"`users.pairedDevices` returns the list of paired devices"},
  {"fitbitEndpointType":"Create Subscriptions","googleHealthApi":"`projects.subscribers.subscriptions.create` manually creates a subscription"},
  {"fitbitEndpointType":"Delete Subscriptions","googleHealthApi":"`projects.subscribers.subscriptions.delete` delete a subscription"},
  {"fitbitEndpointType":"Get Subscriptions List","googleHealthApi":"`projects.subscribers.subscriptions.list` lists all subscriptions"}
];

/** The About page's turn-down timeline. */
export const GHAPI_TIMELINE: { date: string; dateText: string; label: string; text: string; item: string }[] = [
  {
    "date": "2026-09-30",
    "dateText": "September 30, 2026",
    "label": "End of support",
    "text": "Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support.",
    "item": "September 30, 2026 (End of support): Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support."
  },
  {
    "date": "2026-11-02",
    "dateText": "November 2, 2026",
    "label": "API turn-off",
    "text": "The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP `410 Gone` status code.",
    "item": "November 2, 2026 (API turn-off): The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP `410 Gone` status code."
  }
];

/** The rate-limits table, verbatim. */
export const GHAPI_RATE_LIMITS: { metric: string; defaultLimit: string; qpsImpact: string }[] = [
  {"metric":"Per project (daily)","defaultLimit":"86.4M requests / day","qpsImpact":"~1,000 QPS sustained"},
  {"metric":"Per project (minutely)","defaultLimit":"120,000 requests / minute","qpsImpact":"~2,000 QPS burst"},
  {
    "metric": "Per user (minutely)",
    "defaultLimit": "300 requests / minute",
    "qpsImpact": "Standard: 5 QPS per user\nUnverified applications: Max 250 QPS total (capped at 100 users @ 2.5 QPS per user)"
  }
];

/** The v4 error catalog, verbatim. */
export const GHAPI_ERRORS: { reason: string; httpStatus: number; description: string }[] = [
  {"reason":"ACCOUNT_NOT_LINKED","httpStatus":400,"description":"The Google account is not linked to a Fitbit account."},
  {"reason":"INVALID_PARENT_DATA_TYPE_COLLECTION_FORMAT","httpStatus":400,"description":"Invalid {field} format. Expected: {expectedFormat}; Got: {actualValue}."},
  {
    "reason": "INVALID_PARENT_DATA_TYPE_COLLECTION",
    "httpStatus": 400,
    "description": "Invalid data type ID referenced in the parent data type collection: {dataType}."
  },
  {"reason":"INVALID_FILTER_FORMAT","httpStatus":400,"description":"Invalid filter format."},
  {"reason":"INVALID_DATA_POINT_DATA_SOURCE_FAMILY","httpStatus":400,"description":"Invalid data source family in filter."},
  {"reason":"INVALID_DATA_POINT_FILTER","httpStatus":400,"description":"Invalid filter."},
  {"reason":"INVALID_DATA_POINT_FILTER_SYNTAX","httpStatus":400,"description":"Invalid filter syntax."},
  {"reason":"INVALID_DATA_POINT_FILTER_MISSING_TOKEN","httpStatus":400,"description":"Invalid filter: missing token."},
  {"reason":"INVALID_DATA_POINT_FILTER_UNEXPECTED_TOKEN","httpStatus":400,"description":"Invalid filter: unexpected token."},
  {"reason":"INVALID_DATA_POINT_FILTER_UNEXPECTED_END_OF_INPUT","httpStatus":400,"description":"Invalid filter: unexpected end of input."},
  {"reason":"INVALID_DATA_POINT_FILTER_EXPRESSION_STRUCTURE","httpStatus":400,"description":"Invalid filter expression structure."},
  {"reason":"INVALID_DATA_POINT_FILTER_RESTRICTION_COMPARABLE","httpStatus":400,"description":"Invalid filter restriction comparable."},
  {"reason":"INVALID_DATA_POINT_FILTER_DATA_TYPE_RESTRICTION","httpStatus":400,"description":"Invalid filter data type restriction."},
  {
    "reason": "INVALID_TIME_RANGE_INTERVAL_FORMAT",
    "httpStatus": 400,
    "description": "Civil time provided for a non-daily rollup request or physical time provided for a daily rollup request."
  },
  {"reason":"INVALID_TIME_RANGE","httpStatus":400,"description":"Query end time must be strictly larger than start time."},
  {
    "reason": "INVALID_ROLLUP_QUERY_DURATION",
    "httpStatus": 400,
    "description": "The duration covered by window_size_days * page_size must not exceed {maxDurationDays} days for {dataType}."
  },
  {"reason":"INVALID_ROLLUP_WINDOW","httpStatus":400,"description":"Rollup window size must be at least 1 second."},
  {"reason":"INVALID_DATA_POINT_FILTER_MIXED_DATA_TYPE_RESTRICTIONS","httpStatus":400,"description":"Filter cannot contain restrictions for multiple data types."},
  {"reason":"INVALID_DATA_POINT_FILTER_MIXED_TIME_RESTRICTIONS","httpStatus":400,"description":"Filter cannot contain both physical and civil time ranges."},
  {"reason":"INVALID_DATA_POINT_FILTER_DATA_TYPE_MEMBER","httpStatus":400,"description":"Invalid filter member for data type."},
  {"reason":"INVALID_DATA_POINT_FILTER_RESTRICTION_COMPARATOR","httpStatus":400,"description":"Invalid filter restriction comparator."},
  {"reason":"INVALID_DATA_POINT_FILTER_TIMESTAMP_FORMAT","httpStatus":400,"description":"Invalid filter timestamp format."},
  {"reason":"INVALID_DATA_POINT_FILTER_CIVIL_DATE_TIME_FORMAT","httpStatus":400,"description":"Invalid filter civil date time format."},
  {"reason":"INVALID_CIVIL_DATE_TIME","httpStatus":400,"description":"Invalid civil date time: {reason}."},
  {"reason":"INVALID_DATA_POINT_FILTER_RESTRICTION_ARGUMENT","httpStatus":400,"description":"Invalid filter restriction argument."},
  {"reason":"INVALID_DATA_POINT_FILTER_COLLECTION_MISMATCH","httpStatus":400,"description":"Data type in filter does not match parent data type collection."},
  {"reason":"INVALID_DATA_POINT_NAME","httpStatus":400,"description":"Invalid data point name."},
  {"reason":"DATA_POINT_NOT_OWNED_BY_CLIENT","httpStatus":400,"description":"Data point is not owned by the client."},
  {"reason":"MISSING_DATA_POINT_NAMES","httpStatus":400,"description":"Missing data point names."},
  {"reason":"MISSING_DATA_POINT_FILTER","httpStatus":400,"description":"Filter must be set for purge request."},
  {"reason":"DATA_TYPE_MISMATCH","httpStatus":400,"description":"The data point in the update request must have the same data type as the parent."},
  {"reason":"UPDATE_ONLY_UPSERT_SUPPORTED","httpStatus":400,"description":"Update only supports upsert. Please set allow_missing to true."},
  {"reason":"MISSING_DATA_POINT_ID","httpStatus":400,"description":"Missing data point ID for update."},
  {"reason":"MISSING_DATA_POINT_VALUE","httpStatus":400,"description":"Missing data point value."},
  {
    "reason": "INVALID_PROFILE_DATA",
    "httpStatus": 400,
    "description": "Invalid value provided for field {field}. Provided value: {providedValue}. Accepted values: {acceptedValues}."
  },
  {"reason":"INVALID_FIELD_MASK_DATA","httpStatus":400,"description":"Request contains invalid field mask data."},
  {"reason":"INVALID_PAGE_SIZE","httpStatus":400,"description":"Page size cannot be negative, but was {actualValue}."},
  {"reason":"INVALID_PAGE_TOKEN","httpStatus":400,"description":"Invalid page token."},
  {"reason":"MULTIPLE_DATA_TYPES_UNSUPPORTED","httpStatus":400,"description":"Multiple data types are not supported."},
  {"reason":"UNSUPPORTED_DATA_TYPE_ACTION","httpStatus":400,"description":"The action is not supported for the data type."},
  {"reason":"INVALID_DATA_TYPE","httpStatus":400,"description":"Invalid data type provided: {dataType}."},
  {"reason":"MISSING_SUBSCRIBER","httpStatus":400,"description":"Subscriber must be provided."},
  {"reason":"INVALID_SUBSCRIBER_NAME","httpStatus":400,"description":"Invalid subscriber name: {subscriberName}."},
  {"reason":"MISSING_SUBSCRIPTION","httpStatus":400,"description":"Subscription must be provided."},
  {"reason":"INVALID_SUBSCRIPTION_NAME","httpStatus":400,"description":"Invalid subscription name: {subscriptionName}."},
  {"reason":"MISSING_DATA_TYPES","httpStatus":400,"description":"Data types must be specified."},
  {
    "reason": "DATA_TYPES_CANNOT_BE_EMPTY",
    "httpStatus": 400,
    "description": "Data types cannot be empty. If you wish to stop receiving notifications, please use the DeleteSubscription API."
  },
  {"reason":"MISSING_USER","httpStatus":400,"description":"User field must be provided."},
  {"reason":"INVALID_USER_RESOURCE_NAME","httpStatus":400,"description":"Invalid user resource name: {userResourceName}."},
  {"reason":"INVALID_DATA_TYPE_FORMAT","httpStatus":400,"description":"Data type must be all lowercase: {dataType}."},
  {"reason":"INVALID_ARGUMENT","httpStatus":400,"description":"The request is invalid."},
  {"reason":"FAILED_PRECONDITION","httpStatus":400,"description":"The request cannot be completed in the current state."},
  {"reason":"UNAUTHENTICATED","httpStatus":401,"description":"The request is missing valid authentication credentials."},
  {"reason":"MISSING_OAUTH_SCOPE","httpStatus":403,"description":"Required OAuth scope(s) are missing for this operation."},
  {
    "reason": "DISALLOWED_OAUTH_SCOPES",
    "httpStatus": 403,
    "description": "Request contains disallowed OAuth scope(s): {disallowed_scopes}. Unrecognized scopes present: {unrecognized_scopes_present}."
  },
  {"reason":"API_PRIVATE_PREVIEW_ACCESS_DENIED","httpStatus":403,"description":"User is not eligible for the API Private Preview."},
  {"reason":"DATA_ACCESS_DENIED","httpStatus":403,"description":"Data can't be accessed."},
  {"reason":"RESOURCE_PERMISSION_DENIED","httpStatus":403,"description":"Permission denied for the requested resource."},
  {"reason":"RESOURCE_NOT_FOUND","httpStatus":404,"description":"The requested resource was not found."},
  {"reason":"SLEEP_ALREADY_EXISTS","httpStatus":409,"description":"A sleep log with an overlapping interval already exists."},
  {"reason":"ABORTED","httpStatus":409,"description":"The operation was aborted."},
  {"reason":"RESOURCE_EXHAUSTED","httpStatus":429,"description":"Quota exceeded or rate limited."},
  {"reason":"INTERNAL_ERROR","httpStatus":500,"description":"An internal error occurred."}
];

/** The error catalog's own introduction, verbatim. */
export const GHAPI_ERRORS_INTRO: GhapiBlock[] = [
  {
    "kind": "p",
    "text": "The following table lists HTTP status codes and associated errors that you might encounter when interacting with our API. Each status code corresponds to one or more reasons and descriptions to help you troubleshoot and handle errors effectively in your application. Within the descriptions, variables denoted by curly braces (`{}`) represent placeholders for values that are specific to your request."
  },
  {"kind":"note","variant":"note","text":"Note: This list contains some error messages related to its API, but is not a complete list of those messages."}
];

/** dataType ids the webhooks page lists as supported. */
export const GHAPI_WEBHOOK_TYPES: string[] = [
  "active-minutes",
  "active-zone-minutes",
  "activity-level",
  "altitude",
  "blood-glucose",
  "body-fat",
  "calories-in-heart-rate-zone",
  "daily-heart-rate-variability",
  "daily-heart-rate-zones",
  "daily-oxygen-saturation",
  "daily-respiratory-rate",
  "daily-resting-heart-rate",
  "daily-sleep-temperature-derivations",
  "distance",
  "exercise",
  "floors",
  "heart-rate",
  "heart-rate-variability",
  "height",
  "hydration-log",
  "nutrition-log",
  "respiratory-rate-sleep-summary",
  "run-vo2-max",
  "sedentary-period",
  "sleep",
  "steps",
  "time-in-heart-rate-zone",
  "weight"
];

/** The webhooks page's token vocabulary. */
export const GHAPI_WEBHOOK_TOKENS: { token: string; dataType: string; systemEvent: boolean; text: string }[] = [
  {"token":"WEBHOOK_DATA_TYPE_ACTIVE_MINUTES","dataType":"active-minutes","systemEvent":false,"text":"`active-minutes`"},
  {"token":"WEBHOOK_DATA_TYPE_ACTIVE_ZONE_MINUTES","dataType":"active-zone-minutes","systemEvent":false,"text":"`active-zone-minutes`"},
  {"token":"WEBHOOK_DATA_TYPE_ACTIVITY_LEVEL","dataType":"activity-level","systemEvent":false,"text":"`activity-level`"},
  {"token":"WEBHOOK_DATA_TYPE_ALTITUDE","dataType":"altitude","systemEvent":false,"text":"`altitude`"},
  {"token":"WEBHOOK_DATA_TYPE_BLOOD_GLUCOSE","dataType":"blood-glucose","systemEvent":false,"text":"`blood-glucose`"},
  {"token":"WEBHOOK_DATA_TYPE_BODY_FAT","dataType":"body-fat","systemEvent":false,"text":"`body-fat`"},
  {"token":"WEBHOOK_DATA_TYPE_CALORIES_IN_HEART_RATE_ZONE","dataType":"calories-in-heart-rate-zone","systemEvent":false,"text":"`calories-in-heart-rate-zone`"},
  {"token":"WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_VARIABILITY","dataType":"daily-heart-rate-variability","systemEvent":false,"text":"`daily-heart-rate-variability`"},
  {"token":"WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_ZONES","dataType":"daily-heart-rate-zones","systemEvent":false,"text":"`daily-heart-rate-zones`"},
  {"token":"WEBHOOK_DATA_TYPE_DAILY_OXYGEN_SATURATION","dataType":"daily-oxygen-saturation","systemEvent":false,"text":"`daily-oxygen-saturation`"},
  {"token":"WEBHOOK_DATA_TYPE_DAILY_RESPIRATORY_RATE","dataType":"daily-respiratory-rate","systemEvent":false,"text":"`daily-respiratory-rate`"},
  {"token":"WEBHOOK_DATA_TYPE_DAILY_RESTING_HEART_RATE","dataType":"daily-resting-heart-rate","systemEvent":false,"text":"`daily-resting-heart-rate`"},
  {
    "token": "WEBHOOK_DATA_TYPE_DAILY_SLEEP_TEMPERATURE_DERIVATIONS",
    "dataType": "daily-sleep-temperature-derivations",
    "systemEvent": false,
    "text": "`daily-sleep-temperature-derivations`"
  },
  {"token":"WEBHOOK_DATA_TYPE_DISTANCE","dataType":"distance","systemEvent":false,"text":"`distance`"},
  {"token":"WEBHOOK_DATA_TYPE_EXERCISE","dataType":"exercise","systemEvent":false,"text":"`exercise`"},
  {"token":"WEBHOOK_DATA_TYPE_FLOORS","dataType":"floors","systemEvent":false,"text":"`floors`"},
  {"token":"WEBHOOK_DATA_TYPE_HEART_RATE","dataType":"heart-rate","systemEvent":false,"text":"`heart-rate`"},
  {"token":"WEBHOOK_DATA_TYPE_HEART_RATE_VARIABILITY","dataType":"heart-rate-variability","systemEvent":false,"text":"`heart-rate-variability`"},
  {"token":"WEBHOOK_DATA_TYPE_HEIGHT","dataType":"height","systemEvent":false,"text":"`height`"},
  {"token":"WEBHOOK_DATA_TYPE_HYDRATION_LOG","dataType":"hydration-log","systemEvent":false,"text":"`hydration-log`"},
  {"token":"WEBHOOK_DATA_TYPE_NUTRITION_LOG","dataType":"nutrition-log","systemEvent":false,"text":"`nutrition-log`"},
  {
    "token": "WEBHOOK_DATA_TYPE_RESPIRATORY_RATE_SLEEP_SUMMARY",
    "dataType": "respiratory-rate-sleep-summary",
    "systemEvent": false,
    "text": "`respiratory-rate-sleep-summary`"
  },
  {"token":"WEBHOOK_DATA_TYPE_RUN_VO2_MAX","dataType":"run-vo2-max","systemEvent":false,"text":"`run-vo2-max`"},
  {"token":"WEBHOOK_DATA_TYPE_SEDENTARY_PERIOD","dataType":"sedentary-period","systemEvent":false,"text":"`sedentary-period`"},
  {"token":"WEBHOOK_DATA_TYPE_SLEEP","dataType":"sleep","systemEvent":false,"text":"`sleep`"},
  {"token":"WEBHOOK_DATA_TYPE_STEPS","dataType":"steps","systemEvent":false,"text":"`steps`"},
  {"token":"WEBHOOK_DATA_TYPE_TIME_IN_HEART_RATE_ZONE","dataType":"time-in-heart-rate-zone","systemEvent":false,"text":"`time-in-heart-rate-zone`"},
  {"token":"WEBHOOK_DATA_TYPE_WEIGHT","dataType":"weight","systemEvent":false,"text":"`weight`"},
  {"token":"WEBHOOK_DATA_TYPE_USER_DELETED","dataType":"user-deleted","systemEvent":true,"text":"`user-deleted` (system event)"},
  {"token":"WEBHOOK_DATA_TYPE_USER_REVOKED_ACCESS","dataType":"user-revoked-access","systemEvent":true,"text":"`user-revoked-access` (system event)"}
];

/** Dated release-note entries, newest first, as Google prints them. */
export const GHAPI_RELEASE_NOTES: { date: string; dateText: string; id: string | null; intro: GhapiBlock[]; sections: { heading: string | null; id: string | null; blocks: GhapiBlock[] }[] }[] = [
  {
    "date": "2026-10-14",
    "dateText": "October 14, 2026",
    "id": "october_14_2026",
    "intro": [],
    "sections": [
      {
        "heading": "Data source family filtering",
        "id": "data_source_family_filtering",
        "blocks": [
          {"kind":"p","text":"Updated data source family filtering with the following capabilities:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Added `dataSourceFamily` parameter support to the `users.dataTypes.dataPoints` `list` endpoint for all data types except `sleep`, `food`, and `food-measurement-unit`."
              },
              {
                "text": "Added the `users/me/dataSourceFamilies/self-sources` data source family to the `list`, `reconcile`, `rollUp`, and `dailyRollUp` endpoints so clients can query data points they wrote themselves, including when granted only `.writeonly` scopes."
              }
            ]
          }
        ]
      },
      {
        "heading": "Highlighted Documentation Updates",
        "id": "highlighted_documentation_updates",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Updated the Filter data guide with details and examples for using `dataSourceFamily` on the `list` endpoint, querying `self-sources` with write-only scopes, and handling data type limitations."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "date": "2026-10-01",
    "dateText": "October 1, 2026",
    "id": "october_1_2026",
    "intro": [],
    "sections": [
      {
        "heading": "New Beta Channel",
        "id": "new_beta_channel",
        "blocks": [
          {
            "kind": "p",
            "text": "Added `v4beta` channel to serve as a public preview for broad partner testing and market validation prior to promotion to the stable `v4` channel. API elements that are only available in `v4beta` will be tagged with v4beta in the documentation."
          },
          {"kind":"p","text":"See the reference documentation for more information."}
        ]
      },
      {
        "heading": "New Data Type",
        "id": "new_data_type",
        "blocks": [
          {"kind":"p","text":"Added support for the following data type:"},
          {"kind":"list","ordered":false,"items":[{"text":"Health Metrics & Measurements: `skin-temperature-sensors` v4beta"}]}
        ]
      },
      {
        "heading": "New API Guide",
        "id": "new_api_guide",
        "blocks": [{"kind":"p","text":"Added a new guide for Skin Temperature that details how to use data types related to skin temperature."}]
      }
    ]
  },
  {
    "date": "2026-08-17",
    "dateText": "August 17, 2026",
    "id": "august_17_2026",
    "intro": [],
    "sections": [
      {
        "heading": "New Scopes",
        "id": "new_scopes",
        "blocks": [
          {"kind":"p","text":"Added the following write-only scopes:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`.logged_symptoms.writeonly` for logging physical symptoms."},
              {"text":"`.mindfulness.writeonly` for logging emotional states and moods."},
              {"text":"`.reproductive_health.writeonly` for logging menstrual periods and ovulation test results."}
            ]
          }
        ]
      },
      {
        "heading": "New Data Types",
        "id": "new_data_types",
        "blocks": [
          {"kind":"p","text":"Added support for the following data types:"},
          {"kind":"list","ordered":false,"items":[{"text":"Women's Health: `menstrual-period`, `moods`, `ovulation-test`, `symptoms`"}]}
        ]
      },
      {
        "heading": "Highlighted Documentation Updates",
        "id": "highlighted_documentation_updates_2",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [{"text":"Added the Women's Health guide to help you integrate women's health and reproductive data into your applications."}]
          }
        ]
      }
    ]
  },
  {
    "date": "2026-08-14",
    "dateText": "August 14, 2026",
    "id": "august_14_2026",
    "intro": [],
    "sections": [
      {
        "heading": "Updated migration guidance",
        "id": "updated_migration_guidance",
        "blocks": [{"kind":"p","text":"We've updated the Migration Overview with more comprehensive guidance, and removed some outdated content."}]
      },
      {
        "heading": "New Promote Google Health page",
        "id": "new_promote_google_health_page",
        "blocks": [
          {
            "kind": "p",
            "text": "The new Promote Google Health page covers the recommended ways to showcase Google Health in your app, and how to encourage users to connect. It is also the new location for the Google Health brand guidelines."
          }
        ]
      }
    ]
  },
  {
    "date": "2026-06-22",
    "dateText": "June 22, 2026",
    "id": "june_22_2026",
    "intro": [],
    "sections": [
      {
        "heading": "Google Health Status Dashboard",
        "id": "google_health_status_dashboard",
        "blocks": [{"kind":"p","text":"Added the Google Health Status Dashboard to provide status information on the services that are part of the Google Health."}]
      }
    ]
  },
  {
    "date": "2026-06-17",
    "dateText": "June 17, 2026",
    "id": "june_17_2026",
    "intro": [],
    "sections": [
      {
        "heading": "Google Health API parity tool",
        "id": "google_health_api_parity_tool",
        "blocks": [
          {
            "kind": "p",
            "text": "Updated the Google Health API parity tool with additional scopes: `active-energy-burned`, `electrocardiogram`, `core-body-temperature`, `blood-glucose`, `irregular-rhythm-notification`, `food`, `food-measurement-unit`, `nutrition-log`, and `exportExerciseTcx`."
          }
        ]
      }
    ]
  },
  {
    "date": "2026-05-26",
    "dateText": "May 26, 2026",
    "id": "may_26_2026",
    "intro": [],
    "sections": [
      {
        "heading": "New Scopes",
        "id": "new_scopes_2",
        "blocks": [{"kind":"list","ordered":false,"items":[{"text":"`.ecg.readonly` for reading ECG data."},{"text":"`.irn.readonly` for reading IRN data."}]}]
      },
      {
        "heading": "Scope Name Changes",
        "id": "scope_name_changes",
        "blocks": [
          {"kind":"p","text":"Replacing read/write scopes with.writeonly. Developers must now explicitly specify read and write permissions."},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`.activity_and_fitness` is now `.activity_and_fitness.writeonly`"},
              {"text":"`.health_metrics_and_measurements` is now `.health_metrics_and_measurements.writeonly`"},
              {"text":"`.nutrition` is now `.nutrition.writeonly`"},
              {"text":"`.profile` is now `.profile.writeonly`"},
              {"text":"`.settings` is now `.settings.writeonly`"},
              {"text":"`.sleep` is now `.sleep.writeonly`"}
            ]
          }
        ]
      },
      {
        "heading": "New Data Types",
        "id": "new_data_types_2",
        "blocks": [
          {"kind":"p","text":"Added support for the following data types:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Activity & Fitness: `active-energy-burned`"},
              {"text":"ECG: `electrocardiogram`"},
              {"text":"Health Metrics & Measurements: `core-body-temperature`, `blood-glucose`"},
              {"text":"IRN: `irregular-rhythm-notification`"},
              {"text":"Nutrition: `food`, `food-measurement-unit`, `nutrition-log`"}
            ]
          }
        ]
      },
      {
        "heading": "New Endpoints",
        "id": "new_endpoints",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`project.subscribers.subscriptions`: `create`, `delete`, `list` and `patch` methods for manual subscription management."},
              {"text":"`users`: `getIrnProfile` returns a user's current engagement with IRN feature"},
              {"text":"`users.pairedDevices`: `get` and `list` the devices paired to a user's account."}
            ]
          }
        ]
      },
      {
        "heading": "Webhooks",
        "id": "webhooks",
        "blocks": [
          {"kind":"p","text":"Added support for the following webhook functionality:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Manual subscription support when a subscriber is registered."},
              {
                "text": "Notification support for the data types `activityLevel`, `bloodGlucose`, `dailyRespiratoryRate`, `heartRateVariability`, `height`, `hydrationLog`, `nutritionLog`, `respiratoryRateSleepSummary`, `runVo2Max`, `sedentaryPeriod`, `timeInHeartRateZone`."
              },
              {"text":"Support for custom metrics, alerts and subscriber errors in the Google Cloud Console."},
              {"text":"Automatically retries failed webhook notifications for up to 7 days if communication with the subscriber is lost."}
            ]
          }
        ]
      },
      {
        "heading": "Highlighted Documentation Updates",
        "id": "highlighted_documentation_updates_3",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Content to help publish your app including a developer checklist and App Verification content"},
              {"text":"Codelab for using the OAuth2 Playground"},
              {"text":"Google Health branding guide"},
              {"text":"Defined rate limits"}
            ]
          }
        ]
      }
    ]
  },
  {
    "date": "2026-04-14",
    "dateText": "April 14, 2026",
    "id": "april_14_2026",
    "intro": [],
    "sections": [
      {
        "heading": "New Data Types",
        "id": "new_data_types_3",
        "blocks": [{"kind":"list","ordered":false,"items":[{"text":"Activity & Fitness: `swim-lengths-data`"},{"text":"Health Metrics & Measurements: `height`"}]}]
      },
      {
        "heading": "New Endpoints",
        "id": "new_endpoints_2",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`project.subscribers`: `delete`, `get`, `list`, and `patch` methods for manual subscription management."},
              {"text":"`users.dataTypes.dataPoints`: `get` returns a single data point based on the ID."}
            ]
          }
        ]
      },
      {
        "heading": "Webhook Support",
        "id": "webhook_support",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Automatic subscription creation when a subscriber is registered."},
              {"text":"Manually manage your subscriptions using the `project.subscribers` endpoints"},
              {
                "text": "Notification support for the data types `activeZoneMinutes`, `altitude`, `bodyFat`, `caloriesInHeartRateZone`, `dailyHeartRateVariability`, `dailyHeartRateZones`, `dailyOxygenSaturation`, `dailyRestingHeartRate`, `dailySleepTemperatureDerivations`, `distance`, `exercise`, `floors`, `heartRate`, `sleep`, `steps`, `totalCalories`, and `weight`."
              }
            ]
          }
        ]
      },
      {
        "heading": "Additional features",
        "id": "additional_features",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "REST libraries on Github: The Google Health API REST libraries are available for all supported client libraries included in the Github project Google APIs."
              },
              {"text":"Support for API Explorer: The endpoints can be called using API Explorer that is built into the reference documentation."},
              {
                "text": "Support for the OAuth Playground: The Google Health API v4 is listed on the OAuth 2.0 Playground, a tool that lets you to call the endpoints that support Google's OAuth Library."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "date": "2026-03-24",
    "dateText": "March 24, 2026",
    "id": "march_24_2026",
    "intro": [
      {"kind":"p","text":"Google Health API Launch Announcement"},
      {
        "kind": "p",
        "text": "The Google Health API is the next generation of the Fitbit Web API, built from the ground up and designed for our valued developer community. This initial release is focused on achieving parity with the Fitbit Web API across the most requested data types, along with adding functionality which the developer community has requested. Here's a look at the features available today."
      }
    ],
    "sections": [
      {
        "heading": "Core features highlights",
        "id": "core_features_highlights",
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Streamlined setup: Register your projects and manage OAuth client IDs directly through the familiar Google Cloud Console."},
              {"text":"Broad platform support: Build on Google OAuth2 libraries for seamless integration across all major programming languages and platforms."},
              {"text":"Simplified data access: Utilize new scope definitions that consolidate multiple data types into a single, easy-to-manage scope."},
              {
                "text": "Consistent endpoints across data types: Experience a simpler coding journey with new, uniformed endpoints and filter support designed to streamline functionality across all data types."
              },
              {"text":"Comprehensive Data Coverage: Access read and write support across multiple data types."},
              {
                "text": "Real-time Notifications: Instantly receive updates with enhanced Webhook support, featuring automatic subscription creation and richer notification message content."
              },
              {"text":"Default Intraday Support: Retrieve granular, intraday data by default using the list endpoint, eliminating extra steps."},
              {
                "text": "Complete Documentation Suite: Get up and running fast with our new comprehensive documentation, including:",
                "sub": [
                  "Getting Started, API, Migration, and Troubleshooting Guides",
                  "Full Reference Guide for REST",
                  "New Google Health API Parity tool, sample code, and a guided codelab"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Supported Data Types",
        "id": "supported_data_types",
        "blocks": [
          {"kind":"p","text":"This launch provides access to essential data types, ensuring you have the core information needed to build innovative health solutions."},
          {"kind":"p","text":"Data Types Supporting Read:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Activity & Fitness: Active Minutes, Active Zone Minutes, Activity Level, Altitude, Calories in Heart Rate Zones, Daily VO2 Max, Distance, Exercise, Floors, Run VO2 Max, Sedentary Period, Steps, Time in Heart Rate Zone, Total Calories, VO2 Max"
              },
              {
                "text": "Health Metrics & Measurements: Body Fat, Daily Heart Rate Variability, Daily Heart Rate Zones, Daily Oxygen Saturation, Daily Respiratory Rate, Daily Resting Heart Rate, Daily Sleep Temperature Derivations, Heart Rate, Heart Rate Variability, Oxygen Saturation, Respiratory Rate Sleep Summary, Weight"
              },
              {"text":"Identity: Returns the Fitbit user ID and the Google user ID"},
              {"text":"Location: GPS data based on a recorded exercise exposed in TCX format"},
              {"text":"Nutrition: Hydration Log"},
              {"text":"Profile: Users basic profile information"},
              {"text":"Settings: Users configured device and mobile app settings"},
              {"text":"Sleep: Classic and Stages sleep logs"}
            ]
          },
          {"kind":"p","text":"Data Types Supporting Write:"},
          {"kind":"p","text":"You can write and modify data for these data types:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [{"text":"Activity & Fitness: Exercise"},{"text":"Health Metrics & Measurements: Body Fat, Weight"},{"text":"Profile"},{"text":"Settings"},{"text":"Sleep"}]
          }
        ]
      },
      {
        "heading": "Key Endpoints for Interaction",
        "id": "key_endpoints_for_interaction",
        "blocks": [
          {"kind":"p","text":"The following endpoints are available to manage subscriptions, users, and health & fitness data:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`users`: `getIdentity`, `getProfile`, `getSettings`, `updateProfile`, and `updateSettings` methods for identity and profile management."},
              {
                "text": "`users.dataTypes.dataPoints`: `batchDelete`, `dailyRollUp`, `list`, `patch`, `reconcile`, and `rollUp` methods for comprehensive data type management."
              }
            ]
          }
        ]
      }
    ]
  }
];

/** Sentences in Google's guides that name a data type in code, by type. */
export const GHAPI_MENTIONS: Record<string, { source: GhapiSourceKey; section: string | null; sectionId: string; text: string }[]> = {
  "total-calories": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "Filter requirements: Some read-only derived data types, such as `total-calories`, require a filter specifying an interval start time (using physical or civil time)."
    },
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "A maximum query range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    },
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "A maximum range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    }
  ],
  "calories-in-heart-rate-zone": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "A maximum query range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    },
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "A maximum range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    }
  ],
  "heart-rate": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "A maximum query range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    },
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "A maximum range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    }
  ],
  "active-minutes": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "A maximum query range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    },
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "A maximum range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`."
    }
  ],
  "steps": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "Rollup window size: When calling the `rollUp` endpoint, the `windowSize` duration must be at least 1 second (`\"1s\"`). Sub-second durations are rejected with `INVALID_ARGUMENT`. In addition, choose a `windowSize` equal to or larger than the data type's underlying storage resolution (such as `\"60s\"` for 1-minute interval data types like `steps` and `distance`) to avoid uneven distribution across sub-intervals. For details, see Rollup window and storage resolution."
    }
  ],
  "distance": [
    {
      "source": "dataTypes",
      "section": "Query constraints",
      "sectionId": "query_constraints",
      "text": "Rollup window size: When calling the `rollUp` endpoint, the `windowSize` duration must be at least 1 second (`\"1s\"`). Sub-second durations are rejected with `INVALID_ARGUMENT`. In addition, choose a `windowSize` equal to or larger than the data type's underlying storage resolution (such as `\"60s\"` for 1-minute interval data types like `steps` and `distance`) to avoid uneven distribution across sub-intervals. For details, see Rollup window and storage resolution."
    }
  ],
  "oxygen-saturation": [
    {
      "source": "dataTypes",
      "section": "Data quality and validity filtering",
      "sectionId": "data-quality-and-validity-filtering",
      "text": "For minute-level blood oxygen saturation (`oxygen-saturation`), the API returns only validated readings and removes minutes marked invalid due to arm movement, a loose wrist fit, or a sensor confidence score under 50%, as well as the 3 minutes before and after an invalid reading and isolated valid stretches shorter than 4 minutes. As a result, minute-level coverage can be sparse and gaps are expected. For details, see Minute-level SpO2 filtering and data validity."
    },
    {
      "source": "apiSpecifications",
      "section": "Oxygen saturation filtering",
      "sectionId": "oxygen-saturation-filtering",
      "text": "When querying minute-level blood oxygen saturation (`oxygen-saturation`), the Google Health API applies stricter data validity filtering than the legacy Fitbit Web API:"
    },
    {
      "source": "apiSpecifications",
      "section": "Oxygen saturation filtering",
      "sectionId": "oxygen-saturation-filtering",
      "text": "Because the Google Health API removes all invalid measurements rather than only the 50% sentinel value, it returns fewer `oxygen-saturation` data points than the Fitbit Web API for the same time range, and gaps in minute-by-minute coverage are expected. The returned minute-level readings align with the validated data points used to compute the user's `daily-oxygen-saturation` sleep summary. For more information, see Minute-level SpO2 filtering and data validity."
    }
  ],
  "daily-oxygen-saturation": [
    {
      "source": "apiSpecifications",
      "section": "Oxygen saturation filtering",
      "sectionId": "oxygen-saturation-filtering",
      "text": "Because the Google Health API removes all invalid measurements rather than only the 50% sentinel value, it returns fewer `oxygen-saturation` data points than the Fitbit Web API for the same time range, and gaps in minute-by-minute coverage are expected. The returned minute-level readings align with the validated data points used to compute the user's `daily-oxygen-saturation` sleep summary. For more information, see Minute-level SpO2 filtering and data validity."
    }
  ],
  "exercise": [
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "Variable page sizes: Capping limits depend on the endpoint and data type. For most data types, page sizes are capped at a maximum of 10,000. However, for certain data types like `exercise` and `sleep`, the default and maximum page size is capped at 25. For example, if a client requests all sleep data for the past 10 years, the API will still return only 25 sleep sessions on the first page."
    }
  ],
  "sleep": [
    {
      "source": "endpoints",
      "section": "Query historical data",
      "sectionId": "query-historical-data",
      "text": "Variable page sizes: Capping limits depend on the endpoint and data type. For most data types, page sizes are capped at a maximum of 10,000. However, for certain data types like `exercise` and `sleep`, the default and maximum page size is capped at 25. For example, if a client requests all sleep data for the past 10 years, the API will still return only 25 sleep sessions on the first page."
    }
  ]
};

/** Every cross-check flag: where Google's own pages disagree. */
export const GHAPI_FLAGS: GhapiFlag[] = [
  {
    "dataType": "activity-level",
    "kind": "rollup-not-in-table",
    "summary": "The discovery document's RollupDataPoint.activityLevel is returned when rolling up activity-level, but the table does not list rollup for activity-level.",
    "evidence": [
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `activity-level` data type, or when requested explicitly using the `activity-level` rollup type identifier."
      },
      {"source":"dataTypes","text":"list, reconcile"}
    ]
  },
  {
    "dataType": "activity-level",
    "kind": "rollup-not-in-table",
    "summary": "The discovery document's DailyRollupDataPoint.activityLevel is returned when rolling up activity-level, but the table does not list dailyRollup for activity-level.",
    "evidence": [
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `activity-level` data type, or when requested explicitly using the `activity-level` rollup type identifier."
      },
      {"source":"dataTypes","text":"list, reconcile"}
    ]
  },
  {
    "dataType": "body-fat",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for body-fat, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "calories-in-heart-rate-zone",
    "kind": "no-v4-datapoint-property",
    "summary": "Neither discovery document has a DataPoint property for calories-in-heart-rate-zone; it exists only as a rollup (caloriesInHeartRateZone), matching the table's operations (rollup, dailyRollup).",
    "evidence": [
      {"source":"dataTypes","text":"Calories In Heart Rate Zone"},
      {"source":"dataTypes","text":"rollup, dailyRollup"},
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `calories-in-heart-rate-zone` data type, or when requested explicitly using the `calories-in-heart-rate-zone` rollup type identifier."
      }
    ]
  },
  {
    "dataType": "daily-heart-rate-variability",
    "kind": "rollup-not-in-table",
    "summary": "The discovery document's DailyRollupDataPoint.heartRateVariabilityPersonalRange is returned when rolling up daily-heart-rate-variability, but the table does not list dailyRollup for daily-heart-rate-variability.",
    "evidence": [
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `daily-heart-rate-variability` data type, or when requested explicitly using the `heart-rate-variability-personal-range` rollup type identifier."
      },
      {"source":"dataTypes","text":"list, reconcile"}
    ]
  },
  {
    "dataType": "daily-resting-heart-rate",
    "kind": "rollup-not-in-table",
    "summary": "The discovery document's DailyRollupDataPoint.restingHeartRatePersonalRange is returned when rolling up daily-resting-heart-rate, but the table does not list dailyRollup for daily-resting-heart-rate.",
    "evidence": [
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `daily-resting-heart-rate` data type, or when requested explicitly using the `resting-heart-rate-personal-range` rollup type identifier."
      },
      {"source":"dataTypes","text":"list, reconcile"}
    ]
  },
  {
    "dataType": "exercise",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for exercise, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "exercise",
    "kind": "method-not-in-table",
    "summary": "The discovery document's exportExerciseTcx method is documented for exercise, but the table's operations for exercise do not list it.",
    "evidence": [
      {
        "source": "discoveryV4",
        "text": "Exports exercise data in TCX format. **IMPORTANT:** HTTP clients must append `?alt=media` to the request URL to download the raw TCX file."
      },
      {"source":"dataTypes","text":"list, get, reconcile, create, update, batchDelete"}
    ]
  },
  {
    "dataType": "floors",
    "kind": "reference-anchor-differs",
    "summary": "The table links floors to the reference anchor #RollupDataPoint.FIELDS.floors; the DataPoint property that names it is floors.",
    "evidence": [{"source":"dataTypes","text":"Floors"},{"source":"discoveryV4","text":"Optional. Data for points in the `floors` interval data type collection."}]
  },
  {
    "dataType": "food",
    "kind": "scope-not-in-discovery",
    "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "summary": "The table lists .nutrition.readonly for food, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
    "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
  },
  {
    "dataType": "food-measurement-unit",
    "kind": "scope-not-in-discovery",
    "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "summary": "The table lists .nutrition.readonly for food-measurement-unit, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
    "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
  },
  {
    "dataType": "height",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for height, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "hydration-log",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for hydration-log, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "hydration-log",
    "kind": "scope-not-in-discovery",
    "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "summary": "The table lists .nutrition.readonly for hydration-log, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
    "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
  },
  {
    "dataType": "menstrual-period",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for menstrual-period, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "moods",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for moods, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "nutrition-log",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for nutrition-log, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "nutrition-log",
    "kind": "scope-not-in-discovery",
    "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "summary": "The table lists .nutrition.readonly for nutrition-log, but the v4 discovery document defines no https://www.googleapis.com/auth/googlehealth.nutrition.readonly scope, and none of its methods accepts it.",
    "evidence": [{"source":"dataTypes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
  },
  {
    "dataType": "ovulation-test",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for ovulation-test, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "skin-temperature-sensors",
    "kind": "no-v4-datapoint-property",
    "summary": "The v4 discovery document has no DataPoint property for skin-temperature-sensors; the v4beta document has skinTemperatureSensors, matching the table's v4beta tag.",
    "evidence": [
      {"source":"dataTypes","text":"Skin Temperature Sensors"},
      {"source":"dataTypes","text":"list"},
      {"source":"discoveryV4beta","text":"Optional. Data for points in the `skin-temperature-sensors` sample data type collection."}
    ]
  },
  {
    "dataType": "sleep",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for sleep, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "symptoms",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for symptoms, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": "total-calories",
    "kind": "no-v4-datapoint-property",
    "summary": "Neither discovery document has a DataPoint property for total-calories; it exists only as a rollup (totalCalories), matching the table's operations (rollup, dailyRollup).",
    "evidence": [
      {"source":"dataTypes","text":"Total Calories"},
      {"source":"dataTypes","text":"rollup, dailyRollup"},
      {
        "source": "discoveryV4",
        "text": "Returned by default when rolling up data points from the `total-calories` data type, or when requested explicitly using the `total-calories` rollup type identifier."
      }
    ]
  },
  {
    "dataType": "weight",
    "kind": "operation-name-differs",
    "summary": "The table lists \"update\" for weight, but the discovery document has no method named update; Google's endpoint-mapping table points updates at patch.",
    "evidence": [
      {"source":"apiSpecifications","text":"CREATE & UPDATE Logs"},
      {"source":"apiSpecifications","text":"`patch` method"},
      {"source":"discoveryV4","text":"Updates a single identifiable data point. If a data point with the specified `name` is not found, the request will fail."}
    ]
  },
  {
    "dataType": null,
    "kind": "scope-not-on-scopes-page",
    "scope": "https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly",
    "summary": "The v4 discovery document defines .reproductive_health.readonly (\"See your Google Health reproductive health data\"); the Scopes page does not list it.",
    "evidence": [
      {"source":"discoveryV4","text":"https://www.googleapis.com/auth/googlehealth.reproductive_health.readonly"},
      {"source":"discoveryV4","text":"See your Google Health reproductive health data"}
    ]
  },
  {
    "dataType": null,
    "kind": "scope-not-on-scopes-page",
    "scope": "https://www.googleapis.com/auth/googlehealth.mindfulness.readonly",
    "summary": "The v4 discovery document defines .mindfulness.readonly (\"See your Google Health mindfulness data\"); the Scopes page does not list it.",
    "evidence": [
      {"source":"discoveryV4","text":"https://www.googleapis.com/auth/googlehealth.mindfulness.readonly"},
      {"source":"discoveryV4","text":"See your Google Health mindfulness data"}
    ]
  },
  {
    "dataType": null,
    "kind": "scope-not-on-scopes-page",
    "scope": "https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly",
    "summary": "The v4 discovery document defines .logged_symptoms.readonly (\"See your Google Health logged symptoms data\"); the Scopes page does not list it.",
    "evidence": [
      {"source":"discoveryV4","text":"https://www.googleapis.com/auth/googlehealth.logged_symptoms.readonly"},
      {"source":"discoveryV4","text":"See your Google Health logged symptoms data"}
    ]
  },
  {
    "dataType": null,
    "kind": "scope-not-in-discovery",
    "scope": "https://www.googleapis.com/auth/googlehealth.nutrition.readonly",
    "summary": "The Scopes page documents .nutrition.readonly (\"See your Google Health nutrition data.\"); the v4 discovery document does not define it.",
    "evidence": [{"source":"scopes","text":".nutrition.readonly"},{"source":"scopes","text":"See your Google Health nutrition data."}]
  },
  {
    "dataType": "basal-energy-burned",
    "kind": "mapping-type-not-in-table",
    "summary": "Google's Fitbit mapping table maps \"Activity `caloriesBMR`\" to basal-energy-burned, which the data-types table does not list; the v4 discovery document does have DataPoint.basalEnergyBurned.",
    "evidence": [
      {"source":"apiSpecifications","text":"Activity `caloriesBMR`"},
      {"source":"apiSpecifications","text":"basal-energy-burned"},
      {"source":"apiSpecifications","text":"The calories burned due to Basal Metabolic Rate (BMR) over a specific period of time."},
      {"source":"discoveryV4","text":"Optional. Data for points in the `basal-energy-burned` interval data type collection."}
    ]
  },
  {
    "dataType": "total-calories",
    "kind": "release-note-webhook-type-not-listed",
    "summary": "Google's release notes for April 14, 2026 list totalCalories under webhook notification support; the data-types table and the webhooks page do not list total-calories as webhook-supported.",
    "evidence": [
      {
        "source": "releaseNotes",
        "text": "Notification support for the data types `activeZoneMinutes`, `altitude`, `bodyFat`, `caloriesInHeartRateZone`, `dailyHeartRateVariability`, `dailyHeartRateZones`, `dailyOxygenSaturation`, `dailyRestingHeartRate`, `dailySleepTemperatureDerivations`, `distance`, `exercise`, `floors`, `heartRate`, `sleep`, `steps`, `totalCalories`, and `weight`."
      }
    ]
  },
  {
    "dataType": null,
    "kind": "restricted-scope-wording",
    "summary": "Google's pages word the restricted-scope rule differently: About the Google Health API says \"all\"; App verification says \"most\".",
    "evidence": [
      {"source":"about","text":"All Google Health API scopes are categorized as Restricted, necessitating a privacy and security review for access."},
      {
        "source": "appVerification",
        "text": "Most scopes for the Google Health API are restricted, which means you must complete verification before your app is publicly available."
      }
    ]
  }
];

/** The prose sections the pages quote, per source page, verbatim. */
export const GHAPI_PAGES: Record<Exclude<GhapiSourceKey, "discoveryV4" | "discoveryV4beta">, { title: string | null; intro: GhapiBlock[]; sections: GhapiSection[] }> = {
  "dataTypes": {
    "title": "Google Health API data types",
    "intro": [
      {
        "kind": "p",
        "text": "The following table contains the full list of data types, with several columns to help you understand the representation of each type in the Google Health API, as well as the scope each is available under."
      },
      {
        "kind": "note",
        "variant": "note",
        "text": "Note: Fitbit Ace devices are not supported by the Health API. For more information, see Fitbit Privacy Policy for Children's Accounts."
      }
    ],
    "sections": [
      {
        "id": "data-type-fields",
        "heading": "Data type fields",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "The Google Health API data types table includes several field columns to help you understand the representation and requirements of each data type. These columns are as follows:"
          }
        ]
      },
      {
        "id": "query_constraints",
        "heading": "Query constraints",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"When querying data points, rollups, or daily rollups from the API, keep the following constraints in mind:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Filter requirements: Some read-only derived data types, such as `total-calories`, require a filter specifying an interval start time (using physical or civil time)."
              },
              {
                "text": "Query range limits: Rollup and daily rollup aggregation endpoints enforce maximum query range limits based on the data type:",
                "sub": [
                  "A maximum query range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`.",
                  "A maximum query range of 90 days for all other data types."
                ]
              },
              {
                "text": "Rollup window size: When calling the `rollUp` endpoint, the `windowSize` duration must be at least 1 second (`\"1s\"`). Sub-second durations are rejected with `INVALID_ARGUMENT`. In addition, choose a `windowSize` equal to or larger than the data type's underlying storage resolution (such as `\"60s\"` for 1-minute interval data types like `steps` and `distance`) to avoid uneven distribution across sub-intervals. For details, see Rollup window and storage resolution."
              }
            ]
          }
        ]
      },
      {
        "id": "daily-versus-interval-data-types",
        "heading": "Daily versus Interval data types",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "For certain physiological metrics, such as Heart Rate Variability (HRV) or Oxygen Saturation (SpO2), the Google Health API provides two distinct data types: a Daily version and an Interval version. Understanding the difference is key to choosing the right metric for your use case:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Daily: A single, pre-aggregated summary for the entire day. Use this for high-level trends and daily dashboards to save on processing."},
              {
                "text": "Interval: Granular, high-resolution measurements taken throughout the day. Use this for charting intraday fluctuations or performing deep, hour-by-hour analysis."
              }
            ]
          }
        ]
      },
      {
        "id": "data_availability",
        "heading": "Data availability",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Updates to the user's data is only available after they sync their activity tracker or manually enter new data into the Google Health app. The Fitbit device and Google Health app can automatically sync every 15 minutes when the Google Health app is open on the mobile device and the two have an active data connection and are within Bluetooth range. If the user is tracking activity using MobileTrack, MobileTrack syncs every hour as long as the app is open."
          }
        ]
      },
      {
        "id": "third-party_access",
        "heading": "Third-party access",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Fitbit devices can't communicate directly with third-party applications or services. These devices are designed to communicate and synchronize exclusively with the Google Health app."
          },
          {
            "kind": "p",
            "text": "The device syncs data automatically throughout the day, whenever the Google Health app is open, or every 15 minutes if Bluetooth is active and the app is running in the background. Once this synchronization process is complete, the data is then available for third-party services through the Google Health API."
          }
        ]
      },
      {
        "id": "data-quality-and-validity-filtering",
        "heading": "Data quality and validity filtering",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To provide dependable health metrics without requiring custom client-side noise filtering, the Google Health API validates sensor telemetry and excludes invalid measurements before returning responses:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "For minute-level blood oxygen saturation (`oxygen-saturation`), the API returns only validated readings and removes minutes marked invalid due to arm movement, a loose wrist fit, or a sensor confidence score under 50%, as well as the 3 minutes before and after an invalid reading and isolated valid stretches shorter than 4 minutes. As a result, minute-level coverage can be sparse and gaps are expected. For details, see Minute-level SpO2 filtering and data validity."
              }
            ]
          }
        ]
      },
      {
        "id": "variable_day_lengths",
        "heading": "Variable day lengths",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Time handling by the Health API prioritize the user's time to account for variable day lengths caused by Daylight Savings Time or travel. Every data point is stored with both a physical UTC timestamp and the UTC offset active at the time of the event. This allows the system to:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [{"text":"Map the event to a precise physical instant."},{"text":"Correct the time to the user's local context for aggregation."}]
          }
        ]
      },
      {
        "id": "daylight_savings_time",
        "heading": "Daylight Savings Time",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "When Daylight Savings Time happens, a \"fall back\" results in a 25-hour civil day, and the rollup for that date will contain 25 hours of data. A \"spring forward\" results in a 23-hour civil day where the time moves back to Standard Time."
          }
        ]
      },
      {
        "id": "travel",
        "heading": "Travel",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Travel across time zones can cause even more significant variations in the physical duration of a single civil day."},
          {
            "kind": "p",
            "text": "Use the `dailyRollUp` endpoint to reconcile time zone differences. It automatically attributes data to the calendar day on which it was recorded according to the user's local time, effectively \"stitching\" the day together despite time zone shifts. For details and examples, see Aggregate across calendar days in the Aggregate data guide."
          }
        ]
      }
    ]
  },
  "scopes": {
    "title": "Scopes",
    "intro": [
      {
        "kind": "p",
        "text": "All Google Health API endpoints that read and write user data require user consent to that data collection through one or more scopes. The app must provide the list of scopes when calling Google's OAuth2 auth endpoint. See Obtaining OAuth2 Access Tokens. The access token issued will only contain the scopes the consenting user has authorized."
      },
      {"kind":"p","text":"All Google Health API scopes begin with:"},
      {"kind":"code","text":"https://www.googleapis.com/auth/googlehealth"}
    ],
    "sections": [
      {
        "id": "implementation",
        "heading": "Implementation",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"To provide the best user experience and ensure security compliance, when requesting scopes you should:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Only request access to the specific data scopes your application requires to function, and explain the specific user benefit of each permission in an in-app disclosure before launching the OAuth consent screen."
              },
              {"text":"Only configure \"write\" access (for example, using a `writeonly` scope) if you are sending data to Google Health."},
              {
                "text": "Users have the right to grant granular permissions. Never crash, show a generic technical error, or render a blank screen if a user withholds one or more requested scopes:",
                "sub": [
                  "Partial consent (graceful degradation): If a user grants some scopes (for example, granting Heart Rate but withholding Steps), keep your application functional using the permitted data streams. Display inline, context-specific prompts explaining which features are limited and provide a direct link to re-authorize missing scopes.",
                  "Zero consent (fallback UI): If a user deselects all scopes, route them to a dedicated Missing Permissions screen that explains why the integration requires at least one permission (for example, \"For the best user experience, we recommend enabling all scopes\") and provide a prominent Grant Scopes button to re-launch the consent flow."
                ]
              },
              {
                "text": "Don't maintain duplicate in-app permission toggles that conflict with Google Consent settings. If a user revokes scope access through their Google Account, reflect that change in your app UI immediately."
              }
            ]
          }
        ]
      }
    ]
  },
  "apiSpecifications": {
    "title": "API specifications",
    "intro": [
      {
        "kind": "p",
        "text": "The API Specification section provides a detailed overview of the technical components essential for integrating with the platform, including authorization scopes, data type definitions, and endpoint structures. This API represents a strategic evolution of the legacy Fitbit Web API, rebuilt on modern infrastructure to ensure a more stable and consistent developer experience."
      }
    ],
    "sections": [
      {
        "id": "scopes",
        "heading": "Scopes",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "You must update your authorization request to use the Google Health API scopes. The scopes define whether your app supports read or write operations. Follow the scope implementation instructions, which specify only requesting needed scopes, configuring write access only when sending data, and handling partial consent gracefully."
          },
          {
            "kind": "p",
            "text": "The Google Health API scopes are a HTTP URL beginning with https://www.googleapis.com/auth/googlehealth.{scope}. For example, https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly."
          }
        ]
      },
      {
        "id": "scope_mappings",
        "heading": "Scope mappings",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Here is how the Fitbit Web API scopes map to the Google Health API scopes:"},
          {
            "kind": "table",
            "caption": "Table: Fitbit Web API to Google Health API scope mappings",
            "head": ["Fitbit Web API Scopes","Google Health API Scopes"],
            "rows": [
              ["activity",".activity_and_fitness.readonly\n.activity_and_fitness.writeonly"],
              ["blood_glucose",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"],
              ["cardio_fitness",".activity_and_fitness.readonly\n.activity_and_fitness.writeonly"],
              ["electrocardiogram",".ecg.readonly"],
              ["heartrate",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"],
              ["irregular_rhythm_notifications",".irn.readonly"],
              ["location",".location.readonly"],
              ["nutrition",".nutrition.readonly\n.nutrition.writeonly"],
              ["oxygen_saturation",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"],
              ["profile",".profile.readonly\n.profile.writeonly"],
              ["respiratory_rate",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"],
              ["settings",".settings.readonly\n.settings.writeonly"],
              ["sleep",".sleep.readonly\n.sleep.writeonly"],
              ["temperature",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"],
              ["weight",".health_metrics_and_measurements.readonly\n.health_metrics_and_measurements.writeonly"]
            ]
          }
        ]
      },
      {
        "id": "data-types",
        "heading": "Data types",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"Here is a list of Google Health API data types and how they map to the Fitbit Web API."},
          {
            "kind": "table",
            "caption": "Table: Fitbit Web API to Google Health API data type mappings",
            "head": ["Fitbit Web API Data Type","Google Health API Data Type\n`dataType`","Description"],
            "rows": [
              [
                "Activity Calories",
                "Active Energy Burned\n`active-energy-burned`",
                "Represents the calories burned during active periods, inclusive of BMR for those periods. In the Google Health API, this can be reconstructed by adding BMR to the `active-energy-burned` data type (which tracks activity-only burn, excluding basal rate)."
              ],
              ["Active Zone Minutes","Active Zone Minutes\n`active-zone-minutes`",""],
              [
                "Contains changes to the user's activity levels",
                "Activity Level\n`activity-level`",
                "Captures the user's activity level (such as sedentary or active) over a specific period of time."
              ],
              ["Elevation","Altitude\n`altitude`",""],
              ["Activity `caloriesBMR`","Basal Energy Burned\n`basal-energy-burned`","The calories burned due to Basal Metabolic Rate (BMR) over a specific period of time."],
              ["Blood Glucose","Blood Glucose\n`blood-glucose`",""],
              ["Body fat","Body Fat\n`body-fat`",""],
              ["`caloriesOut` in each heart rate zone","Calories In Heart Rate Zone\n`calories-in-heart-rate-zone`",""],
              ["Temperature (Core)","Core Body Temperature\n`core-body-temperature`",""],
              ["HRV summary","Daily Heart Rate Variability\n`daily-heart-rate-variability`",""],
              [
                "SpO2 summary",
                "Daily Oxygen Saturation\n`daily-oxygen-saturation`",
                "A daily summary of blood oxygen saturation (SpO2) statistics calculated from validated sleep measurements."
              ],
              ["Resting heart rate","Daily Resting Heart Rate\n`daily-resting-heart-rate`",""],
              ["Skin temperature","Daily Sleep Temperature Derivations\n`daily-sleep-temperature-derivations`",""],
              ["Distance","Distance\n`distance`",""],
              ["Electrocardiogram (ECG)","Electrocardiogram (ECG)\n`electrocardiogram`",""],
              ["Recorded activity","Exercise\n`exercise`","Recorded workouts or exercise sessions, which include start/end times, activity types, and session metrics."],
              ["Floors","Floors\n`floors`",""],
              ["Food","Food\n`food`",""],
              ["Food Measurement Unit","Food Measurement Unit\n`food-measurement-unit`",""],
              ["Heart Rate","Heart Rate\n`heart-rate`",""],
              ["HRV Intraday","Heart Rate Variability\n`heart-rate-variability`",""],
              ["Irregular Rhythm Notifications (IRN)","Irregular Rhythm Notification\n`irregular-rhythm-notification`",""],
              ["Food Log","Nutrition Log\n`nutrition-log`",""],
              [
                "SpO2 Intraday",
                "Oxygen Saturation\n`oxygen-saturation`",
                "Returns only validated minute-level SpO2 measurements and excludes readings flagged as invalid due to motion artifacts or low sensor confidence. Because the Fitbit Web API only excluded the 50% sentinel value, the Google Health API returns fewer data points for the same time range. For details, see Oxygen saturation filtering."
              ],
              ["VO2 Max value when the user runs","Run VO2 Max\n`run-vo2-max`",""],
              ["Activity time series minutes sedentary","Sedentary Period\n`sedentary-period`",""],
              ["Sleep","Sleep\n`sleep`",""],
              ["Steps","Steps\n`steps`",""],
              ["Activity time series swimming strokes","Swim Lengths Data\n`swim-lengths-data`",""],
              [
                "Activity `caloriesOut`",
                "Total Calories\n`total-calories`",
                "The complete number of calories burned by a user over a period of time, inclusive of basal metabolic rate and active energy burned."
              ],
              ["VO2 Max value","VO2 Max\n`vo2-max`",""],
              ["Weight","Weight\n`weight`",""]
            ]
          }
        ]
      },
      {
        "id": "calculations",
        "heading": "Calculations",
        "level": 2,
        "blocks": [{"kind":"p","text":"Mappings and rules in the Google Health API differ from the Fitbit Web API."}]
      },
      {
        "id": "oxygen-saturation-filtering",
        "heading": "Oxygen saturation filtering",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "When querying minute-level blood oxygen saturation (`oxygen-saturation`), the Google Health API applies stricter data validity filtering than the legacy Fitbit Web API:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"The legacy Fitbit Web API (v1 and v3) only excluded SpO2 samples with a sentinel value of 50%."},
              {
                "text": "The Google Health API (v4) excludes all SpO2 samples flagged as invalid by the validation algorithm. A minute is marked invalid when arm movement or a loose wrist fit makes the optical sensor signal unreliable, when the confidence score drops under 50%, during the 3 minutes immediately before and after an invalid reading, or when a valid stretch lasts less than 4 consecutive minutes."
              }
            ]
          },
          {
            "kind": "p",
            "text": "Because the Google Health API removes all invalid measurements rather than only the 50% sentinel value, it returns fewer `oxygen-saturation` data points than the Fitbit Web API for the same time range, and gaps in minute-by-minute coverage are expected. The returned minute-level readings align with the validated data points used to compute the user's `daily-oxygen-saturation` sleep summary. For more information, see Minute-level SpO2 filtering and data validity."
          }
        ]
      },
      {
        "id": "activity-thresholds",
        "heading": "Activity level, METs, and step thresholds",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "In the Google Health API, a user's minute-by-minute activity level is derived from their Metabolic Equivalent of Task (MET) and step count."
          },
          {
            "kind": "note",
            "variant": "note",
            "text": "Note: Heart Rate Devices refers to wearable devices equipped with a heart rate sensor that actively track heart rate data. Non-Heart Rate Devices refers to devices without a heart rate sensor (such as pedometers), or where heart rate tracking is disabled or unavailable."
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["Activity level","Heart rate devices","Non-heart rate devices"],
            "rows": [
              ["Sedentary","≤ 1.5 METs","≤ 1.5 METs"],
              ["Lightly Active","> 1.5 METs and ≤ 4.2 METs","> 1.5 METs and ≤ 3.5 METs"],
              [
                "Moderately Active",
                "> 4.2 METs and < 6.0 METs\n(unless conditions for Very Active are met)",
                "> 3.5 METs and < 6.0 METs\n(unless conditions for Very Active are met)"
              ],
              [
                "Very Active",
                "≥ 6.0 METs, or ≥ 5.0 METs with a step rate of 150 steps per minute or more",
                "≥ 6.0 METs, or ≥ 5.0 METs with a step rate of 150 steps per minute or more"
              ]
            ]
          },
          {
            "kind": "p",
            "text": "Active minutes consist of combined `MODERATELY_ACTIVE` and `VERY_ACTIVE` minutes. However, a highly active minute is only credited if it occurs during a continuous streak of at least 10 minutes, allowing at most 2-minute gaps of lower activity."
          }
        ]
      },
      {
        "id": "sedentary-sleep",
        "heading": "Sedentary minutes and sleep",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Sedentary minutes don't include sleep time. In daily rollups, sedentary minutes are calculated by subtracting sleep minutes and active minutes (lightly active, moderately active, and very active) from the total minutes in the day (1,440 minutes):"
          },
          {"kind":"p","text":"`Sedentary Minutes = 1440 - Sleep Minutes - Lightly Active Minutes - Moderately Active Minutes - Very Active Minutes`"}
        ]
      },
      {
        "id": "body-mass-index",
        "heading": "Body Mass Index (BMI)",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Because the Google Health API does not expose a built-in BMI data type, applications must calculate Body Mass Index client-side using height and weight records:"
          },
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Retrieve the user's weight in grams from the `weightGrams` field in the Weight data type. Convert this to kilograms (divide by 1,000) or pounds (divide by 453.59237)."
              },
              {
                "text": "Retrieve the user's height in millimeters from the `heightMillimeters` field in the Height data type. Convert this to meters (divide by 1,000) or inches (divide by 25.4)."
              },
              {
                "text": "Use one of the following formulas to calculate the BMI value:",
                "sub": ["Metric formula: `BMI = weight (kg) / [height (m)]^2`","Imperial formula: `BMI = (weight (lbs) / [height (in)]^2) * 703`"]
              }
            ]
          },
          {"kind":"p","text":"The resulting BMI values correspond to the following categories:"},
          {
            "kind": "table",
            "caption": null,
            "head": ["Weight category","BMI range"],
            "rows": [["Underweight","Under 18.5"],["Healthy weight","18.5 to 24.9"],["Overweight","25 to 29.9"],["Obese","30 or higher"]]
          }
        ]
      },
      {
        "id": "basal-metabolic-rate",
        "heading": "Basal Metabolic Rate (BMR)",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Basal Metabolic Rate (BMR) is the minimum number of calories required for basic bodily functions at rest. Because the Google Health API does not expose a built-in BMR data type, applications must calculate it client-side using the Harris-Benedict formula. See the Harris–Benedict equation article on Wikipedia to learn more."
          },
          {"kind":"p","text":"To perform this calculation:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Retrieve the user's weight in grams from the `weightGrams` field in the Weight data type and convert to kilograms (divide by 1,000). To convert pounds to kilograms, divide by 2.2."
              },
              {
                "text": "Retrieve the user's height in millimeters from the `heightMillimeters` field in the Height data type and convert to centimeters (divide by 10). To convert inches to centimeters, multiply by 2.54."
              },
              {"text":"Retrieve the user's age in years from the `age` field in the Profile resource."},
              {
                "text": "Retrieve the biological sex independently (for example, by prompting the user or maintaining it in your own database), as the Google Health API does not expose this field."
              },
              {
                "text": "Use one of the following formulas based on the user's biological sex:",
                "sub": ["Men: `BMR = 66 + (13.7 x weight_kg) + (5 x height_cm) - (6.8 x age_years)`","Women: `BMR = 655 + (9.6 x weight_kg) + (1.8 x height_cm) - (4.7 x age_years)`"]
              }
            ]
          }
        ]
      },
      {
        "id": "tdee",
        "heading": "Total Daily Energy Expenditure (TDEE)",
        "level": 4,
        "blocks": [
          {
            "kind": "p",
            "text": "Total Daily Energy Expenditure (TDEE) is an estimation of the total number of calories a person burns in a day, which accounts for both BMR and physical activity. To estimate the user's TDEE, multiply the BMR value by an activity factor corresponding to their lifestyle:"
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["Activity level","Description","Multiplier"],
            "rows": [
              ["Sedentary","Little or no exercise.","`BMR x 1.2`"],
              ["Lightly active","1–3 days of exercise per week.","`BMR x 1.375`"],
              ["Moderately active","3–5 days of exercise per week.","`BMR x 1.55`"],
              ["Very active","6–7 days of exercise per week.","`BMR x 1.725`"],
              ["Extra active","Very hard exercise or physical job.","`BMR x 1.9`"]
            ]
          }
        ]
      },
      {
        "id": "endpoints",
        "heading": "Endpoints",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"The REST endpoints adopt a consistent syntax for all data types."},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Service Endpoint: The base HTTP URL changes to https://health.googleapis.com."},
              {
                "text": "Endpoint Syntax: The Google Health API supports a limited number of endpoints, which can be used by most of the supported data types. This provides consistent syntax for all data types and makes the endpoints easier to use."
              },
              {"text":"User Identifier: Either the user ID or me should be specified in the endpoint syntax. When using me, the user ID is inferred from the access token."}
            ]
          },
          {"kind":"p","text":"Example: Here's an example of the GET Profile endpoint called using the Google Health API"},
          {"kind":"p","text":"GET https://health.googleapis.com/v4/users/me/profile"}
        ]
      },
      {
        "id": "endpoint_mappings",
        "heading": "Endpoint mappings",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"See Google Health API data types table for a list of data types available and the API methods they support."},
          {
            "kind": "table",
            "caption": null,
            "head": ["Fitbit Web API Endpoint Type","Google Health API"],
            "rows": [
              ["GET (Log | Summary | Daily Summary) where you are requesting a single day of data","`dailyRollup` method with `windowSize` = 1 day"],
              ["GET (Intraday) where you are requesting granular data","`list` method"],
              ["GET (Time Series) by Date or Interval","`rollUp` or `dailyRollUp` method including a date range"],
              ["GET (Log List)","`list` method"],
              ["CREATE & UPDATE Logs","`patch` method"],
              ["DELETE Logs","`batchDelete` method"],
              ["GET Profile","`users.getProfile` returns the user's specific information\n`users.getSettings` returns the user's units and timezones"],
              ["UPDATE Profile","`users.updateProfile` modifies the user's specific information\n`users.updateSettings` modifies the user's units and timezones"],
              ["Get User ID","`users.getIdentity` returns the user's Fitbit legacy and Google user ID."],
              ["Get Devices","`users.pairedDevices` returns the list of paired devices"],
              ["Create Subscriptions","`projects.subscribers.subscriptions.create` manually creates a subscription"],
              ["Delete Subscriptions","`projects.subscribers.subscriptions.delete` delete a subscription"],
              ["Get Subscriptions List","`projects.subscribers.subscriptions.list` lists all subscriptions"]
            ]
          }
        ]
      }
    ]
  },
  "about": {
    "title": "About the Google Health API",
    "intro": [
      {
        "kind": "p",
        "text": "The Fitbit Web API has been improved and modernized to provide a more standardized, consistent, and scalable foundation for developer integrations, and is now called the Google Health API. The Google Health API represents the strategic evolution of the legacy Fitbit Web API, rebuilt from the ground up on Google's modern infrastructure."
      },
      {
        "kind": "p",
        "text": "With this platform, developers gain access to the full power of Google Cloud developer tooling and the convenience of a familiar, streamlined way for users to manage their permissions through Google OAuth 2.0."
      }
    ],
    "sections": [
      {
        "id": "what-you-get",
        "heading": "What do you get with the Google Health API?",
        "level": 2,
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Unified source of truth: Our new \"Reconciled Stream\" handles the complex task of reconciling overlapping data points from multiple sources. This ensures apps display the same consistent data users see within the Fitbit app. This stream will be provided in addition to our first party stream which includes data from Fitbit and Pixel devices, as well as manual entries."
              },
              {
                "text": "Technical modernization & performance: We have consolidated over 100 legacy endpoints down to a streamlined set of simplified data type bundles and eliminated inconsistencies in data formats, time zones, measurement units, and error handling. Furthermore, we now support the HTTP/REST protocol for high-performance data retrieval. Additionally, intraday data and webhooks are now available for all relevant data types through a dedicated list endpoint."
              },
              {
                "text": "Enhanced webhooks & scalability: Benefit from expanded webhook support, including auto-subscriptions and detailed management for all relevant data types, designed to scale with the next generation of AI-driven health apps."
              },
              {
                "text": "Streamlined identity & security: Replace legacy Fitbit Authorization (FOT) with Google OAuth 2.0. This allows developers to utilize standard Google authentication libraries, simplifying codebases while providing users with a familiar, centralized way to manage their permissions. All Google Health API scopes are categorized as Restricted, necessitating a privacy and security review for access."
              }
            ]
          },
          {"kind":"p","text":"Like what you see? Get started now!"}
        ]
      },
      {
        "id": "what-about-fitbit",
        "heading": "What about the Fitbit Web API?",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"The legacy Fitbit Web API is being turned down according to the following timeline:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "September 30, 2026 (End of support): Support for the Fitbit Web API ends. The API will continue to operate, but Google will no longer fix bugs or provide API support."
              },
              {
                "text": "November 2, 2026 (API turn-off): The Fitbit Web API and Fitbit OAuth endpoints will be turned off and will no longer function or sync data to or from Fitbit users. Requests to these endpoints will fail and return an HTTP `410 Gone` status code."
              }
            ]
          },
          {
            "kind": "p",
            "text": "All current integrations utilizing the Fitbit Web API and Fitbit Authorization must migrate their applications and users to the Google Health API and Google OAuth 2.0 as soon as possible to ensure uninterrupted data continuity."
          },
          {"kind":"p","text":"See the migration guide to get started."}
        ]
      },
      {
        "id": "device-support",
        "heading": "What devices are supported?",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "All Fitbit devices and Google Pixel watches, current and previous, will collect data that is returned through the Google Health API. The type of data available will depend on the functionality the devices support."
          },
          {"kind":"p","text":"The list of current devices can be found on the Google Store."}
        ]
      },
      {
        "id": "feedback",
        "heading": "How do I provide feedback?",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Your feedback is highly valued. We encourage you to share your thoughts through our support channels, which are listed on the Support page."
          },
          {
            "kind": "p",
            "text": "While we have gone to great lengths to ensure these APIs support you well, the Google Health API is actively evolving. Please be aware that based on your feedback, we may introduce changes between now and the end of May that would require corresponding updates on your end."
          }
        ]
      },
      {"id":"roadmap","heading":"Roadmap","level":2,"blocks":[{"kind":"p","text":"These are a list of features that are coming in 2026."}]},
      {
        "id": "q4_2026",
        "heading": "Q4 2026",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Data Types (read & write)"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Granular skin temperature"},
              {"text":"Basal Metabolic Rate"},
              {
                "text": "We'll be adding data types to reach parity with Health Connect. You can expect many more of the Health Connect data types to be added in Q4 2026 and Q1 2027."
              }
            ]
          },
          {"kind":"p","text":"Features"},
          {
            "kind": "list",
            "ordered": false,
            "items": [{"text":"Public beta channel for early access to new data types"},{"text":"Statistics endpoint to monitor webhooks telemetry"}]
          }
        ]
      }
    ]
  },
  "migration": {
    "title": "Overview",
    "intro": [
      {
        "kind": "p",
        "text": "The Google Health API is a comprehensive solution built from the ground up, providing developers with robust access to a wide array of consented user health data and diverse data types. The Google Health API utilizes a new console for registering your apps, Google OAuth 2.0, new data types, new endpoint schema, and a new response format."
      },
      {
        "kind": "p",
        "text": "This guide is designed to help developers migrate their existing Fitbit Web API apps to the new Google Health API. It features recommendations to ensure a seamless migration while retaining users."
      }
    ],
    "sections": [
      {
        "id": "why-migrate",
        "heading": "Why should you migrate?",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "This is not just an update, it's a strategic move to ensure your apps are secure and ready for future advancements in health technology. Some of the benefits of using the Google Health API are:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Access to Comprehensive Data: Gain robust access to a wide array of consented user health data and diverse data types."},
              {"text":"Enhanced Security: Compliance with Google's security best practices, aligning with Google's security, privacy, and identity standards."},
              {
                "text": "Consistency: Eliminates legacy inconsistencies in data formats, time zones, measurement units, and error handling for a more intuitive developer experience."
              },
              {"text":"Scalability & Future-Proofing: Designed to scale to meet future demands and supports modern protocols like gRPC."}
            ]
          },
          {
            "kind": "p",
            "text": "Transitioning from the Fitbit Web API to the Google Health API involves more than technical modifications. Because of the switch to a new OAuth library, existing access and refresh tokens cannot be transferred, requiring users to re-consent to your updated integration."
          }
        ]
      },
      {
        "id": "support_both_login_methods",
        "heading": "Support both login methods",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Since the Fitbit Web API and the Google Health API use different systems to handle user logins, while the Fitbit Web APIs are still active, your app will temporarily need to support both authentication methods across your user base."
          },
          {
            "kind": "note",
            "variant": "warning",
            "text": "Important — Prevent dual-linking: Supporting both login methods applies to your application backend as a whole, not to an individual user account. Never allow a single user to have both a legacy Fitbit Web API connection and a Google Health API connection active simultaneously (\"dual-linking\"). Completing the Google Health authorization flow must automatically disable legacy Fitbit syncing and revoke the user's legacy Fitbit tokens."
          },
          {
            "kind": "p",
            "text": "Instead of your app asking for data directly, implement a layer that decides whether to talk to the Fitbit Web API or Google Health API for a specific user, so the rest of your app doesn't need to worry about the details."
          },
          {"kind":"p","text":"Update your user database to include a flag (for example, `oauth_type`) to identify which login system they are using."},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"For new users: Automatically set them up with the new Google Health API (`oauth_type: google`)."},
              {"text":"For existing users: Keep them on the Fitbit Web API until they update their consent (`oauth_type: fitbit`)."}
            ]
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["User Scenario","`oauth_type` State","Active API Stream","Required Action"],
            "rows": [
              ["New user onboarding","`google`","Google Health API only","Launch Google OAuth in a system browser and map IDs with `users.getIdentity`."],
              [
                "Existing Fitbit user (not yet migrated)",
                "`fitbit`",
                "Fitbit Web API only",
                "Continue syncing with Fitbit Web API; display a dismissible in-app prompt to upgrade."
              ],
              [
                "Existing Fitbit user completing migration",
                "`fitbit` → `google`",
                "Cut over to Google Health API",
                "Verify granted scopes, call `users.getIdentity` (`legacyUserId` → `healthUserId`), switch `oauth_type` to `google`, and immediately revoke legacy Fitbit tokens."
              ]
            ]
          },
          {"kind":"p","text":"To avoid disrupting the user experience, we recommend not forcing everyone to log out and log back in. Instead:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "When a user who remains connected to the Fitbit Web APIs engages with your app, show them a friendly notification encouraging them to update their connection."
              },
              {"text":"When the user accepts the update action, trigger the Google Health login flow right then."},
              {
                "text": "Once the Google login is successful, save the new Google credentials to the user's profile, switch their `oauth_type` flag from `fitbit` to `google`, and immediately disable legacy syncing by programmatically revoking their legacy Fitbit tokens to prevent duplicate data ingestion and dual-linking."
              }
            ]
          }
        ]
      },
      {
        "id": "ensure-data-continuity",
        "heading": "Ensure data continuity",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "When transitioning an integration from the legacy Fitbit Web API to the Google Health API, developer applications must account for a change in user identification structures."
          },
          {
            "kind": "p",
            "text": "The legacy Fitbit Web API identifies accounts using a 6-character alphanumeric string (such as `A1B2C3`), whereas the Google Health API utilizes a `healthUserId` formatted as a string of up to 63 digits & characters."
          },
          {
            "kind": "p",
            "text": "To bridge this gap without losing user context, developers can query the `getIdentity` endpoint to get the Fitbit and Health user IDs. This endpoint returns a payload containing both the `legacyUserId` and the new `healthUserId`, enabling applications to dynamically create a mapping between existing records and the new account system."
          }
        ]
      },
      {
        "id": "handle-http-412",
        "heading": "Handle unlinked Google Accounts",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "A user must sign in to the Google Health mobile app to link Google Health to their Google Account before your app can sync data through the Google Health API. See Link Google Health before OAuth consent. Because Google OAuth 2.0 authenticates any valid Google Account during consent, it cannot block accounts that don't yet have an active Google Health profile."
          },
          {
            "kind": "p",
            "text": "If a user completes Google OAuth consent before creating a Google Health profile or before migrating their legacy Fitbit account to their Google Account, calling `users.getIdentity` or a data endpoint returns an HTTP `400 Bad Request` error with status `FAILED_PRECONDITION` and reason `ACCOUNT_NOT_LINKED`:"
          },
          {
            "kind": "code",
            "text": "{\n  \"error\": {\n    \"code\": 400,\n    \"message\": \"The account is not linked to Google Health.\",\n    \"status\": \"FAILED_PRECONDITION\",\n    \"details\": [\n      {\n        \"@type\": \"type.googleapis.com/google.rpc.ErrorInfo\",\n        \"reason\": \"ACCOUNT_NOT_LINKED\",\n        \"domain\": \"health.googleapis.com\",\n        \"metadata\": {\n          \"redirect_uri\": \"https://fitbit.google.com/auth/signup\"\n        }\n      }\n    ]\n  }\n}"
          },
          {"kind":"p","text":"To verify account access and handle this error:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Exchange the OAuth authorization code for tokens and immediately call `users.getIdentity` (`GET https://health.googleapis.com/v4/users/me/identity`) before marking the account as linked in your app UI."
              },
              {
                "text": "If `users.getIdentity` or a background data sync call returns HTTP `400` with reason `ACCOUNT_NOT_LINKED`, don't mark the account as connected. If the user is migrating from the legacy Fitbit Web API, keep their existing Fitbit connection active and don't revoke their legacy Fitbit tokens."
              },
              {
                "text": "Display an actionable prompt that addresses both new users who have never created a Google Health or Fitbit account and existing Fitbit users who have not yet migrated to a Google Account:\n\"Your Google Account isn't linked to Google Health yet. Open the Google Health mobile app and sign in with your Google Account to create a profile, or move your existing Fitbit account to your Google Account, then return here to connect.\""
              },
              {
                "text": "Provide a call-to-action button that opens the `redirect_uri` from the error metadata (`https://fitbit.google.com/auth/signup`) or direct legacy Fitbit users to the Fitbit account migration help article."
              }
            ]
          }
        ]
      },
      {
        "id": "backfill-historical-data",
        "heading": "Backfill historical data",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "If a user does not authenticate to the new Google Health API endpoints before the legacy endpoints are turned down, their data will still be available as long as they continue syncing their device to the Google Health app. However, you may have a gap in data for this user."
          },
          {
            "kind": "p",
            "text": "To backfill their data, once the user re-authenticates to the new endpoints, you can use our Google Health API to backfill their historical data. See Query historical data for guidance."
          }
        ]
      },
      {
        "id": "communication_and_timing",
        "heading": "Communication and timing",
        "level": 2,
        "blocks": [{"kind":"p","text":"To help your users move from their existing Fitbit OAuth to the new Google OAuth, follow these best practices."}]
      },
      {
        "id": "value-first_communication",
        "heading": "Value-first communication",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Don't lead with \"We updated our API\", lead with the benefits integrating Google Health data into your app but ensure they are aware that they need to re-authenticate if they want their data to sync:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Clearly explain what features are available in your app that are powered by the integration, and tailor your message to how a user benefits from those features."
              },
              {"text":"Focus on your features and provide use cases instead of technical implementation details."},
              {"text":"Don't say: \"You will not be able to connect to the Fitbit API.\""},
              {"text":"Do say: \"To continue seeing detailed workouts with heart rate data, re-consent to the Google Health APIs.\""}
            ]
          }
        ]
      },
      {
        "id": "when_to_notify_users",
        "heading": "When to notify users",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"In all user communications, adhere to the Google Health brand guidelines, and use dismissible banners, cards, or alerts."},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Don't trigger the re-consent screen while a user is in the middle of a workout or manually logging something."},
              {"text":"Only make the re-consent mandatory after several weeks of warnings, coinciding with the official Fitbit Web API deprecation deadlines."},
              {
                "text": "If a user has not re-consented after the hard cutoff, provide a graceful recovery path. Provide a help message in a banner, card or tooltip that helps them understand why their data is missing, and how to fix it."
              }
            ]
          }
        ]
      }
    ]
  },
  "rateLimits": {
    "title": "Quotas and Rate Limits",
    "intro": [
      {"kind":"p","text":"To ensure system stability and equitable resource distribution, the Google Health API enforces rate limits on incoming API requests."},
      {
        "kind": "p",
        "text": "While the default quotas are designed to accommodate the vast majority of standard use cases, applications that exceed these thresholds will be throttled."
      }
    ],
    "sections": [
      {
        "id": "handle_rate_limit_errors",
        "heading": "Handle Rate Limit Errors",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "When your application exceeds an allocated rate limit, the API rejects the request and returns the error `429 Too Many Requests`. To mitigate the error, your application should backoff sending requests and implement retry logic to gracefully handle rate-limiting events."
          }
        ]
      },
      {
        "id": "default_limits_and_impact_analysis",
        "heading": "Default Limits and Impact Analysis",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Rate limits are evaluated across daily, minutely, and per-user intervals. The impact analysis outlines how these quotas translate to Queries Per Second (QPS)."
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["Metric","Default Limit","QPS Impact Analysis"],
            "rows": [
              ["Per project (daily)","86.4M requests / day","~1,000 QPS sustained"],
              ["Per project (minutely)","120,000 requests / minute","~2,000 QPS burst"],
              ["Per user (minutely)","300 requests / minute","Standard: 5 QPS per user\nUnverified applications: Max 250 QPS total (capped at 100 users @ 2.5 QPS per user)"]
            ]
          }
        ]
      },
      {
        "id": "request_a_quota_increase",
        "heading": "Request a Quota Increase",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "If your application requires higher throughput than the default allocations provided, you can request an adjustment through the Google Cloud Console. See View and manage quotas."
          }
        ]
      }
    ]
  },
  "appVerification": {
    "title": "App verification",
    "intro": [
      {
        "kind": "p",
        "text": "If your app requests access to sensitive user data using restricted scopes, it must complete a verification process. Most scopes for the Google Health API are restricted, which means you must complete verification before your app is publicly available."
      },
      {"kind":"p","text":"During this process, Google verifies that your app complies with the API Services User Data Policy and any other applicable policies."},
      {
        "kind": "p",
        "text": "If your app isn't verified, it's limited to 100 users. To support more users, you must complete the verification process. This verification is separate from any app review process required by app stores like Google Play. An app that hasn't completed this verification might be listed on the Google Play store, but is still limited to 100 users. For more information, see OAuth App Verification Help Center"
      },
      {"kind":"p","text":"The verification process has two parts:"},
      {
        "kind": "list",
        "ordered": false,
        "items": [
          {
            "text": "OAuth app verification: Google's Trust and Safety team reviews your app's identity, scopes, and other information you provide in the Google Cloud console. See Verification Requirements for more information."
          },
          {"text":"Security assessment: Your application must undergo a third-party security assessment to ensure it handles user data securely."}
        ]
      }
    ],
    "sections": [
      {
        "id": "oauth_app_verification",
        "heading": "OAuth app verification",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "To prepare for verification, review and follow the OAuth 2.0 Restricted Scopes guide. This guide outlines the steps to prepare for and request verification in the Google Cloud console."
          },
          {
            "kind": "p",
            "text": "Be specific when explaining why your app needs each scope. Vague or duplicate justifications for different scopes can cause delays in the verification process."
          }
        ]
      },
      {
        "id": "in-app_disclosure_requirements",
        "heading": "In-app disclosure requirements",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"You must prominently disclose to your users how your app accesses, uses, and shares their health and fitness data."},
          {"kind":"p","text":"The in-app disclosure:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Must be within the app itself, not only in the app description or on a website."},
              {"text":"Must be displayed in the normal usage of the app and not require the user to navigate into a menu or settings."},
              {"text":"Must describe the data being accessed or collected."},
              {"text":"Must explain how the data is used or shared."},
              {"text":"Cannot only be placed in a privacy policy or terms of service."},
              {"text":"Cannot be included with other disclosures unrelated to Google Health API data collection."}
            ]
          },
          {
            "kind": "p",
            "text": "Here is a recommended format for the disclosure statement: \"{App name} collects health and fitness data to enable {feature}, {feature}, and {feature}.\""
          },
          {"kind":"p","text":"For example: \"Fitness Coach collects activity data to enable analytics and personalized coaching.\""}
        ]
      },
      {
        "id": "security_assessment_casa",
        "heading": "Security assessment (CASA)",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "In addition to OAuth verification, apps using restricted scopes must also complete an annual security assessment based on the Cloud App Security Assessment framework (CASA). Google's Trust and Safety team notifies you with instructions when this needs to be completed."
          },
          {
            "kind": "p",
            "text": "A third-party security firm performs this assessment to confirm that your app handles user data securely and can delete user data upon request. CASA uses the industry-recognized OWASP Application Security Verification Standard (ASVS). After you pass the assessment, your app receives a Letter of Validation (LOV) from the security assessor."
          },
          {"kind":"p","text":"For more details on the CASA program and to find authorized security assessors, visit the Cloud Application Security Assessment website."},
          {
            "kind": "p",
            "text": "If you have existing security certifications or recent penetration test results that align with accepted industry standards, you might be able to expedite the CASA process. CASA offers an Accelerator program that lets assessors use existing valid documentation from Accepted Security Frameworks to reduce redundant checks and potentially lower assessment costs."
          },
          {
            "kind": "p",
            "text": "Google accepts HITRUST, SOC 2, and ISO/IEC 27001 certifications that you have already completed. To use these certifications, you must still work with an authorized CASA assessor and provide your completed HITRUST, SOC 2, or ISO/IEC 27001 documentation. The CASA assessor checks off these certifications against their list of CASA requirements, which reduces the time required to complete the CASA assessment."
          },
          {
            "kind": "p",
            "text": "The security assessment can take 2-3 weeks for tier-2 applications and 4-6 weeks for tier-3 applications to complete and involves fees payable to the third-party assessor, ranging from $500 to $4,500 USD, depending on your app's complexity. Trust and Safety will tell the developer when to start the CASA process."
          },
          {"kind":"p","text":"After you get your Letter of Validation (LOV), submit the letter to Google's Trust and Safety team to complete your security assessment."}
        ]
      },
      {
        "id": "escalations",
        "heading": "Escalations",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "The CASA assessment is performed by a third party, and Google does not have control over this assessment process. Any issues with the assessment should be raised directly with your chosen security assessor."
          }
        ]
      }
    ]
  },
  "webhooks": {
    "title": "Webhook subscriptions",
    "intro": [
      {
        "kind": "p",
        "text": "The Google Health API allows your application to receive real-time notifications when a user's health data changes. Instead of polling for changes, your server receives an HTTPS POST request webhook as soon as data is available in the Google Health API."
      }
    ],
    "sections": [
      {
        "id": "supported-data-types",
        "heading": "Supported data types",
        "level": 2,
        "blocks": [{"kind":"p","text":"Webhook notifications are supported for the following data types:"}]
      },
      {
        "id": "notifications_scopes",
        "heading": "Notifications scopes",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Notifications are sent for these data types only when a user has granted consent for one of the corresponding scopes:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Activity, which covers active minutes, steps, altitude, distance, and floors data types:",
                "sub": ["`https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly`","`https://www.googleapis.com/auth/googlehealth.activity_and_fitness.writeonly`"]
              },
              {
                "text": "Health Metrics, which covers the weight data type:",
                "sub": [
                  "`https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly`",
                  "`https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.writeonly`"
                ]
              },
              {
                "text": "Sleep, which covers the sleep data type:",
                "sub": ["`https://www.googleapis.com/auth/googlehealth.sleep.readonly`","`https://www.googleapis.com/auth/googlehealth.sleep.writeonly`"]
              }
            ]
          }
        ]
      },
      {
        "id": "service-accounts",
        "heading": "IAM service accounts",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "While not required, we recommend using an IAM Service Account when configuring subscribers for the Google Health API. Service accounts provide better security for application workloads compared to standard user accounts through the following features:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Automated short-lived credentials: When attached to a Google Cloud execution environment (such as Compute Engine, Cloud Run, or Google Kubernetes Engine), service accounts automatically obtain and rotate secure, short-lived credentials. This removes the risks of managing and storing persistent static keys."
              },
              {
                "text": "Principle of least privilege: Service accounts provide dedicated identities for workloads. You can grant them only the specific permissions needed to manage subscriber endpoints, avoiding broader access to your Google Cloud resources."
              },
              {
                "text": "Lifecycle independence: Service accounts operate independently of any individual user's account, ensuring that personnel changes don't impact long-term authentication stability."
              }
            ]
          }
        ]
      },
      {
        "id": "cpe_roles",
        "heading": "CPE roles",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "To manage Google Health API Subscribers or Subscriptions, you must grant the appropriate role to the impersonated Service Account making the API calls. Depending on the level of access needed, assign one of the following roles:"
          },
          {"kind":"list","ordered":false,"items":[{"text":"Google Health API Read"},{"text":"Google Health API Editor"},{"text":"Google Health API Admin"}]},
          {"kind":"p","text":"Learn more about Google Health API IAM roles and permissions."}
        ]
      },
      {
        "id": "manage_subscribers",
        "heading": "Manage subscribers",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Before you can receive notifications, you must register a Subscriber, which represents your application's notification endpoint. You can manage subscribers using the REST API available at `projects.subscribers`."
          },
          {
            "kind": "p",
            "text": "Your subscriber endpoint must use HTTPS (TLSv1.2+) and be publicly accessible. During subscriber creation and updates, the Google Health API performs a verification challenge to ensure you own the endpoint URI. If verification fails, subscriber creation and update operations fail with a `FailedPreconditionException`."
          }
        ]
      },
      {
        "id": "create_a_subscriber",
        "heading": "Create a subscriber",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"To register a new subscriber for your project, use the `create` endpoint. You need to provide:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`project-id`: The project number where the webhook service account was created."},
              {
                "text": "`subscriberId`: A unique identifier that you provide for the subscriber. This ID must be between 4 and 36 characters, and match the regular expression (`[a-z]([a-z0-9-]{2,34}[a-z0-9])`)."
              },
              {"text":"`endpointUri`: The destination URL for webhook notifications."},
              {"text":"`subscriberConfigs`: The data types you want to receive notifications for, and the subscription policy for each."},
              {
                "text": "`endpointAuthorization`: The authorization mechanism for your endpoint. This must contain a `secret` that you provide. The value of `secret` is sent in the `Authorization` header with each notification message. You can use this token to verify that incoming requests are from the Google Health API. For example, you can set `secret` to `Bearer R4nd0m5tr1ng123` for Bearer authentication, or `Basic dXNlcjpwYXNzd29yZA==` for Basic authentication."
              }
            ]
          },
          {
            "kind": "p",
            "text": "In `subscriberConfigs` you must set `subscriptionCreatePolicy` for each data type. Set it to `AUTOMATIC` to use automatic subscriptions, or `MANUAL` if you intend to manage user subscriptions yourself. See automatic subscriptions and manual subscriptions for more details on each option."
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/projects/project-id/subscribers?subscriberId=subscriber-id\n{\n  \"endpointUri\": \"https://myapp.com/webhooks/health\",\n  \"subscriberConfigs\": [\n    {\n      \"dataTypes\": [\"steps\", \"altitude\", \"distance\", \"floors\", \"weight\"],\n      \"subscriptionCreatePolicy\": \"AUTOMATIC\"\n    },\n    {\n      \"dataTypes\": [\"sleep\"],\n      \"subscriptionCreatePolicy\": \"MANUAL\"\n    }\n  ],\n  \"endpointAuthorization\": {\n    \"secret\": \"Bearer example-secret-token\"\n  }\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"name\": \"projects/project-id/subscribers/subscriber-id\",\n  \"endpointUri\": \"https://myapp.com/webhooks/health\",\n  \"subscriberConfigs\": [\n    {\n      \"dataTypes\": [\"steps\", \"altitude\", \"distance\", \"floors\", \"weight\"],\n      \"subscriptionCreatePolicy\": \"AUTOMATIC\"\n    },\n    {\n      \"dataTypes\": [\"sleep\"],\n      \"subscriptionCreatePolicy\": \"MANUAL\"\n    }\n  ]\n}"
          }
        ]
      },
      {
        "id": "list_subscribers",
        "heading": "List subscribers",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Use the `list` endpoint to retrieve all subscribers registered for your project."},
          {"kind":"label","text":"Request"},
          {"kind":"code","text":"GET https://health.googleapis.com/v4/projects/project-id/subscribers"},
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"subscribers\": [\n    {\n      \"name\": \"projects/project-id/subscribers/subscriber-id\",\n      \"endpointUri\": \"https://myapp.com/webhooks/health\",\n      \"subscriberConfigs\": [\n        {\n          \"dataTypes\": [\"steps\", \"altitude\", \"distance\", \"floors\", \"weight\"],\n          \"subscriptionCreatePolicy\": \"AUTOMATIC\"\n        },\n        {\n          \"dataTypes\": [\"sleep\"],\n          \"subscriptionCreatePolicy\": \"MANUAL\"\n        }\n      ],\n      \"endpointAuthorization\": {\n        \"authorizationTokenSet\": true\n      }\n    }\n  ],\n  \"totalSize\": 1\n}"
          }
        ]
      },
      {
        "id": "update_a_subscriber",
        "heading": "Update a subscriber",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Use the `patch` endpoint to update a subscriber in your project. The fields that can be updated are `endpointUri`, `subscriberConfigs`, and `endpointAuthorization`."
          },
          {
            "kind": "p",
            "text": "You update fields by providing an `updateMask` query parameter and a request body. The `updateMask` must contain a comma-separated list of field names that you want to update, using camel case for field names (for example, `endpointUri`). The request body must contain a partial Subscriber object with the new values for fields you want to update. Only fields specified in `updateMask` are updated. If you provide fields in the request body that are not in `updateMask`, they are ignored."
          },
          {"kind":"p","text":"If you update `endpointUri` or `endpointAuthorization`, endpoint verification is performed. See Endpoint verification for details."},
          {
            "kind": "p",
            "text": "When updating `subscriberConfigs`, note that it's a full replacement, not a merge. If `subscriberConfigs` is included in `updateMask`, all stored configurations for that subscriber are overwritten with list provided in request body. To add or remove a configuration, you must provide the complete set of configurations. If you are updating other fields and want to keep your current configurations, omit `subscriberConfigs` from `updateMask`."
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "PATCH https://health.googleapis.com/v4/projects/project-id/subscribers/subscriber-id?updateMask=endpointUri\n{\n  \"endpointUri\": \"https://myapp.com/new-webhooks/health\"\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"name\": \"projects/project-id/subscribers/subscriber-id\",\n  \"endpointUri\": \"https://myapp.com/new-webhooks/health\",\n  \"subscriberConfigs\": [\n    {\n      \"dataTypes\": [\"steps\", \"altitude\", \"distance\", \"floors\", \"weight\"],\n      \"subscriptionCreatePolicy\": \"AUTOMATIC\"\n    },\n    {\n      \"dataTypes\": [\"sleep\"],\n      \"subscriptionCreatePolicy\": \"MANUAL\"\n    }\n  ]\n}"
          }
        ]
      },
      {
        "id": "delete_a_subscriber",
        "heading": "Delete a subscriber",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Use the `delete` endpoint to remove a subscriber from your project. Once deleted, the subscriber will no longer receive notifications."},
          {"kind":"label","text":"Request"},
          {"kind":"code","text":"DELETE https://health.googleapis.com/v4/projects/project-id/subscribers/subscriber-id"},
          {"kind":"label","text":"Response"},
          {"kind":"p","text":"An empty response body with HTTP status `200 OK` is returned if deletion is successful."},
          {"kind":"code","text":"{}"}
        ]
      },
      {
        "id": "endpoint_verification",
        "heading": "Endpoint verification",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "To ensure the security and reliability of your notification delivery, the Google Health API performs a mandatory two-step verification handshake whenever you create a subscriber or update its endpoint configuration (`endpointUri` or `endpointAuthorization`). This process is performed synchronously during the API call. The service sends two automated POST requests to your endpoint URI, using the User-Agent `Google-Health-API-Webhooks`, with the JSON body `{\"type\": \"verification\"}`."
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Authorized Handshake: The first request is sent with your configured `Authorization` header. Your server must respond with a `200 OK` or `201 Created` status."
              },
              {"text":"Unauthorized Challenge: The second request is sent without credentials. Your server must respond with a `401 Unauthorized` or `403 Forbidden` status."}
            ]
          },
          {
            "kind": "p",
            "text": "This handshake confirms that your endpoint is active and correctly enforcing security. If either step fails, the API request fails with a `FAILED_PRECONDITION` error. Only after this handshake succeeds is your subscriber saved and activated to receive health data notifications."
          }
        ]
      },
      {
        "id": "key_rotation",
        "heading": "Key rotation",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"If you need to rotate keys for `endpointAuthorization`, follow these steps:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {"text":"Configure your endpoint to accept both old and new `endpointAuthorization` values."},
              {"text":"Update the subscriber configuration with new `endpointAuthorization` value using a `patch` request with `?updateMask=endpointAuthorization`."},
              {"text":"Configure your endpoint to accept only new `endpointAuthorization` value after confirming step 2 was successful."}
            ]
          }
        ]
      },
      {
        "id": "user_subscriptions",
        "heading": "User subscriptions",
        "level": 2,
        "blocks": [{"kind":"p","text":"The Google Health API helps you manage user subscriptions efficiently, reducing the need for manual registration during user onboarding."}]
      },
      {
        "id": "automatic_subscriptions",
        "heading": "Automatic subscriptions",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "We recommend using automatic subscriptions. To enable this feature, set `subscriptionCreatePolicy` to `AUTOMATIC` in your `subscriberConfigs` for the specific data types. The `dataTypes` you specify with an `AUTOMATIC` policy are the same data types for which the Google Health API sends notifications, provided user consent is also granted for those data types."
          },
          {
            "kind": "p",
            "text": "When a user grants application consent for scopes that correspond to data types with an `AUTOMATIC` policy, the Google Health API automatically tracks and sends out notifications for the data types resulting from the intersection between user consented data types and the automatic subscriber config data types for that user. Notifications are then sent to your endpoint whenever that user generates new data for those types. This works for users who grant consent either before or after you create the subscriber. Notifications are not backfilled for data generated before the subscriber was created."
          },
          {
            "kind": "p",
            "text": "If a user revokes consent, notifications for the corresponding data types will stop. Automatic subscriptions are managed by Google and cannot be listed or deleted individually; they are removed only when the parent subscriber is deleted."
          }
        ]
      },
      {
        "id": "manual_subscriptions",
        "heading": "Manual subscriptions",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "If your subscriber is configured with a MANUAL `subscription_create_policy` for specific data types, you must explicitly create and manage subscriptions for each user. A Subscription links a specific user to your subscriber endpoint for a defined set of data types. Developers can use specific APIs to:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Create (manual) subscriptions per `healthUserId` - Creates a new subscription for a specific user. This method requires the subscriber to have a `SubscriptionCreatePolicy` set to `MANUAL` for the requested data types."
              },
              {"text":"Update (manual) subscription - Updates the data types for an existing user subscription."},
              {
                "text": "Delete (manual) subscription - Deletes a specific user subscription. Once deleted, your subscriber endpoint will no longer receive notifications for this user for the associated data types."
              },
              {"text":"List (manual) subscriptions - Lists all active subscriptions for a given subscriber. You can filter the results by user or data type."}
            ]
          }
        ]
      },
      {
        "id": "notifications",
        "heading": "Notifications",
        "level": 2,
        "blocks": [{"kind":"p","text":"When a user's data changes for a subscribed data type, the Google Health API sends an HTTPS POST request to the subscriber endpoint URL."}]
      },
      {
        "id": "notification-format",
        "heading": "Notification format",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "The notification payload contains details about the data change, including the user ID, data type, and time intervals, which you can use to query the updated data. When multiple updates occur or updates are aggregated, notifications are batched together and delivered as a JSON array of notification objects."
          },
          {
            "kind": "p",
            "text": "When a webhook notification is triggered, the Google Health API sends an HTTPS POST request to your subscriber endpoint with the following format:"
          },
          {"kind":"label","text":"Upsert (time-series data)"},
          {
            "kind": "code",
            "text": "POST https://your-endpoint-uri\nAuthorization: Bearer example-secret-token\nGOOGLE-HEALTH-API-SIGNATURE: signature-value\nContent-Type: application/json\n\n{\n  \"data\": {\n    \"version\": \"1\",\n    \"clientProvidedSubscriptionName\": \"subscription-name\",\n    \"healthUserId\": \"health-user-id\",\n    \"operation\": \"UPSERT\",\n    \"dataType\": \"steps\",\n    \"intervals\": [\n      {\n        \"physicalTimeInterval\": {\n          \"startTime\": \"2026-03-08T01:29:00Z\",\n          \"endTime\": \"2026-03-08T01:34:00Z\"\n        },\n        \"civilDateTimeInterval\": {\n          \"startDateTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 3,\n              \"day\": 7\n            },\n            \"time\": {\n              \"hours\": 17,\n              \"minutes\": 29\n            }\n          },\n          \"endDateTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 3,\n              \"day\": 7\n            },\n            \"time\": {\n              \"hours\": 17,\n              \"minutes\": 34\n            }\n          }\n        },\n        \"civilIso8601TimeInterval\": {\n          \"startTime\": \"2026-03-07T17:29:00\",\n          \"endTime\": \"2026-03-07T17:34:00\"\n        }\n      }\n    ]\n  }\n}"
          },
          {"kind":"label","text":"Delete (time-series data)"},
          {
            "kind": "code",
            "text": "POST https://your-endpoint-uri\nAuthorization: Bearer example-secret-token\nGOOGLE-HEALTH-API-SIGNATURE: signature-value\nContent-Type: application/json\n\n[\n  {\n    \"data\": {\n      \"version\": \"1\",\n      \"clientProvidedSubscriptionName\": \"subscription-name\",\n      \"healthUserId\": \"health-user-id\",\n      \"operation\": \"DELETE\",\n      \"dataType\": \"steps\",\n      \"intervals\": [\n        {\n          \"physicalTimeInterval\": {\n            \"startTime\": \"2026-08-12T12:00:00Z\",\n            \"endTime\": \"2026-08-12T12:30:00Z\"\n          },\n          \"civilIso8601TimeInterval\": {\n            \"startTime\": \"2026-08-12T12:00:00\",\n            \"endTime\": \"2026-08-12T12:30:00\"\n          }\n        }\n      ]\n    }\n  }\n]"
          },
          {"kind":"label","text":"Delete (identifiable data)"},
          {
            "kind": "code",
            "text": "POST https://your-endpoint-uri\nAuthorization: Bearer example-secret-token\nGOOGLE-HEALTH-API-SIGNATURE: signature-value\nContent-Type: application/json\n\n{\n  \"data\": {\n    \"version\": \"1\",\n    \"clientProvidedSubscriptionName\": \"subscription-name\",\n    \"healthUserId\": \"health-user-id\",\n    \"operation\": \"DELETE\",\n    \"dataType\": \"sleep\",\n    \"intervals\": [\n      {\n        \"physicalTimeInterval\": {\n          \"startTime\": \"2026-08-12T22:00:00Z\",\n          \"endTime\": \"2026-08-13T06:00:00Z\"\n        },\n        \"civilIso8601TimeInterval\": {\n          \"startTime\": \"2026-08-12T22:00:00\",\n          \"endTime\": \"2026-08-13T06:00:00\"\n        }\n      }\n    ],\n    \"recordId\": \"9875412\"\n  }\n}"
          },
          {"kind":"label","text":"Batch (multiple users and data types)"},
          {
            "kind": "code",
            "text": "POST https://your-endpoint-uri\nAuthorization: Bearer example-secret-token\nGOOGLE-HEALTH-API-SIGNATURE: signature-value\nContent-Type: application/json\n\n[\n  {\n    \"data\": {\n      \"version\": \"1\",\n      \"clientProvidedSubscriptionName\": \"auto-project-number-subscriber-id-WEBHOOK_DATA_TYPE_STEPS\",\n      \"healthUserId\": \"health-user-id-1\",\n      \"operation\": \"UPSERT\",\n      \"dataType\": \"steps\",\n      \"intervals\": [\n        {\n          \"physicalTimeInterval\": {\n            \"startTime\": \"2026-03-08T01:29:00Z\",\n            \"endTime\": \"2026-03-08T01:34:00Z\"\n          },\n          \"civilDateTimeInterval\": {\n            \"startDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 3,\n                \"day\": 7\n              },\n              \"time\": {\n                \"hours\": 17,\n                \"minutes\": 29\n              }\n            },\n            \"endDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 3,\n                \"day\": 7\n              },\n              \"time\": {\n                \"hours\": 17,\n                \"minutes\": 34\n              }\n            }\n          },\n          \"civilIso8601TimeInterval\": {\n            \"startTime\": \"2026-03-07T17:29:00\",\n            \"endTime\": \"2026-03-07T17:34:00\"\n          }\n        }\n      ]\n    }\n  },\n  {\n    \"data\": {\n      \"version\": \"1\",\n      \"clientProvidedSubscriptionName\": \"auto-project-number-subscriber-id-WEBHOOK_DATA_TYPE_WEIGHT\",\n      \"healthUserId\": \"health-user-id-1\",\n      \"operation\": \"UPSERT\",\n      \"dataType\": \"weight\",\n      \"intervals\": [\n        {\n          \"physicalTimeInterval\": {\n            \"startTime\": \"2026-03-07T15:14:00Z\",\n            \"endTime\": \"2026-03-07T15:16:00Z\"\n          },\n          \"civilDateTimeInterval\": {\n            \"startDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 3,\n                \"day\": 7\n              },\n              \"time\": {\n                \"hours\": 7,\n                \"minutes\": 14\n              }\n            },\n            \"endDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 3,\n                \"day\": 7\n              },\n              \"time\": {\n                \"hours\": 7,\n                \"minutes\": 16\n              }\n            }\n          },\n          \"civilIso8601TimeInterval\": {\n            \"startTime\": \"2026-03-07T07:14:00\",\n            \"endTime\": \"2026-03-07T07:16:00\"\n          }\n        }\n      ]\n    }\n  },\n  {\n    \"data\": {\n      \"version\": \"1\",\n      \"clientProvidedSubscriptionName\": \"auto-project-number-subscriber-id-WEBHOOK_DATA_TYPE_STEPS\",\n      \"healthUserId\": \"health-user-id-2\",\n      \"operation\": \"UPSERT\",\n      \"dataType\": \"steps\",\n      \"intervals\": [\n        {\n          \"civilDateTimeInterval\": {\n            \"startDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 8,\n                \"day\": 20\n              },\n              \"time\": {\n                \"hours\": 0,\n                \"minutes\": 0\n              }\n            },\n            \"endDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 8,\n                \"day\": 21\n              },\n              \"time\": {\n                \"hours\": 0,\n                \"minutes\": 0\n              }\n            }\n          },\n          \"civilIso8601TimeInterval\": {\n            \"startTime\": \"2026-08-20T00:00:00\",\n            \"endTime\": \"2026-08-21T00:00:00\"\n          }\n        }\n      ]\n    }\n  },\n  {\n    \"data\": {\n      \"version\": \"1\",\n      \"clientProvidedSubscriptionName\": \"subscription-name\",\n      \"healthUserId\": \"health-user-id-2\",\n      \"operation\": \"UPSERT\",\n      \"dataType\": \"sleep\",\n      \"intervals\": [\n        {\n          \"physicalTimeInterval\": {\n            \"startTime\": \"2026-08-12T22:00:00Z\",\n            \"endTime\": \"2026-08-13T06:00:00Z\"\n          },\n          \"civilDateTimeInterval\": {\n            \"startDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 8,\n                \"day\": 12\n              },\n              \"time\": {\n                \"hours\": 22,\n                \"minutes\": 0\n              }\n            },\n            \"endDateTime\": {\n              \"date\": {\n                \"year\": 2026,\n                \"month\": 8,\n                \"day\": 13\n              },\n              \"time\": {\n                \"hours\": 6,\n                \"minutes\": 0\n              }\n            }\n          },\n          \"civilIso8601TimeInterval\": {\n            \"startTime\": \"2026-08-12T22:00:00\",\n            \"endTime\": \"2026-08-13T06:00:00\"\n          }\n        }\n      ],\n      \"recordId\": \"9875412\"\n    }\n  }\n]"
          },
          {"kind":"p","text":"The `operation` field indicates the type of change that triggered the notification:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`UPSERT`: Sent for any data addition or modification."},
              {
                "text": "`DELETE`: Sent when a user explicitly deletes data (such as deleting `dataPoints` using the Fitbit app or performing a batch delete using the API). Webhook notifications are not sent for system-level deletion events, such as a user revoking application permissions or deleting their Fitbit account."
              }
            ]
          },
          {
            "kind": "p",
            "text": "We recommend making your notification handling logic idempotent, especially for `UPSERT` operations, as retries can cause duplicate notifications to be sent."
          },
          {"kind":"p","text":"The `clientProvidedSubscriptionName` field is a unique identifier:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "For subscriptions with a `MANUAL` policy, this field contains the persistent, developer-provided subscription name specified when the subscription is created. This provides a stable ID for managing manual subscriptions."
              },
              {
                "text": "For subscriptions created with an `AUTOMATIC` policy, the Google Health API automatically generates and assigns an identifier in the format: `auto-<project-number>-<subscriber-id>-<WEBHOOK_DATA_TYPE_TOKEN>`, where:",
                "sub": [
                  "`<project-number>` is the developer's Google Cloud project number (for example, `362978535920`).",
                  "`<subscriber-id>` is the subscriber's registration ID / subscriber name (for example, `google-health-sync`).",
                  "`<WEBHOOK_DATA_TYPE_TOKEN>` is the token representing the specific data type. See Vocabulary of webhook data type tokens for all possible tokens."
                ]
              }
            ]
          },
          {
            "kind": "p",
            "text": "Including `clientProvidedSubscriptionName` for both manual and automatic policies ensures a consistent notification payload format across all subscription types."
          }
        ]
      },
      {
        "id": "user-id-mapping",
        "heading": "User ID mapping",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "The `healthUserId` is a Google Health API identifier for the user whose data has changed. If your application supports multiple users, you can receive notifications for any user who has granted your application consent. When you receive a notification, use `healthUserId` to identify which user's data has changed, so you can use their OAuth credentials to query their data."
          },
          {
            "kind": "p",
            "text": "To map a user's OAuth credentials to their `healthUserId`, use the `getIdentity` endpoint. Call this endpoint with a user's credentials during user onboarding to retrieve their `healthUserId`, and store this mapping. This mapping doesn't change over time, so it can be cached indefinitely. For an example, see Get user ID. This lets you select the correct user credentials when querying data based on the `healthUserId` in a notification."
          }
        ]
      },
      {
        "id": "time-intervals",
        "heading": "Time intervals",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"The `intervals` array contains one or more objects representing the time intervals for the modified data:"},
          {
            "kind": "table",
            "caption": null,
            "head": ["Field","Type","Required","Description"],
            "rows": [
              [
                "`physicalTimeInterval`",
                "`object`",
                "No",
                "The UTC physical time interval of the modified data (`YYYY-MM-DDTHH:MM:SSZ` format). Populated for intraday metrics; omitted for daily rollups and full-day activities."
              ],
              ["`civilDateTimeInterval`","`object`","Yes","The civil (local) calendar date and time interval of the modified data, without UTC or timezone offsets."],
              [
                "`civilIso8601TimeInterval`",
                "`object`",
                "Yes",
                "The civil (local) time interval represented as an ISO 8601 string (`YYYY-MM-DDTHH:MM:SS` format) without UTC or timezone offsets."
              ]
            ]
          },
          {
            "kind": "p",
            "text": "For full-day activities and daily aggregates, the `physicalTimeInterval` field is intentionally omitted from the notification payload. This is because full-day events are bucketed by their nominal civil date, and physical time durations can be inaccurate when crossing timezones. When processing full-day events, you should rely on the `civilDateTimeInterval` or `civilIso8601TimeInterval` fields as a best practice. For details on how to query these data points using civil time filters, see Filter data by an interval civil start time."
          },
          {"kind":"p","text":"The following is an example notification payload for a full-day activity where the `physicalTimeInterval` field is omitted:"},
          {
            "kind": "code",
            "text": "{\n  \"data\": {\n    \"version\": \"1\",\n    \"clientProvidedSubscriptionName\": \"auto-503461148219-lindasubscriber-WEBHOOK_DATA_TYPE_STEPS\",\n    \"healthUserId\": \"343864966078399341\",\n    \"operation\": \"UPSERT\",\n    \"dataType\": \"steps\",\n    \"intervals\": [\n      {\n        \"civilDateTimeInterval\": {\n          \"startDateTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 7,\n              \"day\": 14\n            },\n            \"time\": {}\n          },\n          \"endDateTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 7,\n              \"day\": 15\n            },\n            \"time\": {}\n          }\n        },\n        \"civilIso8601TimeInterval\": {\n          \"startTime\": \"2026-07-14T00:00:00\",\n          \"endTime\": \"2026-07-15T00:00:00\"\n        }\n      }\n    ]\n  }\n}"
          }
        ]
      },
      {
        "id": "dataTypeTokens",
        "heading": "Vocabulary of webhook data type tokens",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "When using an `AUTOMATIC` policy, the generated `clientProvidedSubscriptionName` contains one of the following capitalized `WEBHOOK_DATA_TYPE_*` suffix tokens depending on the data type:"
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["Webhook Data Type Token","Corresponding Data Type"],
            "rows": [
              ["`WEBHOOK_DATA_TYPE_ACTIVE_MINUTES`","`active-minutes`"],
              ["`WEBHOOK_DATA_TYPE_ACTIVE_ZONE_MINUTES`","`active-zone-minutes`"],
              ["`WEBHOOK_DATA_TYPE_ACTIVITY_LEVEL`","`activity-level`"],
              ["`WEBHOOK_DATA_TYPE_ALTITUDE`","`altitude`"],
              ["`WEBHOOK_DATA_TYPE_BLOOD_GLUCOSE`","`blood-glucose`"],
              ["`WEBHOOK_DATA_TYPE_BODY_FAT`","`body-fat`"],
              ["`WEBHOOK_DATA_TYPE_CALORIES_IN_HEART_RATE_ZONE`","`calories-in-heart-rate-zone`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_VARIABILITY`","`daily-heart-rate-variability`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_HEART_RATE_ZONES`","`daily-heart-rate-zones`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_OXYGEN_SATURATION`","`daily-oxygen-saturation`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_RESPIRATORY_RATE`","`daily-respiratory-rate`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_RESTING_HEART_RATE`","`daily-resting-heart-rate`"],
              ["`WEBHOOK_DATA_TYPE_DAILY_SLEEP_TEMPERATURE_DERIVATIONS`","`daily-sleep-temperature-derivations`"],
              ["`WEBHOOK_DATA_TYPE_DISTANCE`","`distance`"],
              ["`WEBHOOK_DATA_TYPE_EXERCISE`","`exercise`"],
              ["`WEBHOOK_DATA_TYPE_FLOORS`","`floors`"],
              ["`WEBHOOK_DATA_TYPE_HEART_RATE`","`heart-rate`"],
              ["`WEBHOOK_DATA_TYPE_HEART_RATE_VARIABILITY`","`heart-rate-variability`"],
              ["`WEBHOOK_DATA_TYPE_HEIGHT`","`height`"],
              ["`WEBHOOK_DATA_TYPE_HYDRATION_LOG`","`hydration-log`"],
              ["`WEBHOOK_DATA_TYPE_NUTRITION_LOG`","`nutrition-log`"],
              ["`WEBHOOK_DATA_TYPE_RESPIRATORY_RATE_SLEEP_SUMMARY`","`respiratory-rate-sleep-summary`"],
              ["`WEBHOOK_DATA_TYPE_RUN_VO2_MAX`","`run-vo2-max`"],
              ["`WEBHOOK_DATA_TYPE_SEDENTARY_PERIOD`","`sedentary-period`"],
              ["`WEBHOOK_DATA_TYPE_SLEEP`","`sleep`"],
              ["`WEBHOOK_DATA_TYPE_STEPS`","`steps`"],
              ["`WEBHOOK_DATA_TYPE_TIME_IN_HEART_RATE_ZONE`","`time-in-heart-rate-zone`"],
              ["`WEBHOOK_DATA_TYPE_WEIGHT`","`weight`"],
              ["`WEBHOOK_DATA_TYPE_USER_DELETED`","`user-deleted` (system event)"],
              ["`WEBHOOK_DATA_TYPE_USER_REVOKED_ACCESS`","`user-revoked-access` (system event)"]
            ]
          }
        ]
      },
      {
        "id": "aggregation-of-updates",
        "heading": "Aggregation of updates",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To minimize network traffic, the Google Health API batches messages together. The system is configured to send out a maximum of 99 messages per batch, which are automatically pushed as they become available."
          },
          {
            "kind": "p",
            "text": "When messages are batched, the payload is delivered as a JSON array containing multiple notification objects. A single batch can include updates for multiple users across multiple subscribed data types. For an example payload, see the Batch (multiple users and data types) example in the Notification format section."
          }
        ]
      },
      {
        "id": "respond_to_a_notification",
        "heading": "Respond to a notification",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Your server must validate the `Authorization` header, handle the synchronous endpoint verification handshake, and respond to data change notifications with an HTTP `204 No Content` status code immediately. To avoid timeouts, process the notification payload asynchronously after sending the response. If the Google Health API receives any other status code or the request times out, it retries sending the notification later."
          },
          {"kind":"p","text":"Node.js (Express) Example:"},
          {
            "kind": "code",
            "text": "app.post('/webhook-receiver', (req, res) => {\n    if (req.headers.authorization !== EXPECTED_SECRET) {\n        return res.status(401).send();\n    }\n    if (req.body && !Array.isArray(req.body) && req.body.type === 'verification') {\n        return res.status(200).send();\n    }\n\n    // 1. Immediately acknowledge the notification batch\n    res.status(204).send();\n\n    // 2. Normalize single-object or batched array notifications and reconcile asynchronously\n    const notifications = Array.isArray(req.body) ? req.body : [req.body];\n    setImmediate(async () => {\n        for (const notification of notifications) {\n            const { healthUserId, dataType, intervals = [] } = notification.data || {};\n            console.log(`Update for user ${healthUserId} of type ${dataType}`);\n            // Query /v4/users/${healthUserId}/dataTypes/${dataType}/dataPoints:reconcile?filter=...\n            // for each interval in `intervals` (using >= and < comparators; for sleep, filter on\n            // sleep.interval.end_time or sleep.interval.civil_end_time).\n        }\n    });\n});"
          },
          {
            "kind": "p",
            "text": "To fetch the updated data for each notified interval, call the `reconcile` endpoint with a filter for the interval's time range. This automatically deduplicates overlapping intervals from connected devices. For details and examples, see Get a reconciled view of interval data."
          },
          {"kind":"p","text":"There are three common strategies for updating your database after receiving a data change notification:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Queuing (recommended): Place the incoming notifications into a message queue and process them off the queue based on system resources."},
              {"text":"Immediate retrieval: Direct your backend to immediately call the Google Health API to fetch the updated data and commit it to your database."},
              {
                "text": "Lazy updates: Mark the user's local database records as dirty and only fetch the updated data from the Google Health API when the user next visits your application."
              }
            ]
          },
          {
            "kind": "p",
            "text": "The queueing strategy lets you process data in near real-time while remaining resilient to a flood of notifications (for example, if a service outage causes a backlog of notifications to be delivered all at once). While you can choose to process these queues on a long-interval batch schedule (for example, every 3 hours) to save resources, the drawback is that users typically expect to see their data updated in near real-time."
          }
        ]
      },
      {
        "id": "best-practices",
        "heading": "Best practices",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Follow these best practices to ensure reliable and efficient handling of data updates:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Use the Subscription API: Use the Subscription API to be notified when a user has new data to download rather than polling endpoints."},
              {
                "text": "Queue and process notifications separately: When receiving subscription notifications, place them into a queue and process them separately based on your system's resources. Keep the webhook endpoint lightweight by acknowledging the request immediately."
              }
            ]
          }
        ]
      },
      {
        "id": "signature_verification",
        "heading": "Signature verification",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To ensure the authenticity of Webhooks notifications, the raw JSON payload of every outgoing webhook notification is signed with a private key using Tink's PublicKeySign, providing the Base64-encoded signature in the `GOOGLE-HEALTH-API-SIGNATURE` HTTP header in the request. These signing keys are automatically rotated every 30 days, and the corresponding official public keyset is distributed as a JSON file at the permanent URL https://www.gstatic.com/googlehealthapi/webhooks/webhooks_public_keyset.json."
          }
        ]
      },
      {
        "id": "how_to_verify_the_signature",
        "heading": "How to verify the signature",
        "level": 4,
        "blocks": [
          {
            "kind": "p",
            "text": "Using Tink (Recommended): Developers can verify the signature using Tink's PublicKeyVerify primitive. Fetch the public keyset from the permanent URL, instantiate the PublicKeyVerify primitive with the keyset, and verify the decoded `GOOGLE-HEALTH-API-SIGNATURE` header against the raw webhook JSON payload."
          },
          {"kind":"p","text":"Manual Verification (Without Tink): If developers choose not to use Tink, they can manually verify the signature by following these steps:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Base64-decodes the `GOOGLE-HEALTH-API-SIGNATURE` header to separate the 5-byte Tink prefix (which contains a 1-byte version prefix and a 4-byte keyId) from the actual DER-encoded signature."
              },
              {"text":"Fetch the JSON keyset from https://www.gstatic.com/googlehealthapi/webhooks/webhooks_public_keyset.json."},
              {"text":"Locate the key matching the parsed keyId and Base64-decode its value field, which contains a serialized EcdsaPublicKey Protocol Buffer."},
              {"text":"Extract the big-endian x and y coordinates (Protobuf tags 3 and 4) from this binary payload."},
              {"text":"Instantiate a standard ECDSA P-256 public key in a built-in cryptography library using the extracted x and y coordinates."},
              {"text":"Verify the raw webhook JSON payload against the extracted DER signature using the SHA-256 algorithm."}
            ]
          }
        ]
      },
      {
        "id": "subscriber_status_and_recovery",
        "heading": "Subscriber status and recovery",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "If your subscriber endpoint becomes unavailable or returns an error status code (anything other than `204`), the Google Health API stores pending notifications for up to 7 days and retries delivery with exponential backoff."
          },
          {
            "kind": "p",
            "text": "Once your endpoint is back online and responds with `204`, the API automatically delivers the backlog of stored messages. Notifications older than 7 days are discarded and cannot be recovered."
          },
          {
            "kind": "note",
            "variant": "tip",
            "text": "Tip: Have questions about the content on this page? Use the AI assistance and developer tools to get explanations and clarify your understanding. See AI assistance and developer tools to learn more."
          }
        ]
      },
      {
        "id": "common_errors",
        "heading": "Common errors",
        "level": 2,
        "blocks": [
          {
            "kind": "table",
            "caption": null,
            "head": ["Error code","Message","Description","Recommendation"],
            "rows": [
              [
                "400 Bad Request",
                "Invalid project number in resource name",
                "When deleting or updating a subscriber using your Google Cloud project ID in the request URL instead of project number. This applies to webhook subscriptions using the `projects.subscribers` endpoint.",
                "Use your Google Cloud project number in the request URL, not the project ID."
              ],
              [
                "403 Forbidden",
                "The caller does not have permission",
                "When creating or listing subscribers using your Google Cloud project ID in the request URL instead of project number. This applies to webhook subscriptions using the `projects.subscribers` endpoint.",
                "Use your Google Cloud project number in the request URL, not the project ID."
              ]
            ]
          }
        ]
      }
    ]
  },
  "errors": {
    "title": "Google Health API Version v4: Error Catalog",
    "intro": [{"kind":"p","text":"The Google Health API lets you view and manage health and fitness metrics and measurement data."}],
    "sections": [
      {
        "id": "error-codes",
        "heading": "Error codes",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "The following table lists HTTP status codes and associated errors that you might encounter when interacting with our API. Each status code corresponds to one or more reasons and descriptions to help you troubleshoot and handle errors effectively in your application. Within the descriptions, variables denoted by curly braces (`{}`) represent placeholders for values that are specific to your request."
          },
          {"kind":"note","variant":"note","text":"Note: This list contains some error messages related to its API, but is not a complete list of those messages."}
        ]
      }
    ]
  },
  "troubleshooting": {
    "title": "Troubleshooting",
    "intro": [{"kind":"p","text":"This guide explains how to troubleshoot common issues when using the Google Health API."}],
    "sections": [
      {
        "id": "4xx-client-errors",
        "heading": "4xx client errors",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "The API returns 4xx status codes when a problem exists in the client app code. Inspect the response body elements for more information about the problem."
          }
        ]
      },
      {
        "id": "400-bad-request",
        "heading": "400 Bad Request",
        "level": 3,
        "blocks": [
          {
            "kind": "table",
            "caption": null,
            "head": ["Message","Description","Recommendation"],
            "rows": [
              ["Request contains an invalid argument.","The data type ID {value} is not supported.","Verify the data type being referenced is supported by the endpoint."],
              [
                "Invalid JSON payload received. Octal/hex numbers are not valid JSON values.",
                "",
                "The `dailyRollUp` endpoint does not support month and day values represented as MM or DD, respectfully. Single digits shouldn't have a leading 0 (zero)."
              ],
              [
                "Your client has issued a malformed or illegal request.",
                "",
                "Possible causes:\nVerify the correct HTTP method is being used\nCheck the endpoint syntax for typos"
              ],
              [
                "Invalid project number in resource name",
                "When deleting or updating a subscriber using your Google Cloud project ID in the request URL instead of project number. This applies to webhook subscriptions using the `projects.subscribers` endpoint.",
                "Use your Google Cloud project number in the request URL, not the project ID."
              ],
              [
                "The account is not linked to Google Health.",
                "Status: `FAILED_PRECONDITION`\nReason: `ACCOUNT_NOT_LINKED`\nThe user authorized your app through Google OAuth, but their Google Account does not have an active Google Health profile (either they have never set up Google Health or have not migrated their legacy Fitbit account).",
                "Call `users.getIdentity` immediately after exchanging the authorization code to verify account linking. If this error occurs, don't mark the account as connected. Instead, prompt the user to sign in to the Google Health mobile app or open the `redirect_uri` (`https://fitbit.google.com/auth/signup`). See Handle unlinked Google Accounts."
              ]
            ]
          }
        ]
      },
      {
        "id": "401_unauthorized",
        "heading": "401 Unauthorized",
        "level": 3,
        "blocks": [
          {
            "kind": "table",
            "caption": null,
            "head": ["Message","Description","Recommendation"],
            "rows": [
              [
                "Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.",
                "INVALID_AUTHENTICATOR: Token expired",
                "Your access token has expired. Use the refresh token to obtain a new access token & refresh token, or the user should re-consent to the application."
              ]
            ]
          }
        ]
      },
      {
        "id": "403_forbidden",
        "heading": "403 Forbidden",
        "level": 3,
        "blocks": [
          {
            "kind": "table",
            "caption": null,
            "head": ["Message","Description","Recommendation"],
            "rows": [
              [
                "The caller does not have permission",
                "When creating or listing subscribers using your Google Cloud project ID in the request URL instead of project number. This applies to webhook subscriptions using the `projects.subscribers` endpoint.",
                "Use your Google Cloud project number in the request URL, not the project ID."
              ],
              [
                "The caller does not have permission.",
                "Could not mint UberMint from GaiaMint.",
                "The user was able to complete the authorization flow, but the endpoint call failed. This can occur when a legacy Fitbit account consents to the app instead of a Google Account. To resolve this error:\nSign out of the Google Health app through the settings.\nSign into the Google Health app either by pressing the \"Continue with Google\" or \"Sign in with Google\" button. If you receive a message that states \"Can't use Fitbit with this Google Account\", your email address is still registered as a legacy Fitbit account. Follow the steps in this help article to migrate your account."
              ]
            ]
          }
        ]
      },
      {
        "id": "404-not-found",
        "heading": "404 Not Found",
        "level": 3,
        "blocks": [
          {
            "kind": "table",
            "caption": null,
            "head": ["Message","Description","Recommendation"],
            "rows": [
              [
                "The requested URL `/v4/users/me/dataTypes/{dataType}/dataPoints` was not found on this server.",
                "",
                "Possible causes:\nVerify the correct verb is being used\nCheck the endpoint syntax for typos"
              ]
            ]
          }
        ]
      },
      {
        "id": "412-precondition-failed",
        "heading": "Handle unlinked Google Accounts",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "A user must sign in to the Google Health mobile app to link Google Health to their Google Account before your app can sync data through the Google Health API. See Link Google Health before OAuth consent. Because Google OAuth 2.0 authenticates any valid Google Account during consent, it cannot block accounts that don't yet have an active Google Health profile."
          },
          {
            "kind": "p",
            "text": "If a user completes Google OAuth consent before creating a Google Health profile or before migrating their legacy Fitbit account to their Google Account, calling `users.getIdentity` or a data endpoint returns an HTTP `400 Bad Request` error with status `FAILED_PRECONDITION` and reason `ACCOUNT_NOT_LINKED`:"
          },
          {
            "kind": "code",
            "text": "{\n  \"error\": {\n    \"code\": 400,\n    \"message\": \"The account is not linked to Google Health.\",\n    \"status\": \"FAILED_PRECONDITION\",\n    \"details\": [\n      {\n        \"@type\": \"type.googleapis.com/google.rpc.ErrorInfo\",\n        \"reason\": \"ACCOUNT_NOT_LINKED\",\n        \"domain\": \"health.googleapis.com\",\n        \"metadata\": {\n          \"redirect_uri\": \"https://fitbit.google.com/auth/signup\"\n        }\n      }\n    ]\n  }\n}"
          },
          {"kind":"p","text":"To verify account access and handle this error:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Exchange the OAuth authorization code for tokens and immediately call `users.getIdentity` (`GET https://health.googleapis.com/v4/users/me/identity`) before marking the account as linked in your app UI."
              },
              {
                "text": "If `users.getIdentity` or a background data sync call returns HTTP `400` with reason `ACCOUNT_NOT_LINKED`, don't mark the account as connected. If the user is migrating from the legacy Fitbit Web API, keep their existing Fitbit connection active and don't revoke their legacy Fitbit tokens."
              },
              {
                "text": "Display an actionable prompt that addresses both new users who have never created a Google Health or Fitbit account and existing Fitbit users who have not yet migrated to a Google Account:\n\"Your Google Account isn't linked to Google Health yet. Open the Google Health mobile app and sign in with your Google Account to create a profile, or move your existing Fitbit account to your Google Account, then return here to connect.\""
              },
              {
                "text": "Provide a call-to-action button that opens the `redirect_uri` from the error metadata (`https://fitbit.google.com/auth/signup`) or direct legacy Fitbit users to the Fitbit account migration help article."
              }
            ]
          }
        ]
      },
      {
        "id": "retrieve_a_fitbit_user_id",
        "heading": "Retrieve a Fitbit user ID",
        "level": 2,
        "blocks": [
          {"kind":"p","text":"To help troubleshoot a user issue, you may need to verify the Google Account of the user logged into the Google Health app."},
          {"kind":"p","text":"To find the legacy Fitbit user ID:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {"text":"Open the Google Health app."},
              {"text":"Press the Health icon in the bottom right hand corner."},
              {"text":"In the \"Personal info\" section, press Profile."},
              {"text":"In the \"Account information\" section, the value assigned to the ID is the legacy Fitbit user ID. (For example: CV5TKH)"}
            ]
          }
        ]
      },
      {
        "id": "revoke-consent",
        "heading": "Revoke consent to an app",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "When helping a user troubleshoot their OAuth2 connection to your app, you may need them to unlink their account from your app and then complete your authorization flow again."
          },
          {"kind":"p","text":"To unlink their Google Account from your app:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {"text":"Open the Google Health app."},
              {"text":"Press the user profile icon in the upper right corner."},
              {"text":"Press Apps and services."},
              {"text":"Look for your app name in the list of connected apps, and have the user select it."},
              {"text":"For legacy Fitbit API applications, the \"Connected apps\" page will appear. Have the user press disconnect under the app name."},
              {
                "text": "For all other apps, the \"Linked apps\" page will appear. Have the user find the Google Health API app and select it. Press \"Delete all\". Have the user press confirm to revoke consent to your app."
              }
            ]
          },
          {
            "kind": "p",
            "text": "When the revoke process completes, the user will be taken back to the list of Third-party apps & services page. The user might need to refresh the page to see the app name removed from the list."
          }
        ]
      },
      {
        "id": "device-sync-delays",
        "heading": "Troubleshoot device syncing delays",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "When debugging issues related to missing or delayed user data, it is helpful to check the user's paired device model and their last synchronization date."
          },
          {
            "kind": "p",
            "text": "The model information (such as a Fitbit tracker or smartwatch model) and last sync date are useful for troubleshooting and to fetch historical data after syncing delays."
          },
          {"kind":"p","text":"For example, if you notice an unexpected gap or delay in data delivery:"},
          {
            "kind": "list",
            "ordered": true,
            "items": [
              {
                "text": "Verify that the user ID you are querying matches the user ID of the Fitbit account logged into the mobile app. To obtain the user ID in the mobile app, see Retrieve a Fitbit user ID. To obtain the user ID from the access token, call the `getIdentity` endpoint."
              },
              {"text":"Check the last sync time to determine when the user's device last synced with the Google Health mobile app."},
              {
                "text": "If the device has not synced recently, it indicates that the delay is likely due to the device being offline or not syncing with the mobile application, rather than an API issue."
              },
              {"text":"Once the user opens the mobile application and syncs their device, you can fetch historical data for the period since the last sync time."}
            ]
          },
          {"kind":"p","text":"To retrieve a user's paired device information, call the `users.pairedDevices.list` endpoint. This returns a list of devices containing:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"`deviceVersion`: The product name or model of the device (for example, \"Charge 6\")."},
              {"text":"`lastSyncTime`: The timestamp of the last successful synchronization."}
            ]
          }
        ]
      }
    ]
  },
  "releaseNotes": {"title":"Release notes","intro":[],"sections":[]},
  "endpoints": {
    "title": "Endpoints",
    "intro": [{"kind":"p","text":"This page provides an overview of REST API conventions, along with an index of common Google Health API tasks and examples of each."}],
    "sections": [
      {
        "id": "rest_api_conventions",
        "heading": "REST API conventions",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "The Google Health API follows the Google API Improvement Proposals (AIP) standards, specifically AIP-127 (HTTP and gRPC Transcoding) and AIP-131 through AIP-135 (Standard Methods). These standards define how data is mapped from a proto message to an HTTP request."
          }
        ]
      },
      {
        "id": "headers",
        "heading": "Headers",
        "level": 2,
        "blocks": [
          {
            "kind": "p",
            "text": "Executing the Google Health API endpoints requires using the appropriate headers and access token. The following header is recommended for both GET and POST requests:"
          },
          {"kind":"code","text":"\nAuthorization: Bearer access-token\nAccept: application/json"}
        ]
      },
      {
        "id": "get-user-id",
        "heading": "Get the Fitbit or Google user ID",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "After a user consents through Google OAuth 2.0, the token response does not contain the Fitbit or Google user ID. Call the `getIdentity` endpoint immediately after exchanging the authorization code to retrieve both `legacyUserId` and `healthUserId` and verify that the user's Google Account is linked to Google Health. If the account is not yet linked, `getIdentity` returns `400 Bad Request` with reason `ACCOUNT_NOT_LINKED` (see Handle unlinked Google Accounts)."
          },
          {"kind":"p","text":"For example:"},
          {"kind":"label","text":"Request"},
          {"kind":"code","text":"GET https://health.googleapis.com/v4/users/me/identity\nAuthorization: Bearer access-token\nAccept: application/json"},
          {"kind":"label","text":"Response (200 OK)"},
          {"kind":"code","text":"{\n  \"name\": \"users/me/identity\",\n  \"legacyUserId\": \"A1B2C3\",\n  \"healthUserId\": \"111111256096816351\"\n}"},
          {"kind":"label","text":"Response (400 ACCOUNT_NOT_LINKED)"},
          {
            "kind": "code",
            "text": "{\n  \"error\": {\n    \"code\": 400,\n    \"message\": \"The account is not linked to Google Health.\",\n    \"status\": \"FAILED_PRECONDITION\",\n    \"details\": [\n      {\n        \"@type\": \"type.googleapis.com/google.rpc.ErrorInfo\",\n        \"reason\": \"ACCOUNT_NOT_LINKED\",\n        \"domain\": \"health.googleapis.com\",\n        \"metadata\": {\n          \"redirect_uri\": \"https://fitbit.google.com/auth/signup\"\n        }\n      }\n    ]\n  }\n}"
          }
        ]
      },
      {
        "id": "get-intraday",
        "heading": "Get intraday or detailed data collected throughout a day",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Use the `list` endpoint for a specific data type to get intraday or detailed data collected throughout the day in supported intervals for that data type."
          },
          {
            "kind": "note",
            "variant": "note",
            "text": "Note: When connected devices sync, on-device algorithms can re-bucket telemetry and upload new records with overlapping boundaries. To retrieve a deduplicated, reconciled view of interval data, see Get a reconciled view of interval data. For background on connected device synchronization and an operational comparison between `list` and `reconcile`, see the Data management guide."
          },
          {"kind":"p","text":"For example:"},
          {"kind":"label","text":"Request"},
          {"kind":"code","text":"GET https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints\nAuthorization: Bearer access-token\nAccept: application/json"},
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"dataPoints\": [\n    {\n      \"dataSource\": {\n        \"recordingMethod\": \"PASSIVELY_MEASURED\",\n        \"device\": {\n          \"manufacturer\": \"\",\n          \"displayName\": \"Charge 6\"\n        },\n        \"platform\": \"FITBIT\"\n      },\n      \"steps\": {\n        \"interval\": {\n          \"startTime\": \"2026-03-04T07:05:00Z\",\n          \"startUtcOffset\": \"0s\",\n          \"endTime\": \"2026-03-04T07:06:00Z\",\n          \"endUtcOffset\": \"0s\",\n          \"civilStartTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 3,\n              \"day\": 4\n            },\n            \"time\": {\n              \"hours\": 7,\n              \"minutes\": 5\n            }\n          },\n          \"civilEndTime\": {\n            \"date\": {\n              \"year\": 2026,\n              \"month\": 3,\n              \"day\": 4\n            },\n            \"time\": {\n              \"hours\": 7,\n              \"minutes\": 6\n            }\n          }\n        },\n        \"count\": \"40\"\n      }\n    },\n...\n  ],\n  \"nextPageToken\": \"Xm5h-6L0viZxIlRuWjx5bmvy98zj85uG34tuMn16mu2pntsnZI32iqhq\"\n}"
          }
        ]
      },
      {
        "id": "get-reconciled-view",
        "heading": "Get a reconciled view of interval data",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To retrieve interval data without overlapping records or multi-device conflicts, call the `reconcile` endpoint. The reconcile endpoint automatically deduplicates overlapping intervals across sync batches and multiple recording devices, returning an authoritative, continuous stream suitable for rendering activity timelines and calculating durations."
          },
          {
            "kind": "p",
            "text": "For background on why connected devices produce overlapping intervals and an operational comparison between `list` and `reconcile`, see the Data management guide."
          },
          {
            "kind": "p",
            "text": "The following example compares the response of `list` (which returns both overlapping records) versus `reconcile` (which resolves the conflict by returning the authoritative record) for a user with two overlapping exercise sessions:"
          },
          {"kind":"label","text":"Raw list"},
          {
            "kind": "code",
            "text": "GET https://health.googleapis.com/v4/users/me/dataTypes/exercise/dataPoints\nAuthorization: Bearer access-token\nAccept: application/json"
          },
          {
            "kind": "code",
            "text": "{\n  \"dataPoints\": [\n    {\n      \"name\": \"users/111111256096816351/dataTypes/exercise/dataPoints/7797422996486764704\",\n      \"exercise\": {\n        \"interval\": {\n          \"startTime\": \"2026-09-03T11:20:00Z\",\n          \"endTime\": \"2026-09-03T11:50:00Z\"\n        },\n        \"exerciseType\": \"RUNNING\"\n      }\n    },\n    {\n      \"name\": \"users/111111256096816351/dataTypes/exercise/dataPoints/4389052750481144696\",\n      \"exercise\": {\n        \"interval\": {\n          \"startTime\": \"2026-09-03T11:00:00Z\",\n          \"endTime\": \"2026-09-03T11:30:00Z\"\n        },\n        \"exerciseType\": \"RUNNING\"\n      }\n    }\n  ]\n}"
          },
          {"kind":"label","text":"Reconciled"},
          {
            "kind": "code",
            "text": "GET https://health.googleapis.com/v4/users/me/dataTypes/exercise/dataPoints:reconcile\nAuthorization: Bearer access-token\nAccept: application/json"
          },
          {
            "kind": "code",
            "text": "{\n  \"dataPoints\": [\n    {\n      \"dataPointName\": \"users/111111256096816351/dataTypes/exercise/dataPoints/7797422996486764704\",\n      \"exercise\": {\n        \"interval\": {\n          \"startTime\": \"2026-09-03T11:20:00Z\",\n          \"endTime\": \"2026-09-03T11:50:00Z\"\n        },\n        \"exerciseType\": \"RUNNING\"\n      }\n    }\n  ]\n}"
          },
          {
            "kind": "p",
            "text": "Reconciliation resolves conflicting sessions by deduplicating and selecting the authoritative record rather than synthesizing an artificial time union (such as `11:00:00Z` to `11:50:00Z`). The reconciled response returns the winning data point (`7797422996486764704`) with its original recorded interval (`11:20:00Z` to `11:50:00Z`), preserving the integrity of that session's measured telemetry and metrics."
          }
        ]
      },
      {
        "id": "filter-data",
        "heading": "Filter data",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To retrieve specific subsets of data point records matching criteria such as a time interval, date, or observation time, use the `list` or `reconcile` endpoint with a `filter` parameter."
          },
          {"kind":"p","text":"For detailed guidelines, formatting rules, validation errors, and query examples, see the Filter data guide."}
        ]
      },
      {
        "id": "filter-by-data-source",
        "heading": "Filter by data source family",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "To isolate or aggregate data from specific types of sources (for example, physical wearable devices versus manual entries), use the `dataSourceFamily` parameter."
          },
          {
            "kind": "p",
            "text": "For detailed guidelines, supported families, and request and response examples for `reconcile`, `rollUp`, and `dailyRollUp`, see Filter by data source family in the Filter data guide."
          }
        ]
      },
      {
        "id": "filter-and-aggregate-by-data-source",
        "heading": "Filter and aggregate by data source family",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "A data source family is a logical grouping of data sources (such as smartwatches, mobile apps, or manual entries). It allows you isolate or aggregate data from specific types of sources (for example, physical wearable devices versus. manual entries)."
          },
          {
            "kind": "p",
            "text": "The `reconcile`, `rollUp`, and `dailyRollUp` endpoints all support the `dataSourceFamily` parameter. The passing mechanism depends on the endpoint:"
          },
          {
            "kind": "table",
            "caption": null,
            "head": ["Endpoint (HTTP method)","Mechanism"],
            "rows": [
              ["`reconcile` (GET)","Pass `dataSourceFamily` as a URL query parameter."],
              ["`rollUp` (POST)","Pass `dataSourceFamily` as a field in the JSON request body."],
              ["`dailyRollUp` (POST)","Pass `dataSourceFamily` as a field in the JSON request body."]
            ]
          }
        ]
      },
      {
        "id": "supported_data_source_families",
        "heading": "Supported Data Source Families",
        "level": 4,
        "blocks": [
          {"kind":"p","text":"The following table describes the supported `dataSourceFamily` values:"},
          {
            "kind": "table",
            "caption": null,
            "head": ["Option","Description"],
            "rows": [
              [
                "`users/me/dataSourceFamilies/all-sources`",
                "Default value. Returns data points reconciled across all registered first-party (1P) and third-party (3P) data sources. Third-party app data will be returned with this option (such as smartwatch steps + third-party app steps + mobile phone steps + manual steps)."
              ],
              [
                "`users/me/dataSourceFamilies/google-wearables`",
                "Includes data recorded by Google and Fitbit tracker devices (such as Fitbit wearable trackers and Pixel Watch). Excludes manually logged data and phone-estimated data. Use this option when your integration requires raw sensor telemetry recorded directly by wearable hardware."
              ],
              [
                "`users/me/dataSourceFamilies/google-sources`",
                "Includes first-party Google and Fitbit sources. This includes physical tracker device records, data from Health Connect, and any manual entries logged through first-party apps (such as the Fitbit app or Google Fit)."
              ]
            ]
          },
          {
            "kind": "note",
            "variant": "special",
            "text": "Important: You must specify the `dataSourceFamily` parameter using the full resource URI format, such as `users/me/dataSourceFamilies/google-wearables`. Short identifier strings (like `\"google-wearables\"`, `\"wearables\"`, or `\"FITBIT\"`) are invalid and cause the API to return a `400 Bad Request` with an `INVALID_ARGUMENT` error."
          },
          {
            "kind": "note",
            "variant": "important",
            "text": "Important: The format of data type identifiers differs when the data type has more than one word. In an endpoint, the data type name must be in kebab case, such as `body-fat`. In a filter parameter, however, the data type name must be in snake case, such as `body_fat`."
          },
          {
            "kind": "p",
            "text": "To get a reconciled data stream from a specific data source family, call the `reconcile` endpoint with the `dataSourceFamily` query parameter."
          },
          {"kind":"p","text":"For example, the following GET request fetches tracker-recorded sleep for the day after 2026-03-03:"},
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "GET https://health.googleapis.com/v4/users/me/dataTypes/sleep/dataPoints:reconcile?dataSourceFamily=users/me/dataSourceFamilies/google-wearables&filter=sleep.interval.civil_end_time >= \"2026-03-03\"\nAuthorization: Bearer access-token\nAccept: application/json"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"dataPoints\": [\n    {\n      \"name\": \"users/2515055256096816351/dataTypes/sleep/dataPoints/2724123844716220216\",\n      \"dataSource\": {\n        \"recordingMethod\": \"DERIVED\",\n        \"device\": {\n          \"displayName\": \"Charge 6\"\n        },\n        \"platform\": \"FITBIT\"\n      },\n      \"sleep\": {\n        \"interval\": {\n          \"startTime\": \"2026-03-03T20:57:30Z\",\n          \"startUtcOffset\": \"0s\",\n          \"endTime\": \"2026-03-04T04:41:30Z\",\n          \"endUtcOffset\": \"0s\"\n        },\n        \"type\": \"STAGES\",\n        \"stages\": [\n          {\n            \"startTime\": \"2026-03-03T20:57:30Z\",\n            \"startUtcOffset\": \"0s\",\n            \"endTime\": \"2026-03-03T20:59:30Z\",\n            \"endUtcOffset\": \"0s\",\n            \"type\": \"AWAKE\",\n            \"createTime\": \"2026-03-04T04:43:40.937183Z\",\n            \"updateTime\": \"2026-03-04T04:43:40.937183Z\"\n          },\n          {\n            \"startTime\": \"2026-03-04T04:07:30Z\",\n            \"startUtcOffset\": \"0s\",\n            \"endTime\": \"2026-03-04T04:41:30Z\",\n            \"endUtcOffset\": \"0s\",\n            \"type\": \"AWAKE\",\n            \"createTime\": \"2026-03-04T04:43:40.937183Z\",\n            \"updateTime\": \"2026-03-04T04:43:40.937183Z\"\n          }\n        ],\n        \"metadata\": {\n          \"stagesStatus\": \"SUCCEEDED\",\n          \"processed\": true,\n          \"main\": true\n        },\n        \"summary\": {\n          \"minutesInSleepPeriod\": \"464\",\n          \"minutesAfterWakeUp\": \"0\",\n          \"minutesToFallAsleep\": \"0\",\n          \"minutesAsleep\": \"407\",\n          \"minutesAwake\": \"57\",\n          \"stagesSummary\": [\n            {\n              \"type\": \"AWAKE\",\n              \"minutes\": \"56\",\n              \"count\": \"12\"\n            },\n            {\n              \"type\": \"LIGHT\",\n              \"minutes\": \"198\",\n              \"count\": \"19\"\n            },\n            {\n              \"type\": \"DEEP\",\n              \"minutes\": \"114\",\n              \"count\": \"10\"\n            },\n            {\n              \"type\": \"REM\",\n              \"minutes\": \"94\",\n              \"count\": \"4\"\n            }\n          ]\n        },\n        \"createTime\": \"2026-03-04T04:43:40.337983Z\",\n        \"updateTime\": \"2026-03-04T04:43:40.937183Z\"\n      }\n    }\n  ],\n  \"nextPageToken\": \"\"\n}"
          },
          {
            "kind": "p",
            "text": "To aggregate data points over a specific window size restricted to a particular data source family, call the `rollUp` endpoint and pass the `dataSourceFamily` field in the JSON request body."
          },
          {
            "kind": "p",
            "text": "The following POST request queries intraday walking step counts in hourly intervals (`3600s`), aggregated exclusively from wearable devices:"
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints:rollUp\nAuthorization: Bearer access-token\nAccept: application/json\n\n{\n  \"range\": {\n    \"startTime\": \"2026-07-29T00:00:00Z\",\n    \"endTime\": \"2026-07-29T23:59:59Z\"\n  },\n  \"windowSize\": \"3600s\",\n  \"dataSourceFamily\": \"users/me/dataSourceFamilies/google-wearables\"\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"rollupDataPoints\": [\n    {\n      \"startTime\": \"2026-07-29T08:00:00Z\",\n      \"endTime\": \"2026-07-29T09:00:00Z\",\n      \"steps\": {\n        \"countSum\": \"1200\"\n      }\n    },\n    {\n      \"startTime\": \"2026-07-29T09:00:00Z\",\n      \"endTime\": \"2026-07-29T10:00:00Z\",\n      \"steps\": {\n        \"countSum\": \"3450\"\n      }\n    }\n  ]\n}"
          },
          {
            "kind": "p",
            "text": "To aggregate daily data points for a specific source family, call the `dailyRollUp` endpoint and pass the `dataSourceFamily` field in the request body."
          },
          {
            "kind": "p",
            "text": "For example, the following request calculates the daily rollups for the user's steps, including all first-party Google and Fitbit sources (wearables + manual entries):"
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints:dailyRollUp\nAuthorization: Bearer access-token\nAccept: application/json\n\n{\n  \"range\": {\n    \"start\": {\n      \"date\": {\n        \"year\": 2026,\n        \"month\": 7,\n        \"day\": 28\n      },\n      \"time\": {\n        \"hours\": 0,\n        \"minutes\": 0,\n        \"seconds\": 0,\n        \"nanos\": 0\n      }\n    },\n    \"end\": {\n      \"date\": {\n        \"year\": 2026,\n        \"month\": 7,\n        \"day\": 30\n      },\n      \"time\": {\n        \"hours\": 0,\n        \"minutes\": 0,\n        \"seconds\": 0,\n        \"nanos\": 0\n      }\n    }\n  },\n  \"windowSizeDays\": 1,\n  \"dataSourceFamily\": \"users/me/dataSourceFamilies/google-sources\"\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"rollupDataPoints\": [\n    {\n      \"civilStartTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 7,\n          \"day\": 28\n        },\n        \"time\": {}\n      },\n      \"civilEndTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 7,\n          \"day\": 28\n        },\n        \"time\": {\n          \"hours\": 23,\n          \"minutes\": 59,\n          \"seconds\": 59\n        }\n      },\n      \"steps\": {\n        \"countSum\": \"8430\"\n      }\n    },\n    {\n      \"civilStartTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 7,\n          \"day\": 29\n        },\n        \"time\": {}\n      },\n      \"civilEndTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 7,\n          \"day\": 29\n        },\n        \"time\": {\n          \"hours\": 23,\n          \"minutes\": 59,\n          \"seconds\": 59\n        }\n      },\n      \"steps\": {\n        \"countSum\": \"11245\"\n      }\n    }\n  ]\n}"
          }
        ]
      },
      {
        "id": "aggregate",
        "heading": "Aggregate data points over a range of time",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Use the `rollUp` endpoint to return the aggregate of data points based on a window in seconds (`windowSize`), over a `datetime` range in the user's physical time (in UTC)."
          },
          {
            "kind": "p",
            "text": "When calling the `rollUp` endpoint, provide the request body representing the required closed-open time `range` and `windowSize` (at least `\"1s\"`). For detailed guidelines on `windowSize` requirements, storage resolution alignment, bucketing rules, and response ordering, see Aggregate over physical time intervals in the Aggregate data guide."
          },
          {"kind":"p","text":"For example, to roll up step counts in 1-minute intervals (`60s`):"},
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints:rollUp\nAuthorization: Bearer access-token\nAccept: application/json\n\n{\n  \"range\": {\n    \"startTime\": \"2026-02-17T17:00:00Z\",\n    \"endTime\": \"2026-02-17T17:59:59Z\"\n  },\n  \"windowSize\": \"60s\"\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"rollupDataPoints\": [\n    {\n      \"startTime\": \"2026-02-17T17:55:00Z\",\n      \"endTime\": \"2026-02-17T17:56:00Z\",\n      \"steps\": {\n        \"countSum\": \"72\"\n      }\n    },\n    {\n      \"startTime\": \"2026-02-17T17:54:00Z\",\n      \"endTime\": \"2026-02-17T17:55:00Z\",\n      \"steps\": {\n        \"countSum\": \"85\"\n      }\n    },\n...\n  ]\n}"
          }
        ]
      },
      {
        "id": "aggregate-by-day",
        "heading": "Aggregate data across a single day or multiple days",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Use the `dailyRollUp` endpoint to aggregate data across a single day or multiple days (`windowSizeDays`). Provide the closed-open civil time range for the required interval in the request body. Depending on the data type, the endpoint returns either the sum or the average over the interval."
          },
          {
            "kind": "p",
            "text": "For details on daily aggregation behavior, civil time handling across time zones, and bucketing rules, see Aggregate across calendar days in the Aggregate data guide."
          },
          {"kind":"p","text":"For example:"},
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints:dailyRollUp\nAuthorization: Bearer access-token\nAccept: application/json\n\n{\n  \"range\": {\n    \"start\": {\n      \"date\": {\n        \"year\": 2026,\n        \"month\": 2,\n        \"day\": 26\n      },\n      \"time\": {\n        \"hours\": 0,\n        \"minutes\": 0,\n        \"seconds\": 0,\n        \"nanos\": 0\n      }\n    },\n    \"end\": {\n      \"date\": {\n        \"year\": 2026,\n        \"month\": 2,\n        \"day\": 26\n      },\n      \"time\": {\n        \"hours\": 23,\n        \"minutes\": 59,\n        \"seconds\": 59,\n        \"nanos\": 0\n      }\n    }\n  },\n  \"windowSizeDays\": 1\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"rollupDataPoints\": [\n    {\n      \"civilStartTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 2,\n          \"day\": 26\n        },\n        \"time\": {}\n      },\n      \"civilEndTime\": {\n        \"date\": {\n          \"year\": 2026,\n          \"month\": 2,\n          \"day\": 26\n        },\n        \"time\": {\n          \"hours\": 23,\n          \"minutes\": 59,\n          \"seconds\": 59\n        }\n      },\n      \"steps\": {\n        \"countSum\": \"3822\"\n      }\n    }\n  ]\n}"
          }
        ]
      },
      {
        "id": "rollup-alignment",
        "heading": "Bucketing when range is not a multiple of window size",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "If the requested range is not an exact multiple of `windowSize` (or `windowSizeDays`), the API uses ceiling division to compute the number of windows and clamps the final chronological bucket at the upper endpoint of the range. Because rollup responses are returned in reverse-chronological order, this truncated bucket appears as the first element (`index 0`) in the returned list."
          },
          {
            "kind": "p",
            "text": "For the bucketing formula, non-divisible range truncation examples, and guidance on normalizing additive metrics, see Bucketing when range is not a multiple of window size in the Aggregate data guide."
          }
        ]
      },
      {
        "id": "rollup-window-storage-resolution",
        "heading": "Rollup window and storage resolution",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "When aggregating interval data types, the `rollUp` endpoint places each recorded data point into the bucket containing the data point's `startTime` without slicing or interpolating across sub-interval buckets. To obtain evenly distributed aggregates, set `windowSize` to a duration equal to or greater than the underlying storage resolution of the target data type (such as `\"60s\"` for 1-minute step intervals)."
          },
          {
            "kind": "p",
            "text": "For underlying storage resolutions and sub-interval behavior examples, see Rollup window and storage resolution in the Aggregate data guide."
          }
        ]
      },
      {
        "id": "update",
        "heading": "Update a user's health data",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Use the `patch` endpoint to update a user's health data."},
          {
            "kind": "p",
            "text": "The `patch` endpoint updates an existing record based on the identifier specified in the request URL. Provide the identifier of a previously inserted data point. The API overwrites the existing record."
          },
          {
            "kind": "note",
            "variant": "note",
            "text": "Note: `PATCH` cannot be used to create new records. To insert a new record, see Log a food item for an example of using the `POST` method."
          },
          {
            "kind": "p",
            "text": "A data point's interval timestamps (`startTime` and `endTime`) can also be updated by the record's owner or propagated from upstream platforms like Health Connect. For details on timestamp mutability, see the Data management guide. For an example of updating interval timestamps, see Update interval timestamps for existing data."
          }
        ]
      },
      {
        "id": "when-to-use-datapoint-name",
        "heading": "When to use the data point identifier",
        "level": 4,
        "blocks": [
          {"kind":"p","text":"The data point identifier is essential in the following scenarios:"},
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {"text":"Targeted updates: To update a specific measurement, provide its identifier in the `patch` request."},
              {"text":"Deletions: Retaining the identifier allows your application to delete the record later using the `batchDelete` endpoint."}
            ]
          },
          {
            "kind": "p",
            "text": "Here's an example where a user updates their body fat reading on a scale called \"HumanScale\" from the company \"Scales R Us\". The user's new body fat reading is 20% for the date of 2026-03-10:"
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "PATCH https://health.googleapis.com/v4/users/me/dataTypes/body-fat/dataPoints/1234567890\nAuthorization: Bearer access-token\nContent-Type: application/json\n\n{\n  \"name\": \"users/me/dataTypes/body-fat/dataPoints/1234567890\",\n  \"dataSource\": {\n    \"recordingMethod\": \"ACTIVELY_MEASURED\",\n    \"device\": {\n      \"formFactor\": \"SCALE\",\n      \"manufacturer\": \"Scales R Us\",\n      \"displayName\": \"HumanScale\"\n    }\n  },\n  \"bodyFat\": {\n    \"sampleTime\": {\n      \"physicalTime\": \"2026-03-10T10:00:00Z\"\n    },\n    \"percentage\": 20\n  }\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"done\": true,\n  \"response\": {\n    \"@type\": \"type.googleapis.com/google.devicesandservices.health.v4main.DataPoint\",\n    \"name\": \"users/123456789/dataTypes/body-fat/dataPoints/1234567890\",\n    \"dataSource\": {\n      \"recordingMethod\": \"ACTIVELY_MEASURED\",\n      \"device\": {\n        \"formFactor\": \"SCALE\",\n        \"manufacturer\": \"Scales R Us\",\n        \"displayName\": \"HumanScale\"\n      },\n      \"application\": {\n        \"googleWebClientId\": \"618308034039.apps.googleusercontent.com\"\n      },\n      \"platform\": \"GOOGLE_WEB_API\"\n    },\n    \"bodyFat\": {\n      \"sampleTime\": {\n        \"physicalTime\": \"2026-03-10T10:00:00Z\"\n      },\n      \"percentage\": 20\n    }\n  }\n}"
          }
        ]
      },
      {
        "id": "delete",
        "heading": "Delete user health data",
        "level": 3,
        "blocks": [
          {"kind":"p","text":"Use the `batchDelete` method to delete an array of a user's Fitbit app data."},
          {
            "kind": "p",
            "text": "Here's an example where a user previously recorded their body fat on a scale, but they want to delete the record. Using the user-id and data-point-id from the original insert action:"
          },
          {"kind":"label","text":"Request"},
          {
            "kind": "code",
            "text": "POST https://health.googleapis.com/v4/users/me/dataTypes/body-fat/dataPoints:batchDelete\nAuthorization: Bearer access-token\nAccept: application/json\ncontent-length: 93\n\n{\n  \"names\": [\n    \"users/123456789/dataTypes/body-fat/dataPoints/1234567890\"\n  ]\n}"
          },
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"done\": true,\n  \"response\": {\n    \"@type\": \"type.googleapis.com/google.devicesandservices.health.v4main.BatchDeleteDataPointsResponse\"\n  }\n}"
          }
        ]
      },
      {
        "id": "find-device-information",
        "heading": "Find device information",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "Use the `list` endpoint to retrieve the list of devices paired to a user's account. This includes the device's model information (`deviceVersion`) and the last time it synchronized with the Google Health mobile app (`lastSyncTime`)."
          },
          {
            "kind": "p",
            "text": "The list configuration and sync information is useful for troubleshooting syncing issues or fetching historical data since the last sync time."
          },
          {"kind":"p","text":"For example:"},
          {"kind":"label","text":"Request"},
          {"kind":"code","text":"GET https://health.googleapis.com/v4/users/me/pairedDevices\nAuthorization: Bearer access-token\nAccept: application/json"},
          {"kind":"label","text":"Response"},
          {
            "kind": "code",
            "text": "{\n  \"pairedDevices\": [\n    {\n      \"name\": \"users/me/pairedDevices/123456\",\n      \"deviceType\": \"TRACKER\",\n      \"batteryStatus\": \"High\",\n      \"batteryLevel\": 88,\n      \"lastSyncTime\": \"2026-03-04T07:05:00Z\",\n      \"deviceVersion\": \"Charge 6\",\n      \"macAddress\": \"00:11:22:33:44:55\",\n      \"features\": [\n        \"STEPS\",\n        \"HEART_RATE\"\n      ]\n    }\n  ]\n}"
          }
        ]
      },
      {
        "id": "query-historical-data",
        "heading": "Query historical data",
        "level": 3,
        "blocks": [
          {
            "kind": "p",
            "text": "One of the core benefits of the Google Health API is the ability to track a user's performance and monitor their health vitals over long periods of time. You can query a user's data as far back as it has been recorded; the API imposes no limitations or restrictions on the amount of historical data your application can consume."
          },
          {
            "kind": "p",
            "text": "However, querying historical data is still governed by standard rate limits. To manage system stability and prevent excessive payloads, the Google Health API uses automatic pagination with endpoint-specific page sizes. Note the following boundaries and behavior:"
          },
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Automatic pagination: If you query a long span of data, the API will only return the first page of results up to the page size cap for that endpoint, along with a `nextPageToken`. You must use the `nextPageToken` to request subsequent pages."
              },
              {
                "text": "Variable page sizes: Capping limits depend on the endpoint and data type. For most data types, page sizes are capped at a maximum of 10,000. However, for certain data types like `exercise` and `sleep`, the default and maximum page size is capped at 25. For example, if a client requests all sleep data for the past 10 years, the API will still return only 25 sleep sessions on the first page."
              },
              {
                "text": "Rollup date range restrictions: For data rollup and aggregation endpoints (such as `rollUp` and `dailyRollUp`), query date ranges are restricted based on the data type:",
                "sub": [
                  "A maximum range of 14 days for `calories-in-heart-rate-zone`, `heart-rate`, `active-minutes`, and `total-calories`.",
                  "A maximum range of 90 days for all other rollup data types."
                ]
              }
            ]
          },
          {
            "kind": "p",
            "text": "Depending on the volume of historical data your application needs, retrieving the entire dataset will require paginating through the pages sequentially. Keep this in mind when designing your application's data synchronization process."
          },
          {"kind":"p","text":"To ensure optimal performance and avoid API errors, follow these guidelines when querying historical data:"}
        ]
      },
      {
        "id": "phased-data-sync-hot-versus-cold-load",
        "heading": "Phased data sync (hot versus cold load)",
        "level": 4,
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Initial \"hot\" load: Fetch and render only the most recent 7–14 days of data during the primary load sequence. This ensures that users see data immediately without waiting for long-running queries."
              },
              {
                "text": "Background \"cold\" load: Delegate older historical data retrieval to an asynchronous, lower-priority queue or background process after the primary UI is rendered."
              }
            ]
          }
        ]
      },
      {
        "id": "query-chunking-for-aggregation",
        "heading": "Query chunking for aggregation",
        "level": 4,
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Because rollup and daily rollup endpoints enforce a maximum date range limit (14 or 90 days depending on the data type), you must break down large historical aggregation queries into smaller, sequential intervals within these limits."
              },
              {"text":"Batch or sequence these sub-queries safely to respect concurrency limits and maintain steady UI progress indicators."}
            ]
          }
        ]
      },
      {
        "id": "leverage-pre-aggregated-roll-ups",
        "heading": "Leverage pre-aggregated roll-ups",
        "level": 4,
        "blocks": [
          {
            "kind": "p",
            "text": "Restructure overview dashboards and trend charts to use pre-aggregated, summary endpoints (such as `DailyRollUpDataPoints`). This will drastically reduce compute overhead on the backend and network transfer time to the client."
          }
        ]
      },
      {
        "id": "resilient-error-handling-smart-retries",
        "heading": "Resilient error handling (smart retries)",
        "level": 4,
        "blocks": [
          {
            "kind": "list",
            "ordered": false,
            "items": [
              {
                "text": "Implement strict exponential backoff handling when encountering rate limits (`429 Too Many Requests`) and server gateway timeouts (`504 Gateway Timeout`). Never retry large, failed payloads immediately. Instant retries multiply backend congestion and compound system degradation."
              }
            ]
          },
          {"kind":"note","variant":"warning","text":"Warning: Not following these guidelines can introduce unexpected behavior and errors."}
        ]
      }
    ]
  }
};
