#!/usr/bin/env node
/**
 * Build the downloadable kit files that are COMPILED from pages rather than
 * written separately.
 *
 * The rule that makes this safe: a kit file may only restate what a published
 * page already says, and every row must carry the page it came from. Nothing
 * here is authored — if a fact is not on the site, it does not reach the
 * download, and if a page changes, re-running this regenerates the file
 * instead of leaving a PDF from March contradicting the page.
 *
 *   node scripts/build-kit.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const SITE = "https://aifitnessapi.com";

function entries(file) {
  const src = readFileSync(file, "utf8");
  const m = /=\s*\[/.exec(src);
  if (!m) throw new Error(`${file}: could not find the entries array`);
  return JSON.parse(src.slice(m.index + m[0].length - 1, src.lastIndexOf("]") + 1));
}

// ── BLE assigned numbers, harvested from the /devices cluster ───────────────
// The cluster's UUIDs were each checked against the Bluetooth SIG's public
// assigned-numbers registry when the pages were written. This collects them
// with the name that appears immediately before each one in the prose, which
// is how the pages present them.
/**
 * Curated identifier → name, then machine-checked. Heuristic extraction was
 * tried first and produced names like "Rower 0x2AD1 Indoor bike": a cheat
 * sheet with wrong names is worse than no cheat sheet. So the names are
 * written down once, and the script REFUSES to build unless each one actually
 * appears next to its identifier in the published prose. That keeps the file
 * a compilation of the pages rather than a second, drifting source.
 */
const BLE_NAMES = [
  ["0x180D", "Heart Rate", "service"],
  ["0x1814", "Running Speed and Cadence", "service"],
  ["0x1816", "Cycling Speed and Cadence", "service"],
  ["0x1818", "Cycling Power", "service"],
  ["0x1826", "Fitness Machine Service", "service"],
  ["0x2A37", "Heart Rate Measurement", "characteristic"],
  ["0x2A38", "Body Sensor Location", "characteristic"],
  ["0x2A53", "RSC Measurement", "characteristic"],
  ["0x2A5B", "CSC Measurement", "characteristic"],
  ["0x2A63", "Cycling Power Measurement", "characteristic"],
  ["0x2ACC", "Fitness Machine Feature", "characteristic"],
  ["0x2ACD", "Treadmill", "machine data characteristic"],
  ["0x2ACE", "Cross trainer", "machine data characteristic"],
  ["0x2ACF", "Step climber", "machine data characteristic"],
  ["0x2AD0", "Stair climber", "machine data characteristic"],
  ["0x2AD1", "Rower", "machine data characteristic"],
  ["0x2AD2", "Indoor Bike Data", "machine data characteristic"],
  ["0x2AD3", "Training Status", "characteristic"],
  ["0x2AD4", "Supported Speed Range", "characteristic"],
  ["0x2AD5", "Supported Inclination Range", "characteristic"],
  ["0x2AD6", "Supported Resistance Level Range", "characteristic"],
  ["0x2AD7", "Supported Heart Rate Range", "characteristic"],
  ["0x2AD8", "Supported Power Range", "characteristic"],
  ["0x2AD9", "Fitness Machine Control Point", "control characteristic"],
  ["0x2ADA", "Fitness Machine Status", "status characteristic"],
];

