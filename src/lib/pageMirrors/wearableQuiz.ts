import { SCORES } from "@/lib/wearableQuiz.mjs";
import {
  QUESTIONS,
  QUIZ_DESCRIPTION,
  QUIZ_FAQS,
  QUIZ_H1,
  QUIZ_PATH,
  QUIZ_UPDATED,
  quizCapsule,
  quizOutcomePages,
  resultPath,
} from "@/lib/wearableQuizPages";
import { site } from "@/lib/site";
import { faqSection, interactiveNote, link, table, type MirrorDoc } from "./core";

const APPROACH_LABEL: Record<string, string> = { store: "platform stores", direct: "direct APIs", aggregator: "aggregator" };

/** /quiz/which-wearable-api.md — mirrors src/app/quiz/which-wearable-api/page.tsx. */
export function wearableQuizMirror(): MirrorDoc {
  const outcomes = quizOutcomePages();
  const rows = QUESTIONS.flatMap((q) =>
    q.options
      .filter(([v]) => SCORES[q.id]?.[v]?.length)
      .map(([v, label]) => [label, SCORES[q.id][v].map(([ap, pts]) => `${APPROACH_LABEL[ap]} ${pts > 0 ? "+" : ""}${pts}`).join(", ")]),
  );
  return {
    path: QUIZ_PATH,
    title: QUIZ_H1,
    description: QUIZ_DESCRIPTION,
    updated: QUIZ_UPDATED,
    type: "tool",
    capsule: quizCapsule(),
    body: [
      interactiveNote(QUIZ_PATH, "the eight questions"),
      "",
      `Building something other than a wearable-data integration (exercise content, nutrition, motion)? ${link("The three-question fitness API picker", "/picker")} covers every category and routes you to the roundup to read.`,
      "",
      "## The eight results",
      "",
      ...outcomes.map((o) => `- ${link(o.label, resultPath(o.slug))}: ${o.verdict}`),
      "",
      "## How the quiz decides",
      "",
      `The rules are this site’s judgment, printed in full so you can disagree with a specific one. Three answers decide on their own, in this order: needing movement itself, or users with no wearable, gives ${link("camera pose tracking", resultPath("camera-motion"))}; a study under an IRB or ethics board gives ${link("a research platform", resultPath("research-platform"))}; Bluetooth sensors or gym equipment give ${link("reading the sensors directly", resultPath("bluetooth-direct"))}. Otherwise each answer adds or removes points for three approaches, the highest total wins and a tie goes to the platform stores, then direct APIs. The platform-store approach becomes HealthKit, Health Connect or both from your platform answer.`,
      "",
      ...table(["Answer", "Points"], rows),
      "",
      ...faqSection(QUIZ_PATH, QUIZ_FAQS),
      `A free tool from ${site.name}. Nobody pays for placement here; the site is funded by KinesteX, which appears only among the camera results, disclosed. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
