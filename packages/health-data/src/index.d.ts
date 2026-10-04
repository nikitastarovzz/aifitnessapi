export type HkFamily =
  | "HKQuantityTypeIdentifier"
  | "HKCategoryTypeIdentifier"
  | "HKCharacteristicTypeIdentifier"
  | "HKWorkoutActivityType";

export interface HealthKitIdentifier {
  identifier: string;
  objcConstant: string;
  family: HkFamily;
  group: string;
  abstract: string | null;
  /** Quantity types only; null when not applicable or unstated by Apple. */
  aggregation: "cumulative" | "discrete" | null;
  /** Quantity types only. */
  unitFamily: string | null;
  /** Category types only: the HKCategoryValue enum that decodes the sample. */
  valueEnum: string | null;
  iosIntroduced: string | null;
  watchosIntroduced: string | null;
  /** "yes" when any platform entry in Apple's availability data carries a
   *  deprecatedAt version (Apple's own `deprecated` flag is not used). */
  deprecated: "yes" | "no";
  /** The iOS deprecatedAt version; null when iOS carries none. */
  iosDeprecated: string | null;
  /** Apple's deprecation note, verbatim; null where Apple says nothing. */
  deprecationNote: string | null;
  /** The rename target Apple's availability data names; null where none. */
  renamedTo: string | null;
  /** "no" when Apple ships the type with no abstract and no discussion. */
  appleDocumented: "yes" | "no";
  appleDocs: string;
}

export interface CrossPlatformType {
  id: string;
  label: string;
  appleHealthKit: string;
  androidHealthConnect: string;
  watchOut: string | null;
  source: string;
}

export interface ApiChange {
  date: string;
  sortDate: string;
  title: string;
  summary: string;
  status: "confirmed" | "reported" | "watch";
  source: string;
  sourceLabel: string;
  verifiedOn: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  group: string;
  href: string;
  anchor: string;
  id: string;
}

export interface HealthConnectRecord {
  className: string;
  qualifiedName: string;
  dataType: string;
  category: string | null;
  recordShape: string | null;
  unitClass: string | null;
  /** Semicolon-separated, as in the CSV. */
  mandatoryFields: string | null;
  /** Semicolon-separated android.permission.health strings. */
  readPermissions: string | null;
  writePermissions: string | null;
  /** The data-types table text the permission strings were read from. */
  permissionEvidence: string;
  /** Semicolon-separated AggregateMetric constants; null where none. */
  aggregateMetrics: string | null;
  addedIn: string | null;
  featureFlag: string | null;
  deprecated: "yes" | "no";
  description: string | null;
  googleDocs: string;
  sourceUpdated: string | null;
  page: string;
}

export interface HealthConnectPermission {
  constant: string;
  permission: string;
  description: string | null;
  protectionLevel: string | null;
  added: string | null;
  /** Semicolon-separated record classes; null where no record class names it. */
  records: string | null;
}

export interface HealthKitMetadataKey {
  swiftName: string;
  objcName: string | null;
  group: string;
  subgroup: string | null;
  /** Derived from Apple's sentence in valueTypeEvidence; null where Apple does not state it. */
  valueType: string | null;
  valueTypeEvidence: string | null;
  iosIntroduced: string | null;
  watchosIntroduced: string | null;
  deprecated: "yes" | "no";
  abstract: string | null;
  appleDocs: string;
  page: string;
}

export interface WearOsDataType {
  name: string;
  kotlinType: string;
  dataTypeClass: string;
  valueType: string;
  dataPointClass: string;
  /** Null where Google's permissions table does not name the constant. */
  permission: string | null;
  /** The permissions-table row the permission was read from. */
  permissionEvidence: string | null;
  addedIn: string | null;
  deprecated: "yes" | "no";
  description: string | null;
  googleDocs: string;
  page: string;
}

export declare const healthkitIdentifiers: HealthKitIdentifier[];
export declare const crossPlatformTypes: CrossPlatformType[];
export declare const apiChanges: ApiChange[];
export declare const glossary: GlossaryTerm[];
export declare const healthConnectRecords: HealthConnectRecord[];
export declare const healthConnectPermissions: HealthConnectPermission[];
export declare const healthkitMetadataKeys: HealthKitMetadataKey[];
export declare const wearOsDataTypes: WearOsDataType[];
export declare const meta: Record<string, Record<string, unknown>>;

export declare function healthkitIdentifier(name: string): HealthKitIdentifier | undefined;
export declare function aggregationFor(name: string): "cumulativeSum" | "discrete" | null;
export declare function crossPlatform(metricId: string): CrossPlatformType | undefined;
export declare function healthConnectRecord(name: string): HealthConnectRecord | undefined;
export declare function healthConnectPermission(name: string): HealthConnectPermission | undefined;
export declare function healthkitMetadataKey(name: string): HealthKitMetadataKey | undefined;
export declare function wearOsDataType(name: string): WearOsDataType | undefined;
