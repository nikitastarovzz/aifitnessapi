import { COVERAGE_METRICS, DELIVERY_LABELS, KIND_LABELS, cellState } from "@/lib/vendorCoverage.mjs";
import { ALL_COVERAGE_VENDORS, COVERAGE_CHECKED, COVERAGE_PATH, COVERAGE_UPDATED, RATE_LIMIT_PATH, coverageCapsule } from "@/lib/coverageView";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

const quoted = (src: { quote: string; table?: boolean }) => (src.table ? `Google's table: ${src.quote}` : `“${src.quote}”`);

/** /tools/api-coverage-matrix.md — mirrors src/app/tools/api-coverage-matrix/page.tsx:
 *  the whole matrix and every vendor's sourced facts, from lib/coverageView. */
export function apiCoverageMatrixMirror(): MirrorDoc {
  // The same marks the page's grid prints: ✓, ✗ or ?, with the resolution under a ✓ or ✗.
  const mark = (s: string) => (s === "yes" ? "✓" : s === "no" ? "✗" : "?");
  const grid = table(
    ["Vendor", ...COVERAGE_METRICS.map((m) => m.label)],
    ALL_COVERAGE_VENDORS.map((v) => [
      `${v.name} (${KIND_LABELS[v.kind]})`,
      ...COVERAGE_METRICS.map((m) => {
        const { state, cell } = cellState(v, m.id);
        return cell?.res ? `${mark(state)} ${cell.res}` : mark(state);
      }),
    ]),
  );

  const vendors = ALL_COVERAGE_VENDORS.flatMap((v) => {
    const facts = (items: { note: string; src: { url: string; quote: string; table?: boolean } }[]) =>
      items.length ? items.map((f) => `- ${f.note} — ${quoted(f.src)} (${link("source", f.src.url)})`) : ["- Not stated in the pages read."];
    const resolution = [
      ...COVERAGE_METRICS.flatMap((m) => {
        const c = v.cells[m.id];
        return c?.res ? [{ note: `${m.label}: ${c.res}`, src: c.src }] : [];
      }),
      ...(v.resolution ?? []),
    ];
    return [
      `### ${v.name}`,
      "",
      `${KIND_LABELS[v.kind]} · sources read ${COVERAGE_CHECKED[v.id] ?? "unknown"} · ${link("guide", v.guide)}`,
      "",
      "**Delivery**",
      "",
      ...facts(v.delivery.map((d) => ({ note: `${DELIVERY_LABELS[d.mode]}: ${d.note}`, src: d.src }))),
      "",
      "**History and backfill**",
      "",
      ...facts(v.history),
      "",
      "**Data resolution**",
      "",
      ...facts(resolution),
      "",
      "**Metrics**",
      "",
      ...facts(
        COVERAGE_METRICS.flatMap((m) => {
          const { state, cell } = cellState(v, m.id);
          return cell ? [{ note: `${m.label}${state === "no" ? " (not available)" : ""}: ${cell.note}`, src: cell.src }] : [];
        }),
      ),
      "",
    ];
  });

  return {
    path: COVERAGE_PATH,
    title: "Which wearable APIs expose which metrics",
    description:
      "Which wearable and fitness APIs document heart rate, HRV, sleep, SpO2, glucose and more, at what resolution, how far back, and by webhook or pull. Sourced.",
    updated: COVERAGE_UPDATED,
    type: "tool",
    capsule: coverageCapsule(),
    body: [
      interactiveNote(COVERAGE_PATH, "filters by metric, vendor and webhook support, with the view kept in the URL"),
      "",
      ...grid,
      "✓ documented (links to the vendor page) · ✗ the vendor says it is not available · ? not stated in the pages read (links to our guide). Hover a mark for the vendor’s words.",
      "",
      ...vendors,
      "## How to read it",
      "",
      "- A ✓ means the vendor’s own page names the metric; it links that page, and the vendor’s words are in the card below the table. It says nothing about which devices record it or which plan unlocks it: Oura’s SpO2 is Gen 3 only, Garmin’s beat-to-beat interval is an Enterprise item, and COROS’s daily metrics come through its MCP rather than the Partner API.",
      `- A ? means none of the pages read for that vendor’s ${link("integration guide", "/integrate")} mentions it. The vendor may well offer it; this table will not say so until a page does.`,
      "- Resolution is shown only where the vendor states an interval or grouping, such as Oura’s and Polar’s 5-minute heart rate or the storage resolution in Google’s data-types table. A daily summary and a per-second stream are not interchangeable, so check the cell before you plan a chart.",
      "- History is the most volatile column and the least documented: Polar returns 28 or 30 days, Garmin Starter none, COROS three months, Dexcom 30 days per request; several vendors state no depth at all.",
      "",
      "## HealthKit and Health Connect",
      "",
      `The two on-device stores are not columns here: your app reads them on the phone, and the question there is which type identifier to ask for, which is the ${link("HealthKit ↔ Health Connect type reference", "/matrix")}. Each metric chip above maps to a row there where one exists. How hard you can call each cloud API is a separate question, answered by the ${link("rate-limit calculator", RATE_LIMIT_PATH)}.`,
      "",
      "## How this is built",
      "",
      "- Every mark, delivery note and history note quotes a vendor page already cited by that vendor’s integration guide, copied from the guide’s evidence file. A test fails the build if a quote is not in that file under the same URL, and a weekly job re-checks the evidence against the live pages.",
      "- The Google Health API column is built from Google’s data-types table as the site’s generator last fetched it, so its resolution and webhook flags are Google’s, row by row.",
      "- The “sources read” date on each card is the date its guide was last verified. The Fitbit Web API is not listed: Google’s timeline sets its turn-off for November 2, 2026, with the Google Health API as its successor.",
      "",
      `A free tool from ${site.name}. Comparing two APIs on access and cost instead: ${link("compare two fitness APIs side by side", "/compare-apis")}. More at ${link("free tools for health-app builders", "/tools")}.`,
      "",
      ...moreToolsSection(COVERAGE_PATH),
    ],
  };
}
