/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   npm run build && node scripts/build-api-client.mjs
 *
 * Types for https://aifitnessapi.com/api/v1, rendered from the OpenAPI
 * document the site builds (/api/v1/openapi.json, version 1.0.0).
 * 14 collections. Row fields the API derives from the data are typed
 * as their observed types | null (null means the source does not state it);
 * descriptions live in the OpenAPI document and on /developers.
 */

export interface Api {
  id: string;
  label: string | null;
  category: string | null;
  devCost: string | null;
  userSideCost: string | null;
  approvalGate: string | null;
  source: string | null;
  page: string;
  sourceLastVerified: string | null;
}

export interface ApiDetail {
  id: string;
  label: string | null;
  category: string | null;
  devCost: string | null;
  userSideCost: string | null;
  approvalGate: string | null;
  source: string | null;
  page: string;
  sourceLastVerified: string | null;
  coverage: {
    section: string;
    url: string;
    pages: {
      title: string;
      url: string;
    }[];
  }[];
  changes: {
    id: string;
    date: string;
    title: string;
    status: string;
    url: string;
  }[];
}

export type ApiIndex = {
  name: string;
  apiVersion: "v1";
  self: string;
  description?: string;
  source?: string;
  docs: string;
  openapi: string;
  license: "CC-BY-4.0";
  licenseUrl?: string;
  attribution: string;
  verified: Verified;
  rules: string[];
  mcp: {
    url: string;
    transport: "streamable-http";
    tools: {
      name: string;
      description: string;
    }[];
  };
  collections: {
    title: string;
    url: string;
    itemUrl: string;
    key: string;
    count: number;
    dataset: string;
    source: string;
    verified: Verified;
  }[];
};

export type ApiResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: ApiDetail;
};

export type ApisCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: Api[];
};

export interface BluetoothGattField {
  characteristicUuid: string | null;
  characteristicName: string | null;
  characteristicId: string | null;
  sigService: string | null;
  structurePublished: string | null;
  order: string | null;
  field: string | null;
  parentField: string | null;
  type: string | null;
  size: string | null;
  sizeUnit: string | null;
  offset: number | null;
  offsetVariesWith: string | null;
  presentIf: string | null;
  flagsField: string | null;
  flagBit: number | null;
  flagValue: number | null;
  units: string | null;
  unitEvidence: string | null;
  gssFile: string | null;
  page: string | null;
  id: string;
}

export type BluetoothGattFieldResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: BluetoothGattField;
};

export type BluetoothGattFieldsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: BluetoothGattField[];
};

export interface Change {
  date: string | null;
  sortDate: string | null;
  title: string | null;
  summary: string | null;
  status: string | null;
  source: string | null;
  sourceLabel: string | null;
  verifiedOn: string | null;
  id: string;
}

export type ChangeResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: Change;
};

export type ChangesCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: Change[];
};

export type DatasetRef = {
  slug: string;
  name: string;
  version: string;
  json: string;
  csv: string;
  isBasedOn?: string | string[];
};

export type Excluded = {
  id: string;
  reason: string;
};

export interface GlossaryTerm {
  term: string | null;
  definition: string | null;
  group: string | null;
  href: string | null;
  anchor: string | null;
  id: string | null;
  slug: string;
}

export type GlossaryTermResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "slug";
  id: string;
  item: GlossaryTerm;
};

export type GlossaryTermsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "slug";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: GlossaryTerm[];
};

export interface GoogleHealthDataType {
  dataType: string;
  name: string | null;
  filterParam: string | null;
  recordType: string | null;
  storageResolution: string | null;
  channel: string | null;
  webhookSupport: string | null;
  trueZerosSupport: string | null;
  operations: string | null;
  methods: string | null;
  scopes: string | null;
  dataPointProperty: string | null;
  dataPointMatch: string | null;
  dataPointEvidence: string | null;
  schema: string | null;
  requiredFields: string | null;
  fields: string | null;
  rollupSchema: string | null;
  rollupFields: string | null;
  fitbitPredecessor: string | null;
  fitbitDescription: string | null;
  compatibleDevices: string | null;
  flags: string | null;
  googleDocs: string | null;
  page: string | null;
}

export type GoogleHealthDataTypeResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "dataType";
  id: string;
  item: GoogleHealthDataType;
};

export type GoogleHealthDataTypesCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "dataType";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: GoogleHealthDataType[];
};

export interface HealthConnectPermission {
  constant: string;
  permission: string | null;
  description: string | null;
  protectionLevel: string | null;
  added: string | null;
  records: string | null;
}

