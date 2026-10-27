import type { ClusterEntry } from "./cluster";

export const TRANSLATION_ROOT: string;
export const LOCALES: Record<string, { dir: string; lang: string; ogLocale: string }>;

export type StoredTranslation = {
  file: string;
  prefix: string;
  lang: string;
  /** The English page this translates, e.g. "/integrate/garmin-api". */
  enPath: string;
  /** The translated page's own path, e.g. "/pt-br/integrate/garmin-api". */
  path: string;
  translatedOn: string;
  /** The English page's `updated` stamp at the moment it was translated. */
  sourceUpdated: string;
  sourceHash: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answer: string;
  cta: string;
  faqs: { q: string; a: string }[];
  /** English hrefs, in the English entry's order; localized at render. */
  related: { href: string; label: string }[];
  steps: { name: string; text: string }[];
  body: string;
};

export function translatableFields(entry: ClusterEntry): Record<string, unknown>;
export function translationHash(entry: ClusterEntry): string;
export function loadTranslations(prefix?: string, root?: string): StoredTranslation[];
export function loadEnglishEntries(clusters: string[], root?: string): Map<string, ClusterEntry>;
export function translationStatus(
  t: StoredTranslation,
  enEntry: ClusterEntry | undefined,
): { status: "current" | "stale" | "orphan"; currentHash: string | null };
