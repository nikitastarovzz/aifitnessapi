export type SwitchStore = "healthkit" | "healthConnect";
/** [type id, file index, line] */
export type SwitchItem = [string, number, number];
export type SwitchLib = {
  slug: string;
  name: string;
  group: string;
  stores: SwitchStore[];
  ref: string;
  readOn: string;
  blob: string;
  files: string[];
  items: Record<SwitchStore, SwitchItem[]>;
};
export type SwitchTypes = Record<string, { s: SwitchStore; n: string; p: string }>;
export type SwitchEntry = { id: string; from: SwitchItem | null; to: SwitchItem | null };
export type SwitchStoreDiff = {
  store: SwitchStore;
  fromReads: boolean;
  toReads: boolean;
  keep: SwitchEntry[];
  lose: SwitchEntry[];
  gain: SwitchEntry[];
};

export function compactLibraries(
  libraries: unknown[],
  pathFor: (item: { store: SwitchStore; id: string; name: string }) => string,
): { libs: SwitchLib[]; types: SwitchTypes };
export function lineUrl(lib: SwitchLib, item: SwitchItem): string;
export function switchDiff(from: SwitchLib, to: SwitchLib): SwitchStoreDiff[];
