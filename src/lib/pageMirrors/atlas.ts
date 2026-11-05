import { ATLAS_DESCRIPTION, ATLAS_H1, ATLAS_PATH } from "@/lib/audienceTools";
import { ATLAS_PDF, ATLAS_SVG, atlasAsOf, atlasCapsule, atlasCategories, atlasMethodLines } from "@/lib/atlasView";
import { absoluteUrl, site } from "@/lib/site";
import { link, type MirrorDoc } from "./core";

/** /atlas.md — mirrors src/app/atlas/page.tsx from the same modules. */
export function atlasMirror(): MirrorDoc {
  const url = absoluteUrl(ATLAS_PATH);
  return {
    path: ATLAS_PATH,
    title: ATLAS_H1,
    description: ATLAS_DESCRIPTION,
    updated: atlasAsOf(),
    type: "record",
    capsule: atlasCapsule(),
    body: [
      `${link("Download PDF (A2)", ATLAS_PDF)} · ${link("Download SVG", ATLAS_SVG)} · ${link("The interactive market map", "/market-map")}`,
      "",
      "## The directory on the poster, as text",
      "",
      ...atlasCategories().flatMap((c) => [
        `### ${c.label}`,
        "",
        ...c.items.map((i) => `- ${link(i.label, `/apis/${i.id}`)}: ${i.billing}${i.gated ? ", approval gate" : ""}`),
        "",
      ]),
      `The poster’s other two sections are the ${link("API graveyard", "/graveyard")} and the ${link("changes tracker", "/changes")}, each entry sourced there.`,
      "",
      "## How the poster is made",
      "",
      ...atlasMethodLines().map((l) => `- ${l}`),
      "",
      `Free to print and share under CC BY 4.0: credit ${site.name} and link ${url}.`,
    ],
  };
}
