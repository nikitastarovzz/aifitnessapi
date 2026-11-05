import { HK_FETCHED_ON } from "@/data/healthkitIdentifiers";
import { ALL_TOOLS, TOOL_LOOKUPS, TOOL_PLANNERS, type Tool } from "@/lib/toolRegistry";
import { site } from "@/lib/site";
import { link, type MirrorDoc } from "./core";

const toolLines = (tools: Tool[]) => tools.map((t) => `- ${link(t.name, t.path)}: ${t.blurb}`);

/** /tools.md — mirrors src/app/tools/page.tsx. */
export function toolsHubMirror(): MirrorDoc {
  return {
    path: "/tools",
    title: "Free tools for health-app builders",
    description:
      "Free browser tools for health-app builders: error lookup, webhook verifier, test data, keypoint mapper, pose benchmark, heart-rate and step labs.",
    updated: HK_FETCHED_ON,
    type: "tools-index",
    capsule:
      `${ALL_TOOLS.length} tools that answer a question with a lookup or a measurement instead of an essay. Every one runs in your browser: the lookups off this site’s published datasets — the HealthKit identifier set read from Apple’s documentation on ${HK_FETCHED_ON}, the HealthKit ↔ Health Connect matrix verified against both vendors, and the API directory — the webhook verifier off each vendor’s own documented signing rule, the pose benchmark and step lab on your own device, and the heart-rate lab on the bytes your own Bluetooth strap sends. No account, no server round trip, and nothing invented where the source is silent. Your camera frames, motion and Bluetooth data never leave the device; the one outbound request is Google’s own MediaPipe library, used by the pose benchmark, which sends Google a usage log of timing counters, as that page explains.`,
    body: [
      "## Lookups and generators",
      "",
      "Built on the HealthKit identifier dataset, the verified cross-platform matrix, the pose keypoint dataset and, for webhooks, the vendors’ own signing rules.",
      "",
      ...toolLines(TOOL_LOOKUPS),
      "",
      "## Planners and demos",
      "",
      "Decision support for picking a stack, one demo of the bug that costs the most debugging time, a pose-model benchmark that times Google’s published models on your hardware, a heart-rate lab that decodes your own strap’s Bluetooth notifications, a step lab that shows why two step counters disagree, and a daily five-question puzzle drawn from the same datasets.",
      "",
      ...toolLines(TOOL_PLANNERS),
      "",
      "## What these tools will not do",
      "",
      "None of them will fill a gap in the source to look more complete. Where Apple’s wording does not state a type’s aggregation style, the checker says *not stated*. Where no cross-platform pair has been verified against both vendors’ documentation, the translator says there is no verified counterpart rather than transliterating a name. Where a pasted error matches nothing, the diagnoser says so and links the full reference. A tool that always returns an answer is a tool that sometimes returns a wrong one.",
      "",
      `The datasets underneath are published under CC BY 4.0, so you can check any answer yourself or build your own lookup on top — ${link("open datasets", "/datasets")}.`,
      "",
      `Free tools from ${site.name}. The references behind them: ${link("every HealthKit type identifier", "/healthkit-identifiers")}, ${link("every HealthKit error code", "/healthkit-errors")}, and the ${link("HealthKit ↔ Health Connect matrix", "/matrix")}.`,
    ],
  };
}
