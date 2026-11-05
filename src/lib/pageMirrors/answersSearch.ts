import { answerSearchSections } from "@/lib/answerSearchSections";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/answers-search";
const UPDATED = "2026-11-05";

/** /answers-search.md — mirrors src/app/answers-search/page.tsx. */
export function answersSearchMirror(): MirrorDoc {
  const { totalDocs } = answerSearchSections();
  return {
    path: PATH,
    title: "Answer search",
    description:
      "Search the full text of every answer, FAQ and tracked change on this site, ranked in your browser. Results deep-link to the exact answer.",
    updated: UPDATED,
    type: "tool",
    capsule: `This searches the whole text of the ${totalDocs.toLocaleString("en-US")} answer capsules, FAQ answers, blog-post answers and tracked changes in this site’s per-section answer files, in your browser. Nothing loads until you search: then the sections you have ticked are fetched from /answers/<section>.json, indexed in the tab and ranked, and each result links to the exact answer, down to its #faq-N anchor. The page shows how many bytes it fetched. Your query is not sent anywhere.`,
    body: [
      interactiveNote(PATH, "the search box, the section picker and the ranked results"),
      "",
      "## How this differs from the site search",
      "",
      `${link("The site search", "/search")} and the ⌘K palette use one small index of every page and every FAQ question, with the first 180 characters of each answer, and it first looks for results containing every word you type, falling back to a looser typo match only when none do. That is the right tool for finding a page by name. This page reads the answers themselves, all of every one, and ranks by how rare and how frequent your words are in each (BM25, with questions and titles weighted three times the answer text), so a word that only appears deep inside an answer still finds it, and a result can match most of your words rather than all of them. The last word also matches as a prefix while you type, and an identifier such as stepCount also matches its spelled-out words.`,
      "",
      "## What it loads",
      "",
      `By default, the guide and comparison sections, the blog and the changes tracker; the generated references (one page per Health Connect record, HealthKit identifier, Wear OS data type, Google Health API type and library) are larger and can be ticked under Sections to search. The size shown beside each section is the file as served before compression. The individually citable facts and the start-here summary in ${link("the answer files", "/answers/index.json")} hold no prose of their own and are not searched. The files are rebuilt with the site, so results are as current as the pages.`,
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