function bleCheatSheet() {
  const pages = entries("src/data/devices.entries.ts");
  const uuidsInProse = new Map(); // uuid -> Set(slug)
  for (const e of pages) {
    for (const m of e.body.matchAll(/0x[0-9A-Fa-f]{4}\b/g)) {
      const uuid = m[0].slice(0, 2) + m[0].slice(2).toUpperCase();
      if (!uuidsInProse.has(uuid)) uuidsInProse.set(uuid, new Set());
      uuidsInProse.get(uuid).add(e.slug);
    }
  }

  // Every identifier the pages mention must be in the curated list, and every
  // curated name must appear immediately before its identifier somewhere.
  const problems = [];
  for (const uuid of uuidsInProse.keys()) {
    if (!BLE_NAMES.some(([u]) => u === uuid)) problems.push(`${uuid} appears on a page but is not named in BLE_NAMES`);
  }
  for (const [uuid, name] of BLE_NAMES) {
    if (!uuidsInProse.has(uuid)) {
      problems.push(`${uuid} is in BLE_NAMES but no page mentions it`);
      continue;
    }
    const near = pages.some((e) =>
      [...e.body.matchAll(new RegExp(uuid, "gi"))].some((m) => {
        const window = e.body.slice(Math.max(0, m.index - 70), m.index).toLowerCase();
        return window.includes(name.toLowerCase());
      }),
    );
    if (!near) problems.push(`"${name}" never appears within 70 characters before ${uuid} on any page`);
  }
  if (problems.length) {
    console.error("BLE cheat sheet refused to build:");
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }

  const out = [
    "# Bluetooth fitness UUID cheat sheet",
    "",
    "Every Bluetooth service and characteristic identifier used across the",
    "connected-devices guides on AIFitnessAPI, in one page. Each was checked",
    "against the Bluetooth SIG's public assigned-numbers registry when the page",
    "it appears on was written, and every row links to the pages that use it so",
    "you can read the claim in context.",
    "",
    "This is a compilation of published pages, not a second source. The build",
    "refuses to run unless every name here appears next to its identifier in the",
    "prose, so the file cannot drift from the pages. Regenerate it with",
    "`node scripts/build-kit.mjs`.",
    "",
    "| Identifier | Name | Kind | Where it is used |",
    "|---|---|---|---|",
  ];
  for (const [uuid, name, kind] of BLE_NAMES) {
    const links = [...uuidsInProse.get(uuid)]
      .sort()
      .map((s) => `[${s}](${SITE}/devices/${s})`)
      .join(", ");
    out.push(`| ${uuid} | ${name} | ${kind} | ${links} |`);
  }
  out.push(
    "",
    `${BLE_NAMES.length} identifiers. Full cluster: ${SITE}/devices`,
    "",
    "Bluetooth® word mark and logos are registered trademarks owned by Bluetooth SIG, Inc.",
    "AIFitnessAPI is not affiliated with Bluetooth SIG. Verify current assignments against",
    "the SIG's own registry before you ship.",
    "",
  );
  writeFileSync("public/kit/ble-fitness-uuid-cheat-sheet.md", out.join("\n"));
  return BLE_NAMES.length;
}

// ── Watch app pre-flight, harvested from the /watch-apps cluster ────────────
// One line per page: the question that page owns, and the answer it opens
// with. A checklist of the decisions, in the cluster's own words.
function watchPreflight() {
  const list = entries("src/data/watchApps.entries.ts");
  const out = [
    "# Watch app pre-flight checklist",
    "",
    "Before you ship a watchOS or Wear OS fitness app, these are the decisions the",
    "platform makes for you and the ones it leaves to you. Each item is the",
    "question one page on AIFitnessAPI owns, with that page's own opening answer",
    "and a link to the full treatment.",
    "",
    "There are no battery, performance or accuracy numbers anywhere in this file,",
    "for the same reason there are none on the pages: battery is the defining",
    "constraint of this platform, and a figure we cannot measure would be worse",
    "than none.",
    "",
    "Generated from the published pages by `scripts/build-kit.mjs`.",
    "",
  ];
  for (const e of list) {
    out.push(`## ${e.h1}`, "", `**${e.primaryQuery}**`, "", e.answer, "", `${SITE}/watch-apps/${e.slug}`, "");
  }
  out.push(`${list.length} items. Full cluster: ${SITE}/watch-apps`, "");
  writeFileSync("public/kit/watch-app-preflight-checklist.md", out.join("\n"));
  return list.length;
}

// ── The decision kit is the same files in one download ─────────────────────
// Rebuilt from the directory every time so the zip can never contain last
// month's version of a checklist that has since been regenerated.
const KIT_FILES = [
  "api-selection-checklist.md",
  "launch-compliance-checklist.md",
  "ble-fitness-uuid-cheat-sheet.md",
  "watch-app-preflight-checklist.md",
  "motion-sdk-scorecard.csv",
  "fitness-apis-2026.csv",
  "healthkit-type-identifiers-2026.csv",
];

/**
 * Datasets the kit re-publishes as downloads.
 *
 * These were previously copied by hand into public/kit and then never touched
 * again, which made them a silent drift risk: public/datasets is regenerated
 * on every content change and the kit copy was not. They are now overwritten
 * from the canonical file on every kit build, so the download and the dataset
 * cannot disagree.
 */
const MIRRORED_DATASETS = ["fitness-apis-2026.csv", "healthkit-type-identifiers-2026.csv"];

function mirrorDatasets() {
  for (const f of MIRRORED_DATASETS) {
    copyFileSync(`public/datasets/${f}`, `public/kit/${f}`);
  }
  return MIRRORED_DATASETS.length;
}

function rebuildZip() {
  execFileSync("zip", ["-q", "-j", "-FS", "fitness-api-decision-kit.zip", ...KIT_FILES], {
    cwd: "public/kit",
  });
  return KIT_FILES.length;
}

const ble = bleCheatSheet();
const watch = watchPreflight();
const mirrored = mirrorDatasets();
const zipped = rebuildZip();
console.log(
  `kit: ble-fitness-uuid-cheat-sheet.md (${ble} rows), ` +
    `watch-app-preflight-checklist.md (${watch} items), ` +
    `${mirrored} datasets mirrored, fitness-api-decision-kit.zip (${zipped} files)`,
);
