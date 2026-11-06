import { awesomeBody } from "@/lib/awesomeList.mjs";
import { AWESOME_DESCRIPTION, AWESOME_GITHUB, AWESOME_H1, AWESOME_METHOD, AWESOME_PATH, awesomeAsOf, awesomeCapsule, awesomePageModel } from "@/lib/awesomeView";
import { absoluteUrl, site } from "@/lib/site";
import { link, type MirrorDoc } from "./core";

/** /awesome.md — mirrors src/app/awesome/page.tsx; the list lines are AWESOME.md's, byte for byte. */
export function awesomeMirror(): MirrorDoc {
  return {
    path: AWESOME_PATH,
    title: AWESOME_H1,
    description: AWESOME_DESCRIPTION,
    updated: awesomeAsOf(),
    type: "record",
    capsule: awesomeCapsule(),
    body: [
      `${link("AWESOME.md on GitHub", AWESOME_GITHUB)} · ${link("Markdown copy", `${AWESOME_PATH}.md`)} · ${link("The datasets behind it", "/datasets")}`,
      "",
      ...awesomeBody(awesomePageModel()),
      "## How the list is made",
      "",
      ...AWESOME_METHOD.map((l) => `- ${l}`),
      "",
      `Free to copy and share under CC BY 4.0: credit ${site.name} and link ${absoluteUrl(AWESOME_PATH)}.`,
    ],
  };
}
