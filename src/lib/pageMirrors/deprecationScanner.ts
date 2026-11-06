import { DS_BUNDLE, DS_DESCRIPTION, DS_H1, DS_HOW, DS_PATH, DS_UPDATED, dsActionText, dsActionYaml, dsCapsule, dsScannedEntries } from "@/lib/deprecationScannerText";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

/** /tools/deprecation-scanner.md — mirrors src/app/tools/deprecation-scanner/page.tsx. */
export function deprecationScannerMirror(): MirrorDoc {
  const entries = dsScannedEntries();
  const rows = entries.map((e) => {
    const rs = DS_BUNDLE.rules.filter((r) => r.entry === e.id);
    const matched =
      e.id === "fitbit-web-api"
        ? `Every endpoint path in Fitbit's reference (${DS_BUNDLE.counts.fitbitEndpointRules} paths for ${DS_BUNDLE.counts.fitbitEndpoints} endpoints), its OAuth endpoints on a fitbit.com host, the api.fitbit.com host${rs
            .filter((r) => r.id.startsWith("library:"))
            .map((r) => `, and ${r.label}`)
            .join("")}`
        : rs.map((r) => r.label).join("; ");
    return [
      link(e.name, e.graveyard),
      `${e.statusLabel}. ${e.end ? `${e.endLabel}: ${e.endText}` : e.endLabel}`,
      matched,
      e.replacedBy.length ? e.replacedBy.map((x) => (x.href ? link(x.label, x.href) : x.label)).join("; ") : "None",
    ];
  });
  return {
    path: DS_PATH,
    title: DS_H1,
    description: DS_DESCRIPTION,
    updated: DS_UPDATED,
    type: "tool",
    capsule: dsCapsule(),
    body: [
      interactiveNote(DS_PATH, "the scanner: paste text or open files, and see each hit with its line, the vendor's words and the replacement"),
      "",
      "## Run the same scan in CI",
      "",
      "```yaml",
      dsActionYaml().trimEnd(),
      "```",
      "",
      dsActionText(),
      "",
      "## What it looks for",
      "",
      `${DS_BUNDLE.counts.rules} patterns over ${entries.length} entries of ${link("the Fitness API Graveyard", "/graveyard")}. Status and date are the graveyard’s, which keeps each vendor’s precision: a year stays a year. Each Fitbit hit links its row on ${link("the Fitbit to Google Health API map", "/tools/fitbit-to-google-health")}.`,
      "",
      ...table(["API or SDK", "Status", "What is matched", "Replacement the vendor names"], rows),
      ...(DS_BUNDLE.notScanned.length
        ? ["### What it does not look for", "", ...DS_BUNDLE.notScanned.map((n) => `- ${link(n.name, `/graveyard#${n.entry}`)}: ${n.reason}`), ""]
        : []),
      "## How a hit is decided",
      "",
      ...DS_HOW.map((h, i) => `${i + 1}. ${h.title} ${h.text}`),
      "",
      `A free tool from ${site.name}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(DS_PATH),
    ],
  };
}