export type HealthConnectPermissionResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "constant";
  id: string;
  item: HealthConnectPermission;
};

export type HealthConnectPermissionsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "constant";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: HealthConnectPermission[];
};

export interface HealthConnectRecord {
  className: string;
  qualifiedName: string | null;
  dataType: string | null;
  category: string | null;
  recordShape: string | null;
  unitClass: string | null;
  mandatoryFields: string | null;
  readPermissions: string | null;
  writePermissions: string | null;
  permissionEvidence: string | null;
  aggregateMetrics: string | null;
  addedIn: string | null;
  featureFlag: string | null;
  deprecated: string | null;
  description: string | null;
  googleDocs: string | null;
  sourceUpdated: string | null;
  page: string | null;
}

export type HealthConnectRecordResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "className";
  id: string;
  item: HealthConnectRecord;
};

export type HealthConnectRecordsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "className";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: HealthConnectRecord[];
};

export interface HealthkitMetadataKey {
  swiftName: string;
  objcName: string | null;
  group: string | null;
  subgroup: string | null;
  valueType: string | null;
  valueTypeEvidence: string | null;
  iosIntroduced: string | null;
  watchosIntroduced: string | null;
  deprecated: string | null;
  abstract: string | null;
  appleDocs: string | null;
  page: string | null;
}

export type HealthkitMetadataKeyResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "swiftName";
  id: string;
  item: HealthkitMetadataKey;
};

export type HealthkitMetadataKeysCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "swiftName";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: HealthkitMetadataKey[];
};

export interface HealthkitType {
  identifier: string;
  objcConstant: string | null;
  family: string | null;
  group: string | null;
  abstract: string | null;
  aggregation: string | null;
  unitFamily: string | null;
  valueEnum: string | null;
  iosIntroduced: string | null;
  watchosIntroduced: string | null;
  deprecated: string | null;
  iosDeprecated: string | null;
  deprecationNote: string | null;
  renamedTo: string | null;
  appleDocumented: string | null;
  appleDocs: string | null;
}

export type HealthkitTypeResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "identifier";
  id: string;
  item: HealthkitType;
};

export type HealthkitTypesCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "identifier";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: HealthkitType[];
};

export interface MatrixRow {
  id: string;
  label: string | null;
  appleHealthKit: string | null;
  androidHealthConnect: string | null;
  watchOut: string | null;
  source: string | null;
}

export type MatrixRowResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: MatrixRow;
};

export type MatrixRowsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: MatrixRow[];
};

export interface McpServer {
  name: string | null;
  title: string | null;
  description: string | null;
  version: string | null;
  status: string | null;
  registryPublishedOn: string | null;
  registryUpdatedOn: string | null;
  group: string | null;
  dataSources: string | null;
  matchedTerms: string | null;
  publisherIsVendor: string | null;
  publisherEvidence: unknown;
  packages: string | null;
  remotes: string | null;
  secretInputs: string | null;
  packageLatestVersion: string | null;
  packageLastPublished: string | null;
  packageLicense: string | null;
  packageNotFound: string | null;
  repositoryUrl: string | null;
  websiteUrl: string | null;
  registryRecord: string | null;
  page: string | null;
  id: string;
}

export type McpServerResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: McpServer;
};

export type McpServersCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: McpServer[];
};

export interface PoseKeypoint {
  scheme: string | null;
  schemeName: string | null;
  index: number | null;
  name: string | null;
  altNames: string | null;
  description: string | null;
  group: string | null;
  crosswalkKey: string | null;
  sharedWith: string | null;
  usedBy: string | null;
  source: string | null;
  sourceBranch: string | null;
  sourceSha256: string | null;
  page: string | null;
  id: string;
}

export type PoseKeypointResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: PoseKeypoint;
};

export type PoseKeypointsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: PoseKeypoint[];
};

export interface Vendor {
  id: string;
  label: string | null;
  category: string | null;
  devCost: string | null;
  userSideCost: string | null;
  approvalGate: string | null;
  source: string | null;
  name: string | null;
  page: string;
  hub: string | null;
  record: string;
  sourceLastVerified: string | null;
  pageCount: number | null;
  changeCount: number | null;
  changesPage: string | null;
  changesFeed: string | null;
}

export interface VendorDetail {
  id: string;
  label: string | null;
  category: string | null;
  devCost: string | null;
  userSideCost: string | null;
  approvalGate: string | null;
  source: string | null;
  name: string | null;
  page: string;
  hub: string | null;
  record: string;
  sourceLastVerified: string | null;
  pageCount: number | null;
  changeCount: number | null;
  changesPage: string | null;
  changesFeed: string | null;
  pages: ({
    title: string;
    url: string;
    group: string;
    lastVerified: string | null;
  })[];
  changes: {
    id: string;
    date: string;
    title: string;
    summary: string;
    status: string;
    verifiedOn: string;
    source: string;
    url: string;
  }[];
}

