import { BUILD_PLAN_PAGE, COMPLIANCE_WIZARD_PAGE, STORE_CHECKLIST_PAGE, segsMarkdown, type PlannerPage } from "@/lib/plannerPages";
import { site } from "@/lib/site";
import { PLANNER_SOURCES, STORE_ITEMS } from "@/data/plannerSources.mjs";
import { STORES, STORE_LABELS } from "@/lib/plannerLogic.mjs";
import { interactiveNote, link, type MirrorDoc } from "./core";

/**
 * /tools/build-plan.md, /tools/store-submission-checklist.md and
 * /tools/compliance-wizard.md — each mirrors its page from the same words in
 * src/lib/plannerPages.ts the page renders.
 */
function mirror(page: PlannerPage, what: string): MirrorDoc {
  const body: string[] = [interactiveNote(page.path, what), ""];
  for (const s of page.sections) {
    body.push(`## ${s.heading}`, "");
    for (const b of s.blocks) {
      if (b.kind === "p") body.push(segsMarkdown(b.segs, link), "");
      else body.push(...b.items.map((it) => `- ${segsMarkdown(it, link)}`), "");
    }
  }
  body.push(`A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`);
  return {
    path: page.path,
    title: page.h1,
    description: page.description,
    updated: page.updated,
    type: "tool",
    capsule: page.capsule,
    body,
  };
}

export const buildPlanMirror = () =>
  mirror(BUILD_PLAN_PAGE, "the build-plan form, the generated plan, and the spec and PRD downloads");
/** The checklist mirror also carries every item, as the page's tool renders them all (those your answers do not trigger folded under each store). */
export const storeChecklistMirror = () => {
  const doc = mirror(STORE_CHECKLIST_PAGE, "the store and feature filters, progress saved in your browser");
  const items: string[] = [];
  for (const store of STORES) {
    items.push(`### ${STORE_LABELS[store]}`, "");
    for (const i of STORE_ITEMS.filter((x) => x.store === store)) {
      const s = PLANNER_SOURCES[i.source];
      items.push(`- **${i.title}** (${i.section})`, `  > ${i.quote}`, `  ${link(`${s.publisher}, ${s.title}`, s.url)}`);
    }
    items.push("");
  }
  // After the interactive note, where the page's tool sits.
  doc.body.splice(2, 0, ...items);
  return doc;
};
export const complianceWizardMirror = () =>
  mirror(COMPLIANCE_WIZARD_PAGE, "the nine questions and the regimes your answers point to");
