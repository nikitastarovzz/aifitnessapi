export type KPoint = { index: number | null; name: string; key: string };
export type KScheme = { slug: string; shortName: string; indexed: boolean; points: KPoint[] };
export type KRow = { key: string; label: string; cells: { scheme: string; index: number | null; name: string }[] };

export type JointAcross = {
  point: KPoint;
  row: KRow | null;
  cells: { scheme: string; point: KPoint | null }[];
};

export type Mapping = {
  from: KScheme;
  to: KScheme;
  pairs: { key: string; from: KPoint; to: { index: number | null; name: string } }[];
  unmappedFrom: KPoint[];
  unmappedTo: KPoint[];
};

export function schemeOf(schemes: KScheme[], slug: string): KScheme | null;
export function label(p: { index: number | null; name: string }): string;
export function jointAcross(schemes: KScheme[], crosswalk: KRow[], fromSlug: string, key: string): JointAcross | null;
export function mappingBetween(schemes: KScheme[], crosswalk: KRow[], fromSlug: string, toSlug: string): Mapping | null;
export function totalPairs(schemes: KScheme[], crosswalk: KRow[]): { ordered: number; unordered: number; schemePairsWithAny: number };
export function snippet(m: Mapping | null, lang: "ts" | "py", meta: { fetchedOn: string; url: string }): string;
export function parseState(
  schemes: KScheme[],
  search: string,
  defaults: { from: string; to: string; joint: string },
): { from: string; to: string; joint: string };
