import { answersBody, answersIndexDoc } from "@/lib/answersIndex";
import type { SectionMeta } from "@/components/tools/AnswerSearch";

/**
 * The sections /answers-search can load, read from the same index document
 * served at /answers/index.json (so the sizes shown are the files' own), less
 * the two sections that hold no searchable prose: the citable facts and the
 * start-here summary, which repeats records found elsewhere.
 */
const SEARCHABLE = new Set(["cluster", "reference", "posts", "changes"]);

export function answerSearchSections(): { sections: SectionMeta[]; totalDocs: number } {
  const doc = answersIndexDoc();
  const sections = doc.sections
    .filter((s) => SEARCHABLE.has(s.kind))
    .map((s) => ({ id: s.id, title: s.title, kind: s.kind, count: s.count, bytes: s.bytes, hub: s.hub }));
  return { sections, totalDocs: searchableDocs() };
}

let DOCS: number | null = null;

/** How many documents the search indexes when every section is ticked: one per page, FAQ, post and change. */
function searchableDocs(): number {
  if (DOCS !== null) return DOCS;
  const b = answersBody();
  const pages = [...b.answers, ...b.reference_pages];
  DOCS =
    pages.length +
    pages.reduce((n, p) => n + p.faqs.length, 0) +
    b.posts.length +
    b.posts.reduce((n, p) => n + p.faqs.length, 0) +
    b.changes.length +
    b.watching.length;
  return DOCS;
}
