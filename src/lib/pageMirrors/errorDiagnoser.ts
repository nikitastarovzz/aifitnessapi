import { HK_ERRORS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { diagnoserFixEntries } from "@/lib/errorDiagnoserKeywords";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/error-diagnoser";

/** /tools/error-diagnoser.md — mirrors src/app/tools/error-diagnoser/page.tsx. */
export function errorDiagnoserMirror(): MirrorDoc {
  return {
    path: PATH,
    title: "Which error is this?",
    description:
      "Paste an error string and get the matching HKError.Code case in Apple's own wording plus the guide that covers it. Runs client-side, nothing invented.",
    updated: HK_FETCHED_ON,
    type: "tool",
    capsule: `Paste an error string — an \`NSError\` description, an HTTP status line, a chunk of log — and this matches it against the ${HK_ERRORS.length} \`HKError.Code\` cases read from Apple’s documentation on ${HK_FETCHED_ON}, and against the ${diagnoserFixEntries().length} troubleshooting guides published on this site. It shows Apple’s own wording for a matched case and each guide’s own summary — it does not write a diagnosis, and when nothing matches it says so.`,
    body: [
      interactiveNote(PATH, "the error matcher"),
      "",
      "## How this works",
      "",
      "Everything runs client-side from this site’s published dataset. There is no API call, no upload, and no model: the text you paste stays in your browser and is matched by string overlap against two indexes built at build time.",
      "",
      `The first index is every \`HKError.Code\` case Apple documents, with the abstract and discussion quoted verbatim — the generator \`scripts/fetch-healthkit-identifiers.mjs\` read them from Apple’s documentation on ${HK_FETCHED_ON}. The second is an authored map of error strings to the troubleshooting guides on this site; the sentence shown for each guide is that guide’s own summary, not a re-description of your problem.`,
      "",
      `Apple does not publish the numeric raw values behind \`HKError.Code\`, so a bare \`Code=5\` cannot be resolved to a name from anything Apple states publicly, and this tool will not guess one. The underlying data is downloadable — ${link("open datasets, CC BY 4.0", "/datasets")}.`,
      "",
      `A free tool from ${site.name}. The full references are ${link("every HealthKit error code", "/healthkit-errors")} and ${link("fitness & health API troubleshooting", "/fix")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