export type VendorResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "id";
  id: string;
  item: VendorDetail;
};

export type VendorsCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "id";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: Vendor[];
};

export type Verified = {
  date: string;
  meaning: string;
};

export interface WearOsDataType {
  name: string;
  kotlinType: string | null;
  dataTypeClass: string | null;
  valueType: string | null;
  dataPointClass: string | null;
  permission: string | null;
  permissionEvidence: string | null;
  addedIn: unknown;
  deprecated: string | null;
  description: string | null;
  googleDocs: string | null;
  page: string | null;
}

export type WearOsDataTypeResponse = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  collection: string;
  key: "name";
  id: string;
  item: WearOsDataType;
};

export type WearOsDataTypesCollection = {
  apiVersion: "v1";
  self: string;
  title: string;
  source: string;
  verified: Verified;
  license: "CC-BY-4.0";
  licenseUrl: string;
  attribution: string;
  citeAs: string;
  dataset: DatasetRef;
  licenseNote?: string;
  sourceTerms?: string;
  description: string;
  methodology: string;
  key: "name";
  itemUrl: string;
  count: number;
  excluded: Excluded[];
  fields: Record<string, string | null>;
  items: WearOsDataType[];
};

/** Every collection path, with the item key and the types it serves. */
export interface Collections {
  "apis": { key: "id"; item: Api; detail: ApiDetail; collection: ApisCollection; response: ApiResponse };
  "bluetooth/gatt-fields": { key: "id"; item: BluetoothGattField; detail: BluetoothGattField; collection: BluetoothGattFieldsCollection; response: BluetoothGattFieldResponse };
  "changes": { key: "id"; item: Change; detail: Change; collection: ChangesCollection; response: ChangeResponse };
  "glossary": { key: "slug"; item: GlossaryTerm; detail: GlossaryTerm; collection: GlossaryTermsCollection; response: GlossaryTermResponse };
  "google-health-api/data-types": { key: "dataType"; item: GoogleHealthDataType; detail: GoogleHealthDataType; collection: GoogleHealthDataTypesCollection; response: GoogleHealthDataTypeResponse };
  "health-connect/permissions": { key: "constant"; item: HealthConnectPermission; detail: HealthConnectPermission; collection: HealthConnectPermissionsCollection; response: HealthConnectPermissionResponse };
  "health-connect/records": { key: "className"; item: HealthConnectRecord; detail: HealthConnectRecord; collection: HealthConnectRecordsCollection; response: HealthConnectRecordResponse };
  "healthkit/metadata-keys": { key: "swiftName"; item: HealthkitMetadataKey; detail: HealthkitMetadataKey; collection: HealthkitMetadataKeysCollection; response: HealthkitMetadataKeyResponse };
  "healthkit/types": { key: "identifier"; item: HealthkitType; detail: HealthkitType; collection: HealthkitTypesCollection; response: HealthkitTypeResponse };
  "matrix": { key: "id"; item: MatrixRow; detail: MatrixRow; collection: MatrixRowsCollection; response: MatrixRowResponse };
  "mcp-servers": { key: "id"; item: McpServer; detail: McpServer; collection: McpServersCollection; response: McpServerResponse };
  "pose/keypoints": { key: "id"; item: PoseKeypoint; detail: PoseKeypoint; collection: PoseKeypointsCollection; response: PoseKeypointResponse };
  "vendors": { key: "id"; item: Vendor; detail: VendorDetail; collection: VendorsCollection; response: VendorResponse };
  "wear-os/data-types": { key: "name"; item: WearOsDataType; detail: WearOsDataType; collection: WearOsDataTypesCollection; response: WearOsDataTypeResponse };
}

export type CollectionPath = keyof Collections;

/** The item key of each collection, at run time. */
export const COLLECTION_KEYS: { readonly [P in CollectionPath]: Collections[P]["key"] } = {
  "apis": "id",
  "bluetooth/gatt-fields": "id",
  "changes": "id",
  "glossary": "slug",
  "google-health-api/data-types": "dataType",
  "health-connect/permissions": "constant",
  "health-connect/records": "className",
  "healthkit/metadata-keys": "swiftName",
  "healthkit/types": "identifier",
  "matrix": "id",
  "mcp-servers": "id",
  "pose/keypoints": "id",
  "vendors": "id",
  "wear-os/data-types": "name",
};
