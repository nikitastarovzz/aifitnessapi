import {
  CHEATSHEET_BLURBS,
  CHEATSHEETS_DESCRIPTION,
  CHEATSHEETS_H1,
  CHEATSHEETS_METHOD,
  CHEATSHEETS_PATH,
  COLLECTIONS_DESCRIPTION,
  COLLECTIONS_H1,
  COLLECTIONS_IMPORT,
  COLLECTIONS_METHOD,
  COLLECTIONS_PATH,
  COLLECTIONS_SOURCES,
  cheatSheets,
  cheatSheetsAsOf,
  cheatSheetsCapsule,
  collectionIndex,
  collectionsAsOf,
  collectionsCapsule,
  kb,
} from "@/lib/kitPages";
import { absoluteUrl, site } from "@/lib/site";
import { link, type MirrorDoc } from "./core";

/** /collections.md — mirrors src/app/collections/page.tsx from the same index. */
export function collectionsMirror(): MirrorDoc {
  return {
    path: COLLECTIONS_PATH,
    title: COLLECTIONS_H1,
    description: COLLECTIONS_DESCRIPTION,
    updated: collectionsAsOf(),
    type: "record",
    capsule: collectionsCapsule(),
    body: [
      "## Download a collection",
      "",
      ...collectionIndex().flatMap((c) => [
        `### ${c.name}`,
        "",
        ...c.folders.map((f) => `- ${f.name}: ${f.requests.join("; ")}`),
        `- Variables: ${c.variables.map((v) => `{{${v}}}`).join(", ")}`,
        `- ${link(`Postman v2.1 (${kb(c.postmanBytes)})`, c.postman)} · ${link(`Bruno folder, .zip (${kb(c.brunoBytes)})`, c.bruno)}`,
        "",
      ]),
      "## Import into Postman",
      "",
      ...COLLECTIONS_IMPORT.postman.map((l, i) => `${i + 1}. ${l}`),
      "",
      "## Open in Bruno",
      "",
      ...COLLECTIONS_IMPORT.bruno.map((l, i) => `${i + 1}. ${l}`),
      "",
      `Steps from ${COLLECTIONS_SOURCES.map((s) => link(s.label, s.url)).join(", ")}, read 2026-11-06.`,
      "",
      "## How the collections are made",
      "",
      ...COLLECTIONS_METHOD.map((l) => `- ${l}`),
      "",
      `The facts behind each request, with the vendor sentence they rest on, are on the ${link("OAuth playground", "/tools/oauth-playground")} and in the ${link("webhook payload library", "/webhooks")}. Free to share under CC BY 4.0: credit ${site.name} and link ${absoluteUrl(COLLECTIONS_PATH)}.`,
    ],
  };
}

/** /cheat-sheets.md — mirrors src/app/cheat-sheets/page.tsx from the same manifest. */
export function cheatSheetsMirror(): MirrorDoc {
  return {
    path: CHEATSHEETS_PATH,
    title: CHEATSHEETS_H1,
    description: CHEATSHEETS_DESCRIPTION,
    updated: cheatSheetsAsOf(),
    type: "record",
    capsule: cheatSheetsCapsule(),
    body: [
      ...cheatSheets().flatMap((s) => {
        const b = CHEATSHEET_BLURBS[s.slug];
        return [
          `## ${s.title}`,
          "",
          `${link(`PDF (${kb(s.pdfBytes)})`, s.pdf)} · ${link(`PNG (${kb(s.pngBytes)})`, s.png)}`,
          "",
          b.what,
          "",
          `From ${b.from}; sources read ${s.asOf}. ${link(b.page.label, b.page.href)}.`,
          "",
        ];
      }),
      "## How the sheets are made",
      "",
      ...CHEATSHEETS_METHOD.map((l) => `- ${l}`),
      "",
      `Free to print, pin and share under CC BY 4.0: credit ${site.name} and link ${absoluteUrl(CHEATSHEETS_PATH)}.`,
    ],
  };
}
