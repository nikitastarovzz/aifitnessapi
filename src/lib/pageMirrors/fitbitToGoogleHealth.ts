import { FG_COUNTS, FG_FITBIT_READ_ON, FG_ROWS, FG_UNUSED_GOOGLE_ROWS, FG_UPDATED, type FgStatus } from "@/lib/fitbitGoogleMap";
import { FITBIT_TOOL_DESCRIPTION, fitbitToolCapsule } from "@/lib/schemaToolsText";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

const PATH = "/tools/fitbit-to-google-health";
/** The badge text the page prints for each status (src/components/tools/FitbitGoogleMap.tsx). */
const LABEL: Record<FgStatus, string> = { mapped: "Mapped", partial: "Data only", "name-match": "Name match", unmapped: "Not in Google's tables" };

/** /tools/fitbit-to-google-health.md — mirrors src/app/tools/fitbit-to-google-health/page.tsx. */
export function fitbitToGoogleHealthMirror(): MirrorDoc {
  const pairs = FG_ROWS.flatMap((r) => r.dataTypes.map((d) => [r.title, `${d.googleName} ${d.googleDataType}`, `Google’s row: “${d.fitbitName}”. On Fitbit’s page: ${d.term}`]));
  return {
    path: PATH,
    title: "Fitbit Web API to Google Health API: every endpoint, mapped or not",
    description: FITBIT_TOOL_DESCRIPTION,
    updated: FG_UPDATED,
    type: "tool",
    capsule: fitbitToolCapsule(),
    body: [
      interactiveNote(PATH, "search and filters over every row below"),
      "",
      ...table(
        ["Fitbit endpoint", "Request", "Status", "Why"],
        FG_ROWS.map((r) => [r.title, `${r.method ? `${r.method} ` : ""}${r.paths[0]}`, LABEL[r.status], r.why]),
      ),
      ...table(["Fitbit endpoint", "Google Health API data type", "Basis"], pairs),
      "## How each row is built",
      "",
      `1. Fitbit’s side, verbatim. Title, opening sentence, HTTP method, path and Scope: line from each endpoint page of Fitbit’s Web API reference, read ${FG_FITBIT_READ_ON} through a source snapshot (${FG_COUNTS.endpoints} pages in ${FG_COUNTS.categories} sections).`,
      `2. Scopes: Google’s scope table, from the Fitbit scope on the endpoint’s page.`,
      "",
      ...(FG_UNUSED_GOOGLE_ROWS.length
        ? [
            "## Google rows no endpoint page here names",
            "",
            ...FG_UNUSED_GOOGLE_ROWS.map((g) => `- “${g.fitbitDataType}” → ${g.href ? link(g.googleName, g.href) : g.googleName}`),
            "",
          ]
        : []),
      `A free tool from ${site.name}. Each Google data type has its own page under ${link("the Google Health API reference", "/google-health-api")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
