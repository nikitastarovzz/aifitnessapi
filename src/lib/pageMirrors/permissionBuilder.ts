import { HK_IDENTIFIERS, HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { HK_READONLY } from "@/data/healthkitWritability";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, type MirrorDoc } from "./core";

const PATH = "/tools/permission-builder";
const UPDATED = "2026-09-04";

/** /tools/permission-builder.md — mirrors src/app/tools/permission-builder/page.tsx. */
export function permissionBuilderMirror(): MirrorDoc {
  return {
    path: PATH,
    title: "HealthKit Permission Builder",
    description:
      "Pick the HealthKit types your app touches: get the Info.plist keys, the toShare/toRead Swift, and Health Connect record names. Read-only types flagged.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "Pick the HealthKit identifiers your app reads or writes and this returns three things: the Info.plist usage-description keys you actually need, the toShare and toRead sets for requestAuthorization(toShare:read:), and the Health Connect record names for the types verified on both platforms. It refuses to put a type in a write set when Apple's own documentation says the samples are read-only, and it shows you Apple's sentence rather than asking you to take its word for it. Everything runs in your browser.",
    body: [
      `${HK_IDENTIFIERS.length} identifiers and ${HK_READONLY.length} documented read-only types · read from Apple’s documentation on ${HK_FETCHED_ON}`,
      "",
      interactiveNote(PATH, "the type picker and snippet generator"),
      "",
      "## The caveat that outlives this page",
      "",
      "Generating a correct authorization call is the easy half. The half that breaks products is what happens afterwards: **HealthKit does not tell you whether the user granted or denied read access.** That is deliberate — reporting it would leak whether a person has health data at all. `authorizationStatus(for:)` reliably reflects only write and share status; for read types it typically returns `.notDetermined` even after a grant.",
      "",
      "So `requestAuthorization` succeeding means the sheet was shown, not that read was granted. Never gate your UI on read-authorization status. Run the query and treat an empty result as *no data or no permission* — the two are indistinguishable, by design. Design the empty state before the happy path.",
      "",
      `- ${link("How to integrate Apple HealthKit", "/integrate/healthkit")} — the guide these snippets follow, step by step.`,
      `- ${link("The HealthKit error that never fires", "/blog/healthkit-error-that-never-fires")} — why an empty read is not a denial, and what to build instead.`,
      "",
      "## Where this output comes from, and where it runs",
      "",
      "Everything on this page runs client-side. Your selection never leaves the browser: there is no request to a server, nothing is stored, and no health data is involved at any point — you are picking type *names*, not data.",
      "",
      `The identifier list is Apple’s own, parsed from their developer documentation on ${HK_FETCHED_ON} and published in full at ${link("every HealthKit type identifier", "/healthkit-identifiers")}. The ${HK_READONLY.length} read-only flags come from the same corpus, each carrying the Apple sentence it was derived from; an identifier absent from that list is *unknown*, not writable, because Apple states writability in prose and silence is not a statement.`,
      "",
      `Android record names come only from the ${link("cross-platform matrix", "/matrix")}, which is restricted to metrics confirmed against both platforms’ documentation. Where a type has no matrix row, the tool says so rather than guessing a record name. Permission string format and client code for Health Connect are not published here because this site has not verified them.`,
      "",
      `Swift symbols are emitted only where the ${link("integration guide", "/integrate/healthkit")} establishes them. \`HKQuantityType(.case)\` is the iOS 16+ initializer; the category and characteristic initializers are not established here, so the generator names those picks in a comment instead of inventing a constructor. Verify every signature against Apple’s current documentation before you ship.`,
      "",
      `A free tool from ${site.name}. Data read from Apple’s published documentation on ${HK_FETCHED_ON}; the machine-readable export is on ${link("datasets", "/datasets")}.`,
      "",
      ...moreToolsSection(PATH),
    ],
  };
}
