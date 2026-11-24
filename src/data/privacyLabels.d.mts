/** Types for privacyLabels.mjs (the privacy label helper on /tools/store-submission-checklist). */

export type PrivacySource = { claim: string; url: string; quote: string; ev: string };
export type DataType = { category: string; type: string; src: PrivacySource };
export type Gap = { text: string; src: PrivacySource };
export type PrivacyItem = {
  id: string;
  label: string;
  hint: string;
  apple: DataType[] | null;
  google: DataType[] | null;
  gap?: Gap;
  appleNote?: { text: string; src: PrivacySource };
};
export type Where = "stored" | "ephemeral" | "device";
export type Answer = { where: Where | string; linked: boolean; tracking: boolean; shared: boolean; optional: boolean };
export type Selection = Record<string, Answer>;
export type Flag = { label: string; src: PrivacySource };

export type Declared = {
  item: PrivacyItem;
  types: DataType[];
  flags: Flag[];
  rules: PrivacySource[];
  note?: { text: string; src: PrivacySource };
  ephemeral?: boolean;
};
export type Store = {
  declare: Declared[];
  omit: { item: PrivacyItem; why: PrivacySource }[];
  gaps: { item: PrivacyItem; gap: Gap }[];
};

export const PRIVACY_HEADING: string;
export const PRIVACY_MAP_HEADING: string;
export const APPLE_URL: string;
export const GOOGLE_URL: string;
export const PRIVACY_SOURCES: Record<string, PrivacySource>;
export const PRIVACY_ITEMS: PrivacyItem[];
export const WHERE: { id: Where; label: string }[];
export const FLAGS: { id: "linked" | "tracking" | "shared" | "optional"; label: string }[];
export const PURPOSES: { apple: { name: string; src: PrivacySource }[]; google: { name: string; src: PrivacySource }[] };
export const ALWAYS: { apple: PrivacySource[]; google: PrivacySource[] };
export const DEFAULT_ANSWER: Answer;
export function privacyAnswers(selection: Selection): { apple: Store; google: Store };
export function encodeSelection(selection: Selection): string;
export function decodeSelection(text: string): Selection;
