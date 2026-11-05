import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/stack-generator";
const UPDATED = "2026-09-04";

/** /tools/stack-generator.md — mirrors src/app/tools/stack-generator/page.tsx. */
export function stackGeneratorMirror(): MirrorDoc {
  return {
    path: PATH,
    title: "Generate your stack",
    description:
      "Answer four questions, get a concrete stack: the health data types, the APIs that fit, and the reason each survived the cut. Built from verified data.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "Four questions — what you are building, which platforms ship, how much wearable data you need, and whether the team is optimizing for speed or control — and you get the HealthKit types that category touches and the APIs that survive those answers, each one carrying the reason it survived. The reasons are fields, not opinions: how the product bills developers, what every end user must own, what approval gates your launch, and our published rough judgment of the integration work.",
    body: [
      interactiveNote(PATH, "the four-question stack builder"),
      "",
      "## What this will not do",
      "",
      `It will not rank. There is no score behind the ordering — products are filtered by your answers and then sorted by the same fields the ${link("comparison tool", "/compare-apis")} prints, with the sort key stated on screen so you can disagree with it. The one judgment in the model, integration effort, is labeled as ours everywhere it appears, because it is the only field in ${link("the directory", "/apis")} that is not backed by a published sentence.`,
      "",
      "It will also not fill an empty result. Some combinations exclude everything a category lists — a web-and-backend-only product that wants platform-store data has nowhere to read it from, because both stores are on-device — and the tool says so instead of offering a consolation pick. When that happens, the exclusions are the answer: loosen the constraint you can live with, or plan to build that layer.",
      "",
      `For a whole-stack cost shape at your user count, use ${link("the cost planner", "/cost-planner")}. For a starting recommendation before you know the category, ${link("the picker", "/picker")} asks three broader questions. For the full type reference behind the table, ${link("every HealthKit type identifier", "/healthkit-identifiers")} lists all of them with the platform each was introduced on.`,
      "",
      ...moreToolsSection(PATH),
      link("All tools", "/tools"),
    ],
  };
}
