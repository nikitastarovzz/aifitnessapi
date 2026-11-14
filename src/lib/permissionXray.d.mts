import type {
  HcRecord,
  HcFrameworkPermission,
} from "@/data/healthConnectRecords";

export type XraySourceKey =
  | "integrateHealthkit"
  | "clinicalRecords"
  | "backgroundDelivery"
  | "permissionController"
  | "hcPermissions"
  | "builder";

export type XraySource = { path: string; label: string; evidence: { file: string; slug: string } | null };
export type XrayQuote = { text: string; source: XraySourceKey; by: "Apple" | "Google" | "site" };
export type XrayLink = { label: string; href: string };

export type IosKeyDoc = {
  kind: string;
  xcodeName: string | null;
  apple: string | null;
  note?: string;
  use: string;
  source: XraySourceKey;
  appleUrl: string | null;
};

export const HC_PREFIX: string;
export const SITE_URL: string;
export const TOOL_PATH: string;
export const MAX_INPUT: number;
export const SOURCES: Record<XraySourceKey, XraySource>;
export const IOS_KEYS: Record<string, IosKeyDoc>;
export const IOS_ACCESS_VALUES: Record<string, { apple: string; note: string; source: XraySourceKey }>;
export const QUOTES: Record<string, XrayQuote>;
export const RATIONALE_ACTION: string;
export const PERMISSION_USAGE_ACTION: string;
export const HEALTH_PERMISSIONS_CATEGORY: string;
export const BUILDER_PLACEHOLDER: string;

export type AndroidRecordRef = { className: string; label: string; category: string | null; access: "read" | "write"; path: string };
export type AndroidPermissionRef = {
  constant: string;
  description: string | null;
  protectionLevel: string | null;
  added: string | null;
  group: string | null;
  label: string | null;
  records: AndroidRecordRef[];
  path: string;
};
export type AndroidReference = {
  fetchedOn: string;
  frameworkUrl: string | null;
  dataTypesUrl: string | null;
  count: number;
  permissions: Record<string, AndroidPermissionRef>;
  unresolved: Record<string, { classNames: string[]; frameworkNear: string | null; path: string }>;
};

export type HcModuleSlice = {
  HC_RECORDS: Pick<HcRecord, "className" | "slug" | "dataTypeLabel" | "category" | "readPermissions" | "writePermissions">[];
  HC_FRAMEWORK_PERMISSIONS: HcFrameworkPermission[];
  HC_ADDITIONAL_READ_PERMISSIONS?: { permission: string; label: string }[];
  HC_UNRESOLVED_PERMISSIONS?: { className: string; permission: string }[];
  HC_FETCHED_ON: string;
  HC_FW_PERMISSIONS_URL?: string;
  HC_DATA_TYPES_URL?: string;
};

export function buildAndroidReference(
  hc: HcModuleSlice,
  helpers?: {
    recordPath?: (r: Pick<HcRecord, "slug">) => string;
    permissionAnchor?: (p: string) => string;
    groupOf?: (p: HcFrameworkPermission) => string | null;
    availability?: (added: string | null) => string | null;
  },
): AndroidReference;

export type AndroidScan = {
  requested: { permission: string; element: string; attrs: string[]; lines: number[]; count: number }[];
  referenced: { permission: string; where: "attribute" | "text"; detail: string; line: number }[];
  commentedOut: string[];
  otherPermissions: string[];
  usesPermissionCount: number;
  hasRationale: boolean;
  hasPermissionUsageAction: boolean;
  hasPermissionUsage: boolean;
};
export function scanAndroid(input: string): AndroidScan;

export type IosValue = {
  type: "string" | "boolean" | "array" | "other" | "missing";
  value: string | boolean | string[] | null;
  line: number;
  form: "plist" | "json" | "mention";
};
export type IosKeyFound = IosValue & { key: string; count: number };
export function scanIos(input: string): { keys: IosKeyFound[] };

export type AndroidRow = {
  platform: "android";
  item: string;
  short: string;
  how: string;
  byName: "read" | "write" | "other";
  requested: boolean;
  lines: number[];
  count: number;
  status: "known" | "unresolved" | "unknown";
  grants: string | null;
  label?: string | null;
  group?: string | null;
  added?: string | null;
  protectionLevel?: string | null;
  classNames?: string[];
  frameworkNear?: string | null;
  records: AndroidRecordRef[];
  links: XrayLink[];
};

export type IosRow = {
  platform: "ios";
  item: string;
  kind: string;
  xcodeName: string | null;
  value: IosValue;
  status: "known" | "unknown";
  grants: string | null;
  note: string | null;
  links: XrayLink[];
};

export type XrayFinding = {
  level: "warn" | "note";
  id: string;
  text: string;
  quote: { text: string; by: "Apple" | "Google" | "site" } | null;
  source: XrayLink | null;
};

export type XrayCounts = {
  androidRequested: number;
  androidRead: number;
  androidWrite: number;
  androidOther: number;
  androidKnown: number;
  androidUnresolved: number;
  androidUnknown: number;
  androidReferencedOnly: number;
  androidRecords: number;
  androidOtherPermissions: number;
  iosKeys: number;
  iosKnown: number;
  iosUnknown: number;
  warnings: number;
  notes: number;
};

export type XrayReport = {
  empty: boolean;
  truncated: boolean;
  androidRows: AndroidRow[];
  iosRows: IosRow[];
  otherPermissions: string[];
  findings: XrayFinding[];
  counts: XrayCounts;
  referenceDate: string;
};

export function xray(input: string, ref: AndroidReference): XrayReport;
export function valueText(v: IosValue | null | undefined): string;
export function androidGrants(r: AndroidRow): string;
export function iosGrants(r: IosRow): string;
export function quoteLead(by: "Apple" | "Google" | "site"): string;
export function findingText(f: XrayFinding): string;
export function toMarkdown(report: XrayReport, opts?: { siteUrl?: string }): string;
