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
  deprecated: "yes" | "no";
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

export declare const healthkitIdentifiers: HealthKitIdentifier[];
export declare const crossPlatformTypes: CrossPlatformType[];
export declare const apiChanges: ApiChange[];
export declare const glossary: GlossaryTerm[];
export declare const meta: Record<string, Record<string, unknown>>;

export declare function healthkitIdentifier(name: string): HealthKitIdentifier | undefined;
export declare function aggregationFor(name: string): "cumulativeSum" | "discrete" | null;
export declare function crossPlatform(metricId: string): CrossPlatformType | undefined;
