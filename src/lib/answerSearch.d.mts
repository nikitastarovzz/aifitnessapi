/** Types for src/lib/answerSearch.mjs. */
export type AnswerDoc = {
  kind: "answer" | "faq" | "post" | "change";
  section: string;
  title: string;
  question: string;
  text: string;
  href: string;
  page: string;
  date: string | null;
  firstParty: boolean;
};
export type IndexedDoc = AnswerDoc & { len: number; lowerHead: string; lowerText: string };
export type AnswerIndex = { docs: IndexedDoc[]; postings: Map<string, [number, number][]>; lenSum: number };

export function tokenize(s: string): string[];
export function sitePath(url: string, origin: string): string;
export function docsFromSection(doc: unknown, origin: string): AnswerDoc[];
export function createIndex(): AnswerIndex;
export function addDocs(index: AnswerIndex, docs: AnswerDoc[]): AnswerIndex;
export function search(
  index: AnswerIndex,
  query: string,
  opts?: { limit?: number },
): { doc: IndexedDoc; score: number; matched: number }[];
export function snippet(text: string, query: string, max?: number): { t: string; hit: boolean }[];
