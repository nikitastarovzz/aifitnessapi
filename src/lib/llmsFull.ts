import { site, absoluteUrl } from "@/lib/site";
import { COVERAGE_PATH, RATE_LIMIT_PATH, coverageCapsule, rateLimitCapsule } from "@/lib/coverageView";
import { TASKS_VISION_VERSION, VERIFIED_ON as POSE_BENCH_VERIFIED_ON } from "@/lib/poseBenchmark";
import { FORM_RULES_PRIMARY_QUERY, REP_PLAYGROUND_PRIMARY_QUERY, formRulesText, leaderboardText, repPlaygroundText } from "@/lib/poseToolsText";
import {
  ATLAS_PATH,
  GYM_PATH,
  GYM_PRIMARY_QUERY,
  RESEARCH_PATH,
  RESEARCH_PRIMARY_QUERY,
  TAXONOMY_PATH,
  TAXONOMY_PRIMARY_QUERY,
  gymCapsule,
  matrixText,
  researchCapsule,
  taxonomyText,
} from "@/lib/audienceTools";
import { atlasCapsule } from "@/lib/atlasView";
import { GYM_API_MATRIX } from "@/data/gymApiMatrix";
import { RESEARCH_PLATFORM_MATRIX } from "@/data/researchPlatformMatrix";
import { POSE_CROSSWALK, POSE_KEYPOINTS_FETCHED_ON, POSE_SCHEMES } from "@/data/poseKeypoints";
import { totalPairs } from "@/lib/keypointMapping.mjs";
import { DEFAULT_PARAMS as STEP_DEFAULTS, REPLAY_TRUE_STEPS as STEP_REPLAY_TRUE } from "@/lib/stepDetector.mjs";
import { SOURCES_CHECKED_ON as STEP_LAB_CHECKED_ON } from "@/lib/stepLab";
import {
  CHALLENGE_SECONDS as REP_CHALLENGE_SECONDS,
  COUNTDOWN_SECONDS as REP_COUNTDOWN_SECONDS,
  EXERCISES as REP_EXERCISES,
  MIN_HOLD_MS as REP_MIN_HOLD_MS,
  describeZone,
} from "@/lib/repCounter.mjs";
import { getAllPosts } from "@/lib/posts";
import { slides as yearSlides, storyTitle as yearTitle } from "@/lib/year2026";
import { graveyardCopy } from "@/lib/graveyardCopy";
import { EVENTS as SHIP_IT_EVENTS, PATH as SHIP_IT_PATH, RUNWAY_WEEKS as SHIP_IT_RUNWAY } from "@/lib/shipIt";
import { GLANCE_HUBS, hubQa, segText } from "@/data/hubGlance";
import { moneyPages, MONEY_GROUP_LABELS, MONEY_GROUP_ORDER } from "@/data/moneyPages";
import { releasedEntries, PILLAR_PATH } from "@/data/fitnessApis";
import { releasedGuides, GUIDES_PATH } from "@/data/guides";
import { releasedBuilds, BUILD_PATH } from "@/data/build";
import { releasedIntegrations, INTEGRATE_PATH } from "@/data/integrate";
import { releasedFixes, FIX_PATH } from "@/data/fix";
import { releasedLearn, LEARN_PATH } from "@/data/learn";
import { releasedAlternatives, ALTERNATIVES_PATH } from "@/data/alternatives";
import { releasedCompliance, COMPLIANCE_PATH } from "@/data/compliance";
import { releasedMigrate, MIGRATE_PATH } from "@/data/migrate";
import { releasedPricing, PRICING_PATH } from "@/data/pricing";
import { releasedCompare, COMPARE_PATH } from "@/data/compare";
import { releasedData, DATA_PATH } from "@/data/healthData";
import { releasedMotion, MOTION_PATH } from "@/data/motion";
import { releasedAi, AI_PATH } from "@/data/ai";
import { releasedArchitecture, ARCHITECTURE_PATH } from "@/data/architecture";
import { releasedTesting, TEST_PATH } from "@/data/testing";
import { releasedCookbook, COOKBOOK_PATH } from "@/data/cookbook";
import { releasedDevices, DEVICES_PATH } from "@/data/devices";
import { releasedEngagement, ENGAGEMENT_PATH } from "@/data/engagement";
import { releasedWatchApps, WATCH_PATH } from "@/data/watchApps";
import { releasedAccessibility, A11Y_PATH } from "@/data/accessibility";
import { releasedAudioCoaching, AUDIO_PATH } from "@/data/audioCoaching";
import { releasedHealthkitQueries, HKQ_PATH } from "@/data/healthkitQueries";
import { releasedPhoneSensors, SENSORS_PATH } from "@/data/phoneSensors";
import { releasedHealthConnectApi, HCAPI_PATH } from "@/data/healthConnectApi";
import { releasedOwnYourData, OWN_DATA_PATH } from "@/data/ownYourData";
import { orderedRecords, recordPath, recordH1, recordCapsule, recordFaqs, HC_BASE } from "@/data/hcPages";
import {
  GHAPI_BASE,
  allTypes as ghapiTypes,
  typeCapsule as ghapiTypeCapsule,
  typeFaqs as ghapiTypeFaqs,
  typeH1 as ghapiTypeH1,
  typePath as ghapiTypePath,
} from "@/data/ghapiPages";
import { LIBRARIES_BASE, LIBRARY_COMPARISONS, LIBRARIES_HUB_FAQS, libraryPages } from "@/data/librariesEditorial";
import { LIBRARY_LANDINGS, landingPath } from "@/data/librariesLandings";
import { hkVersionPages, versionH1, versionPrimaryQuery, versionCapsule, versionFaqs } from "@/lib/hkVersions";
import { HK_ID_BASE, hkPageIdentifiers, hkIdentifierPath, hkPageH1, hkPageCapsule, hkPageFaqs } from "@/data/hkIdentifierPages";
import { HS_BASE, hsPageTypes, hsDataTypePath, hsPageH1, hsPageCapsule, hsPageFaqs } from "@/data/hsDataTypePages";
import { PAGE_H1 } from "@/data/pageTitles";
import { PLANNER_LLMS } from "@/lib/plannerPages";
import { DAILY_CAPSULE, DAILY_PATH, DAILY_PRIMARY_QUERY, dailyFaqs } from "@/lib/dailyBank";

import { CLUSTER_LABELS } from "@/lib/clusterRegistry";
import type { ClusterEntry } from "@/lib/cluster";

/**
 * llms-full.txt and its per-section files — the fuller LLM-facing text: each
 * page's answer capsule and FAQs inline, so an assistant can answer directly
 * and cite the source (§8).
 *
 * Since 2026-11-04 (ops/NEXT-10-2026-11-04.md item 4; the decision is in
 * ops/GEO.md) the text is built as a list of sections. /llms-full.txt is the
 * header plus every section in order; /llms-full/<id>.txt serves one section
 * on its own, so an assistant after the troubleshooting pages does not have
 * to load two megabytes to reach them. One generator, two addresses: a
 * section file carries exactly the lines its part of the whole carries.
 */

export type FullSection = {
  /** Address segment: /llms-full/<id>.txt. A cluster's id is its base path. */
  id: string;
  title: string;
  /** Site path of the hub (or page) the section belongs to. */
  hub: string;
  lines: string[];
};

/** One cluster's capsules and FAQs. `faqLabel` keeps the "FAQ:" line the
 *  older clusters have always printed and the newer ones never did. */
function clusterLines(
  title: string,
  base: string,
  entries: ClusterEntry[],
  opts: { intro?: string; faqLabel?: boolean } = {},
): string[] {
  const out: string[] = [`# ${title} — ${absoluteUrl(base)}`, ""];
  if (opts.intro) out.push(opts.intro, "");
  for (const e of entries) {
    out.push(`## ${e.h1} — ${absoluteUrl(`${base}/${e.slug}`)}`);
    out.push(`Primary query: ${e.primaryQuery}`, "", e.answer, "");
    if (e.faqs.length) {
      if (opts.faqLabel) out.push("FAQ:");
      for (const f of e.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
      out.push("");
    }
  }
  return out;
}

export function fullHeader(): string[] {
  return [
    `# ${site.name} — full reference for LLMs`,
    "",
    `> ${site.description}`,
    "",
    "Independent, non-sponsored comparisons for developers choosing fitness/health APIs. Verify volatile specifics (pricing, rate limits) in each provider's official docs.",
    "",
    `Each section below is also served on its own at ${absoluteUrl("/llms-full/<section>.txt")}; ${absoluteUrl("/llms.txt")} lists every section with its size.`,
    "",
  ];
}

function startHereLines(): string[] {
  return [
    // Direct answers from the four section hubs, then the money pages'
    // one-line answers, ahead of the full per-section dump. Both come from
    // src/data/hubGlance.ts and src/data/moneyPages.ts, which quote the cost
    // model and the pages' own capsules, so this adds no claim.
    "# Start here: direct answers from the section hubs",
    "",
    ...GLANCE_HUBS.flatMap((h) =>
      hubQa(h).flatMap((q) => [
        `## ${q.q} — ${absoluteUrl(`${h}#${q.id}`)}`,
        ...(q.kind === "route" ? ["Answered on its own page; its opening:"] : []),
        ...q.parts.map((p) => `- ${segText(p.segs).trim()} (${absoluteUrl(p.href)})`),
        "",
      ]),
    ),
    "# Start here: pricing, alternatives, comparisons and integration guides",
    "",
    ...MONEY_GROUP_ORDER.flatMap((g) => {
      const items = moneyPages().filter((m) => m.group === g);
      if (!items.length) return [];
      return [
        `## ${MONEY_GROUP_LABELS[g]}`,
        ...items.map((m) => `- ${m.entry.h1} — ${absoluteUrl(m.path)}: ${m.oneLine}`),
        "",
      ];
    }),
  ];
}

function hcRecordLines(): string[] {
  const out: string[] = [];
  // Health Connect record reference — capsules and FAQs are generated from
  // the record data, exactly as the pages render them.
  out.push(`# Health Connect record reference — ${absoluteUrl(HC_BASE)}`, "");
  out.push(
    "One page per Health Connect record class, generated from Google's data-types page and the Jetpack reference: fields, permission strings and aggregate metrics, with the HealthKit counterpart only where the verified matrix pairs them.",
    "",
  );
  for (const r of orderedRecords()) {
    out.push(`## ${recordH1(r)} — ${absoluteUrl(recordPath(r))}`, "", recordCapsule(r), "");
    for (const f of recordFaqs(r)) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function hkIdentifierLines(): string[] {
  const out: string[] = [];
  // Per-type HealthKit identifier and Wear OS data type pages — capsules and
  // FAQs generated from the same data the pages render.
  out.push(`# HealthKit identifier pages — ${absoluteUrl(HK_ID_BASE)}`, "");
  out.push(
    "One page per HealthKit quantity, category or characteristic identifier whose generated data holds at least two facts of its own — aggregation style and unit family with Apple's sentence, value enum, Apple's read-only statement, a verified Health Connect pairing, a deprecation note or a metadata key — read from Apple's documentation.",
    "",
  );
  for (const id of hkPageIdentifiers()) {
    out.push(`## ${hkPageH1(id)} — ${absoluteUrl(hkIdentifierPath(id))}`, `Primary query: ${id.objc}`, "", hkPageCapsule(id), "");
    for (const f of hkPageFaqs(id)) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function hsTypeLines(): string[] {
  const out: string[] = [];
  out.push(`# Wear OS Health Services data type pages — ${absoluteUrl(HS_BASE)}`, "");
  out.push(
    "One page per Health Services DataType constant whose generated data holds at least two facts of its own — the permission Google's table lists with its row, a further paragraph of Google's description, a recorded table quirk, or its delta or aggregate counterpart — read from Google's reference.",
    "",
  );
  for (const t of hsPageTypes()) {
    out.push(`## ${hsPageH1(t)} — ${absoluteUrl(hsDataTypePath(t))}`, `Primary query: DataType.${t.name}`, "", hsPageCapsule(t), "");
    for (const f of hsPageFaqs(t)) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function ghapiLines(): string[] {
  const out: string[] = [];
  // Google Health API reference — capsules and FAQs are generated from the
  // data-type data, exactly as the pages render them.
  out.push(`# Google Health API reference — ${absoluteUrl(GHAPI_BASE)}`, "");
  out.push(
    "One page per data type in Google's Google Health API data-types table, joined to the v4 discovery document: operations with their documented path templates, scopes, fields, rollup fields and the Fitbit Web API predecessor, with a flag wherever Google's own pages disagree.",
    "",
  );
  for (const t of ghapiTypes()) {
    out.push(`## ${ghapiTypeH1(t)} — ${absoluteUrl(ghapiTypePath(t))}`, "", ghapiTypeCapsule(t), "");
    for (const f of ghapiTypeFaqs(t)) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function libraryLines(): string[] {
  const out: string[] = [];
  // Open-source libraries.
  out.push(`# Open-source health and fitness libraries — ${absoluteUrl(LIBRARIES_BASE)}`, "");
  out.push(
    "Open-source packages for HealthKit, Health Connect and fitness APIs, with registry facts (version, release date, license) read from npm, pub.dev and PyPI and refreshed weekly, plus caveats quoted from each README.",
    "",
  );
  for (const f of LIBRARIES_HUB_FAQS) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
  out.push("");
  for (const l of LIBRARY_LANDINGS) {
    out.push(`## ${l.h1} — ${absoluteUrl(landingPath(l))}`);
    out.push(`Primary query: ${l.primaryQuery}`, "", l.answer, "");
    for (const f of l.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  for (const { ed } of libraryPages()) {
    out.push(`## ${ed.h1} — ${absoluteUrl(`${LIBRARIES_BASE}/${ed.slug}`)}`);
    out.push(`Primary query: ${ed.primaryQuery}`, "", ed.answer, "");
    for (const f of ed.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  for (const c of LIBRARY_COMPARISONS) {
    out.push(`## ${c.h1} — ${absoluteUrl(`${LIBRARIES_BASE}/compare/${c.slug}`)}`);
    out.push(`Primary query: ${c.primaryQuery}`, "", c.answer, "");
    for (const sec of c.sections ?? []) {
      out.push(`${sec.heading}:`);
      for (const n of sec.notes) out.push(`- ${n.text} (${n.sourceLabel}: ${n.source})`);
      out.push("");
    }
    for (const f of c.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function hkVersionLines(): string[] {
  const out: string[] = [];
  // HealthKit types by iOS major version — computed from the identifier dataset.
  out.push(`# HealthKit types by iOS version — ${absoluteUrl("/healthkit-versions")}`, "");
  for (const g of hkVersionPages()) {
    out.push(`## ${versionH1(g)} — ${absoluteUrl(g.path)}`);
    out.push(`Primary query: ${versionPrimaryQuery(g)}`, "", versionCapsule(g), "");
    for (const f of versionFaqs(g)) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  return out;
}

function toolLines(): string[] {
  const out: string[] = [];
  out.push(`# Free tools — ${absoluteUrl("/")}`, "");
  out.push(`## Which Fitness API Should I Use? (interactive picker) — ${absoluteUrl("/picker")}`);
  out.push("Primary query: which fitness api should i use");
  out.push("");
  out.push(
    "A three-question tool (what you're building, your platform, your top priority) that recommends a fitness/health API approach and links to the relevant comparisons, integration guides, and pricing. Independent, not sponsored.",
  );
  out.push("");
  {
    const ys = yearSlides();
    out.push(`## ${yearTitle()} — ${absoluteUrl("/2026")}`);
    out.push("Primary query: fitness apis 2026 year in review");
    out.push("");
    out.push(
      `A scroll story of one computed number per slide, recomputed from this site's data files at every build and titled "so far" until the first build of 2027. It counts what the changes tracker (/changes) records and repeats nothing from the State of Fitness APIs 2026 report. As of this build: ${ys.map((s) => `${s.value} ${s.label} (${s.source.file}, ${s.source.dateLabel})`).join("; ")}.`,
    );
    out.push("");
  }
  out.push(`## Synthetic health data generator — ${absoluteUrl("/tools/sample-data")}`);
  out.push("Primary query: synthetic healthkit health connect test data generator");
  out.push("");
  out.push(
    "A client-side tool that generates seeded, deterministic synthetic fixtures for Apple HealthKit, Android Health Connect and the Google Health API, as JSON or CSV. Field names, Kotlin and discovery types, validation ranges and enum values come from this site's generated copies of Apple's and Google's references, and a field the datasets do not describe is left out rather than guessed. Each record carries the offset in force at its own instant: Health Connect's nullable ZoneOffset beside each Instant, the Google Health API's required utcOffset durations, HealthKit's optional HKMetadataKeyTimeZone. Values are synthetic and illustrative, not real or physiologically validated.",
  );
  out.push("");
  {
    const kp = totalPairs(POSE_SCHEMES, POSE_CROSSWALK);
    out.push(`## Pose keypoint playground — ${absoluteUrl("/tools/keypoint-playground")}`);
    out.push("Primary query: convert coco keypoints to mediapipe blazepose index");
    out.push("");
    out.push(
      `A client-side tool over this site's pose keypoint dataset (sources read ${POSE_KEYPOINTS_FETCHED_ON}): ${POSE_SCHEMES.length} schemes — ${POSE_SCHEMES.map((s) => s.shortName).join(", ")}. Pick a scheme, click a joint on a drawn body, and see the same point's index and name in every scheme or "not in this scheme"; copy a TypeScript or Python dict from one scheme's indices to another's (Apple Vision joints have no index, so their side uses the joint name). Two points pair only when their names match after lowercasing and removing non-alphanumerics, which gives ${kp.unordered} pairs across ${kp.schemePairsWithAny} of ${(POSE_SCHEMES.length * (POSE_SCHEMES.length - 1)) / 2} scheme pairs; OpenPose's L/R spellings (LShoulder) therefore pair only with OpenPose, and unmatched points are listed in the snippet rather than guessed. The figure and dot positions are a drawing, not data, and no skeleton edges are drawn because the dataset records no connections.`,
    );
    out.push("");
  }
  out.push(`## Pose model benchmark (runs on your device) — ${absoluteUrl("/tools/pose-benchmark")}`);
  out.push("Primary query: mediapipe pose landmarker benchmark");
  out.push("");
  out.push(
    `A client-side tool that loads Google's @mediapipe/tasks-vision ${TASKS_VISION_VERSION} runtime and the Pose Landmarker lite, full and heavy model files when the reader presses Run, times them on the reader's own camera or a synthetic test frame with the GPU and CPU delegates, and reports load time, median and p95 inference time, FPS and the browser's device details as a markdown table. Frames never leave the tab; the runtime itself posts a usage report to Google (task name, running mode, OS family, library version and timing counters, no images). The page publishes no latency or accuracy figure of its own: the only honest number is the one measured on the target hardware. MoveNet is not included because its default weights load from tfhub.dev, which could not be reached to verify on ${POSE_BENCH_VERIFIED_ON}. ${leaderboardText()}`,
  );
  out.push("");
  out.push(`## Rep counter playground (runs on your device) — ${absoluteUrl("/tools/rep-counter-playground")}`);
  out.push(`Primary query: ${REP_PLAYGROUND_PRIMARY_QUERY}`);
  out.push("");
  out.push(repPlaygroundText());
  out.push("");
  out.push(`## Exercise form rules: joint-angle thresholds from open-source trackers — ${absoluteUrl("/tools/exercise-form-rules")}`);
  out.push(`Primary query: ${FORM_RULES_PRIMARY_QUERY}`);
  out.push("");
  out.push(formRulesText());
  out.push("");
  for (const t of PLANNER_LLMS) {
    out.push(`## ${t.label} (runs on your device) — ${absoluteUrl(t.path)}`);
    out.push(`Primary query: ${t.primaryQuery}`);
    out.push("");
    out.push(t.text);
    out.push("");
  }
  out.push(`## Exercise taxonomy crosswalk — ${absoluteUrl(TAXONOMY_PATH)}`);
  out.push(`Primary query: ${TAXONOMY_PRIMARY_QUERY}`);
  out.push("");
  out.push(taxonomyText());
  out.push("");
  out.push(`## Gym software API matrix — ${absoluteUrl(GYM_PATH)}`);
  out.push(`Primary query: ${GYM_PRIMARY_QUERY}`);
  out.push("");
  out.push(`${gymCapsule()} ${matrixText(GYM_API_MATRIX)}`);
  out.push("");
  out.push(`## Research platform chooser — ${absoluteUrl(RESEARCH_PATH)}`);
  out.push(`Primary query: ${RESEARCH_PRIMARY_QUERY}`);
  out.push("");
  out.push(`${researchCapsule()} ${matrixText(RESEARCH_PLATFORM_MATRIX)}`);
  out.push("");
  out.push(`## The Fitness API Atlas (printable poster) — ${absoluteUrl(ATLAS_PATH)}`);
  out.push("");
  out.push(atlasCapsule());
  out.push("");
  out.push(`## Bluetooth heart-rate lab (runs on your device) — ${absoluteUrl("/tools/heart-rate-lab")}`);
  out.push("Primary query: does my heart rate strap send rr intervals");
  out.push("");
  out.push(
    "A client-side Web Bluetooth tool. The reader picks a heart-rate device in the browser's chooser; the page subscribes to Heart Rate Measurement (0x2A37) notifications and shows each one as bytes, colored by field, decoded against the Bluetooth SIG's GATT Specification Supplement structure as this site's generated dataset holds it: the Flags octet bit by bit, the uint8 or uint16 heart-rate value, sensor contact, Energy Expended and RR-intervals (1/1024 s each, as many as the remaining octets hold). Whether a device can give HRV is in those bytes: RR intervals are present only when bit 4 of Flags is set, and without them there is no beat-to-beat timing to compute HRV from. The page gives a running yes/no, a demo RMSSD (not a medical measurement), Body Sensor Location and Battery Level where present, a CSV of the session and a share card made on a canvas. Byte order is little-endian per the Web Bluetooth specification's heart-rate example. Browsers without Web Bluetooth get a synthetic replay, labeled as synthetic. Nothing is uploaded or stored.",
  );
  out.push("");
  out.push(`## FTMS lab (runs on your device) — ${absoluteUrl("/tools/ftms-lab")}`);
  out.push("Primary query: ftms protocol treadmill data format");
  out.push("");
  out.push(
    "A client-side Web Bluetooth tool for the Fitness Machine Service (0x1826). The reader picks a treadmill, indoor bike, rower or cross trainer in the browser's chooser; the page lists the characteristics the service exposes, subscribes to the ones that notify (never the Control Point), reads the Supported Range characteristics once, and decodes each value against the Bluetooth SIG's GATT Specification Supplement structure as this site's generated dataset holds it: the Flags field bit by bit, which fields those bits make present, each field's octets, unit and resolution (M × 10^d × 2^b from the field's own \"Represented values\" line). In Treadmill Data (0x2ACD), Instantaneous Speed is present when bit 0 (More Data) is 0 and is in 1/100 km/h; Indoor Bike cadence is in 1/2 rpm. A paste box decodes any hex value, and synthetic two-minute sessions (labeled synthetic) replay without a machine. Fitness Machine Feature, Status, Training Status and Control Point have no gss file in the SIG's repository at the dataset's commit, so they are shown as hex and the lab writes nothing to the machine. Where the SIG's own lines disagree (Resistance Level: d = 1 beside \"Unit is 1\"), both readings are shown. Nothing is uploaded or stored.",
  );
  out.push("");
  out.push(`## Cycling power and cadence lab (runs on your device) — ${absoluteUrl("/tools/cycling-power-lab")}`);
  out.push("Primary query: calculate cadence from csc measurement crank revolutions");
  out.push("");
  out.push(
    "A client-side Web Bluetooth tool for Cycling Power Measurement (0x2A63) and CSC Measurement (0x2A5B). Neither sends cadence or speed: each sends cumulative wheel and crank revolution counts and the time of the last revolution event. The lab decodes each notification against the Bluetooth SIG's structure and computes cadence (Δcrank revolutions ÷ Δt × 60) and speed (Δwheel revolutions × the circumference the reader enters ÷ Δt) from consecutive pairs, wrapping each counter at its own width. The structures give the tick: 1/1024 s for both CSC event times, but 1/2048 s for the Cycling Power wheel event time and 1/1024 s for its crank. An unchanged event time is reported as no new event, not 0 rpm. Paste mode takes two hex values; a synthetic ride (labeled synthetic) replays with wraps and a coast. Nothing is written to the sensor or uploaded.",
  );
  out.push("");
  out.push(`## BLE GATT explorer (runs on your device) — ${absoluteUrl("/tools/ble-gatt-explorer")}`);
  out.push("Primary query: web bluetooth gatt explorer");
  out.push("");
  out.push(
    "A client-side Web Bluetooth tool for any Bluetooth LE device. It uses acceptAllDevices and names every service in this site's Bluetooth dataset plus Battery (and any UUID the reader adds) as optionalServices, because the Web Bluetooth specification says a page using acceptAllDevices \"will only be able to use services listed in optionalServices\". It lists services and characteristics by their Bluetooth SIG names, reads or subscribes on request, and decodes values against the SIG's gss structures where the dataset has one, stopping at medfloat16/medfloat32 fields and conditions that are not Flags bits; other values show as hex. A paste box decodes any of those characteristics without a device. Nothing is written to the device or uploaded.",
  );
  out.push("");
  out.push(`## Ship It: a fitness-app survival game — ${absoluteUrl(SHIP_IT_PATH)}`);
  out.push("Primary query: fitness api deprecation game");
  out.push("");
  out.push(
    `A short client-side game. The player picks a product (running app, AI running coach, sleep app, employer wellness, camera workout app) and up to three data stacks, then meets, in date order, each of the ${SHIP_IT_EVENTS.length} real events that hit those stacks: ${SHIP_IT_EVENTS.map((e) => `${e.title} (${e.date})`).join("; ")}. Every event quotes the page on this site that sources it, and a build check fails if the quote or its date stops appearing there. Each choice (act now, hedge, ignore) costs game weeks or game users against a ${SHIP_IT_RUNWAY}-week runway; those numbers are invented rules, not estimates of real migration effort or churn. The result is shared as a canvas-drawn card and spoiler-free text.`,
  );
  out.push("");
  out.push(`## The 30-second webcam rep challenge — ${absoluteUrl("/challenge")}`);
  out.push("Primary query: webcam squat counter challenge");
  out.push("");
  {
    const sq = REP_EXERCISES.squat;
    const jj = REP_EXERCISES["jumping-jack"];
    out.push(
      `A browser game: pick squats or jumping jacks, a ${REP_COUNTDOWN_SECONDS}-second countdown, then ${REP_CHALLENGE_SECONDS} seconds counted live from the webcam by MediaPipe Pose Landmarker lite (@mediapipe/tasks-vision ${TASKS_VISION_VERSION}) and a two-phase state machine with hysteresis on one angle per frame, computed from the model's world landmarks. Squat: knee angle (hip-knee-ankle), a rep is ${describeZone(sq.active)} and back ${describeZone(sq.rest)}, the example definition the squat detection page reports from a 2026 study. Jumping jack: arm angle (hip-shoulder-wrist, both arms visible), ${describeZone(jj.active)} and back ${describeZone(jj.rest)}, the site's own uncalibrated choice. A zone must hold ${REP_MIN_HOLD_MS} ms; cycles faster than ${sq.minCycleMs} ms (squat) or ${jj.minCycleMs} ms (jumping jack) are rejected. The end screen draws a share card on a canvas and offers a one-line text result with pace squares per 5-second slice. It is a demo of the method, not a measurement, coaching or medical advice, and the count can be wrong. Frames never leave the tab and no scores are stored; the runtime posts its own usage report to Google (timings, no images).`,
    );
  }
  out.push("");
  out.push(`## Wearable API coverage matrix — ${absoluteUrl(COVERAGE_PATH)}`);
  out.push("Primary query: which wearable apis have which health metrics");
  out.push("");
  out.push(coverageCapsule());
  out.push("");
  out.push(`## Rate-limit and quota calculator (runs on your device) — ${absoluteUrl(RATE_LIMIT_PATH)}`);
  out.push("Primary query: fitness api rate limit calculator");
  out.push("");
  out.push(rateLimitCapsule());
  out.push("");
  out.push(`## Wearable webhook verifier — ${absoluteUrl("/tools/webhook-verifier")}`);
  out.push("Primary query: how to verify a wearable webhook signature");
  out.push("");
  out.push(
    "A client-side webhook debugger. Pick Oura, WHOOP, Terra, Polar, Strava, Withings, Wahoo or the Google Health API, paste the received body, headers and your secret, and it checks the request the way that vendor documents, using WebCrypto in the browser (the secret never leaves the tab). As read from each vendor's page on 2026-10-31: Oura signs the x-oura-timestamp value + JSON.stringify(body) with HMAC-SHA256 keyed by the client secret, upper-case hex, in x-oura-signature; WHOOP signs the X-WHOOP-Signature-Timestamp value + the raw body with the client secret, base64, in X-WHOOP-Signature; Terra signs timestamp + '.' + raw body with the destination's signing secret, hex, in terra-signature (t=…,v1=…); Polar signs the payload with the signature_secret_key returned at webhook creation, hex, in Polar-Webhook-Signature. Strava documents no signature on events, only a hub.challenge validation GET answered within two seconds; Withings suggests a secret query parameter on the callback URL plus its published IP allowlist; Wahoo sends the webhook_token you configured in the JSON body; the Google Health API sends your configured endpointAuthorization secret in the Authorization header. The tool also explains each payload field, the response and time limit each vendor expects, and the call that fetches the data.",
  );
  out.push("");
  out.push(`## ${PAGE_H1[DAILY_PATH]} — ${absoluteUrl(DAILY_PATH)}`);
  out.push(`Primary query: ${DAILY_PRIMARY_QUERY}`);
  out.push("");
  out.push(DAILY_CAPSULE);
  out.push("");
  for (const f of dailyFaqs()) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
  out.push("");
  out.push(`## Step lab: why two step counters disagree — ${absoluteUrl("/tools/step-lab")}`);
  out.push("Primary query: why do step counters disagree");
  out.push("");
  out.push(
    `A client-side tool. On a phone, Start reads the browser's devicemotion event (MDN: accelerationIncludingGravity, in m/s², "represents the raw data measured by an accelerometer"; on iOS Safari DeviceMotionEvent.requestPermission() must be called from a tap and resolves "granted" or "denied"), and runs a detector written for the page, not any platform's: acceleration magnitude, an exponential low-pass at ${STEP_DEFAULTS.cutoffHz} Hz, a ${STEP_DEFAULTS.baselineSeconds} s running baseline, and a step at each filtered peak at least a threshold (default ${STEP_DEFAULTS.threshold} m/s²) above the baseline and at least a minimum interval (default ${STEP_DEFAULTS.minIntervalMs} ms) after the last step. Every counted step is marked on the live trace, and sliders recount the whole recording, which is the point: the same walk gives different counts under different settings. Without a sensor it replays a synthetic, labeled trace of ${STEP_REPLAY_TRUE} generated steps (three soft, one double impact, a jitter burst). Motion data never leaves the device; the share card is drawn on a canvas in the browser. The W3C Device Orientation and Motion draft tells browsers to limit acceleration precision to no more than 0.1 m/s² and to expose the API only in secure contexts. Platform step counters are not described beyond what the site's phone-sensor pages quote: Google's motion guide says Android's step counter and detector "are either hardware-based or software-based", and Apple calls CMPedometer's data system-generated. Browser-API sources read ${STEP_LAB_CHECKED_ON}.`,
  );
  out.push("");
  out.push(`## Apple Health export explorer — ${absoluteUrl("/tools/apple-health-explorer")}`);
  out.push("Primary query: apple health export.xml viewer");
  out.push("");
  out.push(
    "A client-side tool that opens the file the iPhone Health app makes with Export All Health Data (Apple's iPhone User Guide, read 2026-11-05: \"all of your health and fitness data from Health in XML format\"). The reader picks export.zip or export.xml; a Web Worker streams it in chunks (ZIP central directory read, only export.xml inflated with the browser's DecompressionStream) and keeps per-type summaries, so a file of hundreds of megabytes does not have to fit in memory. It lists every record type with count, first and last date, units and sources, the devices named in the file, a daily chart for a chosen type (daily total for types Apple describes as cumulative, daily mean for discrete ones, grouped by the calendar day written on each record) and a CSV per type built by a second pass over the local file. Types link to the site's HealthKit identifier pages. Nothing is uploaded; the page has no server code. Apple publishes no schema for export.xml that the site could find, so the page describes the elements and attributes the tool reads (Record, Workout, ActivitySummary, ExportDate) as its own behavior, not as Apple's format. A synthetic, labeled sample ZIP is provided.",
  );
  out.push("");
  out.push(`## My stack: deadlines and changes for the APIs you use — ${absoluteUrl("/my-stack")}`);
  out.push("Primary query: track deprecations and deadlines for the fitness apis my app uses");
  out.push("");
  out.push(
    `A client-side dashboard over data the site already holds. The reader picks products from the /apis directory; for each, the page shows the changes-tracker entries whose title or summary names it as a whole word (the directory's own rule), graded confirmed or reported, with the date at its source's precision and the day it was last checked; any matching stones in the Fitness API Graveyard with the vendor's quote; every page on the site about it (its vendor menu, or the pages that cover it most) with the date each page declares, flagged past 90 days; and the next dated items with days remaining on the reader's clock. Downloads are built in the tab: a calendar (.ics) of the stack's tracker entries in the same format as ${absoluteUrl("/changes/calendar.ics")}, an OPML file subscribing a feed reader to each product's live feed (${absoluteUrl("/feeds/vendors/<id>.xml")}, or /changes.xml for a product with fewer than two entries), and an RSS snapshot. The stack is stored only in localStorage and in the address (${absoluteUrl("/my-stack?v=<id>,<id>")}); nothing is sent anywhere.`,
  );
  out.push("");
  out.push(`## Answer search — ${absoluteUrl("/answers-search")}`);
  out.push("Primary query: search the full text of aifitnessapi answers");
  out.push("");
  out.push(
    `A client-side full-text search over the per-section answer files listed at ${absoluteUrl("/answers/index.json")}: answer capsules, FAQ answers, blog-post answers and tracked changes, in full, where the site search index carries only the first 180 characters of an answer. Nothing loads with the page; the first search fetches the ticked sections (guides and comparisons, blog and changes by default; the generated references on request), indexes them in the tab and ranks with BM25, questions and titles weighted three times the answer text, the last word also matched as a prefix. Each result links the exact answer at its #faq-N anchor, and the page prints the bytes fetched. ${absoluteUrl("/answers-search?q=<terms>")} is a working URL.`,
  );
  out.push("");
  out.push(`## Deadline countdown widgets — ${absoluteUrl("/badges#countdowns")}`);
  out.push("");
  out.push(
    `Embeddable, noindex widgets at ${absoluteUrl("/embed/countdown/<id>")}: one per graveyard stone ending on or after 2025-01-01 (the stone's id) and one per directory product with a dated item (the product's id), counting in the reader's browser to 00:00 UTC on a stated day, or to the last day of a stated month or year, and saying which. Dates come only from the changes tracker and the graveyard; a stone's widget quotes the vendor, a product's widget shows its entry's confirmed or reported grade, and each links back to the page that sources the date.`,
  );
  out.push("");
  {
    const g = graveyardCopy();
    out.push(`## The Fitness API Graveyard — ${absoluteUrl("/graveyard")}`);
    out.push("Primary query: which fitness apis have been shut down or deprecated");
    out.push("", g.capsule, "");
    for (const f of g.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
    out.push("");
  }
  out.push(`## HealthKit and Health Connect data-type reference — ${absoluteUrl("/matrix")}`);
  out.push("Primary query: healthkit health connect data types");
  out.push("");
  out.push(
    "Ten common health metrics with their matching Apple HealthKit and Android Health Connect type identifiers, verified against Apple's and Google's own documentation. Key cross-platform gotcha: Apple stores HRV as SDNN (HKQuantityTypeIdentifier.heartRateVariabilitySDNN) while Health Connect stores RMSSD (HeartRateVariabilityRmssdRecord) — these are different measures and are not interconvertible. Both stores are on-device with no server endpoint.",
  );
  out.push("");
  return out;
}

function blogLines(): string[] {
  const out: string[] = [];
  const posts = getAllPosts();
  {
    out.push(`# Blog — ${absoluteUrl("/blog")}`, "");
    out.push(
      "Findings derived from this site's own published datasets. Each post states when the underlying source was read.",
      "",
    );
    for (const p of posts) {
      out.push(`## ${p.title} — ${absoluteUrl(`/blog/${p.slug}`)}`);
      out.push(`Published: ${p.date}; last reviewed: ${p.updated}`);
      out.push("");
      out.push(p.description);
      out.push("");
      if (p.faqs.length) {
        out.push("FAQ:");
        for (const f of p.faqs) out.push(`- Q: ${f.q}\n  A: ${f.a}`);
        out.push("");
      }
    }
  }
  return out;
}

type ClusterOpts = { intro?: string; faqLabel?: boolean };

/** Every section, in the order /llms-full.txt has always printed them. */
export function fullSections(): FullSection[] {
  const c = (base: string, entries: ClusterEntry[], title: string, opts: ClusterOpts = {}): FullSection => ({
    id: base.slice(1),
    title,
    hub: base,
    lines: clusterLines(title, base, entries, opts),
  });
  const all: FullSection[] = [
    { id: "start-here", title: "Start here: hub answers and money pages", hub: "/", lines: startHereLines() },
    c(PILLAR_PATH, releasedEntries(), CLUSTER_LABELS[PILLAR_PATH] ?? "Fitness APIs: what they are and which to use", {
      faqLabel: true,
      intro:
        "A fitness API is a service your app calls for fitness or health data and capabilities: an exercise library, a user's wearable metrics, nutrition data, or camera-based workout tracking. There is no single best fitness API; choose by job — exercise/workout content, wearable & device data, health-data aggregators, nutrition data, or AI motion tracking. Pick the category first, then compare within it.",
    }),
    c(GUIDES_PATH, releasedGuides(), "How-to guides", { faqLabel: true }),
    c(BUILD_PATH, releasedBuilds(), "Build guides", { faqLabel: true }),
    c(INTEGRATE_PATH, releasedIntegrations(), "Integration guides", { faqLabel: true }),
    c(FIX_PATH, releasedFixes(), "Troubleshooting", { faqLabel: true }),
    c(LEARN_PATH, releasedLearn(), "Concepts explained", { faqLabel: true }),
    c(ALTERNATIVES_PATH, releasedAlternatives(), "Alternatives", { faqLabel: true }),
    c(COMPLIANCE_PATH, releasedCompliance(), "Compliance & privacy", {
      faqLabel: true,
      intro:
        "General engineering guidance for health-data compliance, not legal advice. Regulations vary by jurisdiction and change — verify current obligations with a qualified professional.",
    }),
    c(MIGRATE_PATH, releasedMigrate(), "Migration guides", { faqLabel: true }),
    c(PRICING_PATH, releasedPricing(), "Pricing", {
      faqLabel: true,
      intro:
        "Most first-party wearable APIs are free to call; the real costs are aggregators, nutrition/exercise APIs, user device/membership, and infra. Pricing is volatile — verify current figures.",
    }),
    c(COMPARE_PATH, releasedCompare(), "Comparisons", {
      faqLabel: true,
      intro:
        "Developer-lens head-to-heads: what data each exposes via its API, access model, cost, and fit. Recommends by use-case, not a single winner.",
    }),
    c(DATA_PATH, releasedData(), "Health data by metric", {
      faqLabel: true,
      intro:
        "Which sources expose each health metric, how to access it, and whether it's measured or a modeled estimate. Treat consumer-device data as a wellness signal, not a diagnosis.",
    }),
    c(MOTION_PATH, releasedMotion(), "AI motion & pose estimation", {
      faqLabel: true,
      intro:
        "The technical/decision layer behind camera-based fitness: pose model choice, 2D vs 3D, on-device vs cloud, accuracy, and how rep counting and form scoring work. Camera-based form feedback is a coaching aid, not medical/PT advice.",
    }),
    c(AI_PATH, releasedAi(), "AI & LLM features", {
      faqLabel: true,
      intro:
        "The language-model layer of a fitness app: plan generation, natural-language food logging, conversational coaching, grounding a model in your own catalog, safety guardrails, model choice, evaluation, and cost. LLM output about exercise or nutrition is not medical advice, and the app publisher owns what the app tells a user.",
    }),
    c(ARCHITECTURE_PATH, releasedArchitecture(), "Health data architecture", {
      faqLabel: true,
      intro:
        "Pipelines, storage and data quality for multi-source health data. Key facts: HealthKit performs no automatic deduplication of raw samples (merging happens only inside statistics query results, only for quantity types); Health Connect deduplicates only Activity and Sleep, only via its aggregate API, with the source priority order controlled by the user rather than the app. Health samples are late-arriving and retro-edited, not append-only.",
    }),
    c(TEST_PATH, releasedTesting(), "Testing health & fitness apps", {
      faqLabel: true,
      intro:
        "Testing the surfaces that resist automation. Apple ships no test double for HealthKit; Google's Health Connect testing library is an alpha that stubs aggregation rather than faking it; background delivery cannot be triggered on demand; the iOS Simulator has no camera. This cluster covers what to automate behind a seam you control, what needs a real device, and what can only be monitored in production.",
    }),
    c(COOKBOOK_PATH, releasedCookbook(), "Cookbook — runnable, CI-tested reference code", {
      intro:
        "Dependency-free JavaScript implementations of the patterns this site documents, each with a node:test suite that runs in CI on every change; the code on each page is a byte-verbatim copy of the tested file. MIT-licensed.",
    }),
    c(DEVICES_PATH, releasedDevices(), "Connected fitness devices — BLE, FTMS, watch data", {
      intro:
        "The live-hardware layer of a fitness app: standard Bluetooth GATT profiles (Heart Rate, Fitness Machine, cycling sensors) with identifiers verified against the Bluetooth SIG's published assigned numbers, live watch data on watchOS and Wear OS, Web Bluetooth reach, and the testing story for hardware CI cannot script.",
    }),
    c(ENGAGEMENT_PATH, releasedEngagement(), "Engagement & retention for fitness apps", {
      intro:
        "Platform engagement surfaces verified against Apple's and Google's documentation, plus streaks, leaderboards and honest measurement. This cluster states no engagement or retention percentages: no public dataset ranks fitness SDKs by retention lift, and vendor case studies are marketing, so the pages teach measurement with a holdout instead.",
    }),
    c(WATCH_PATH, releasedWatchApps(), "Building watch apps — watchOS and Wear OS", {
      intro:
        "Writing the app that runs on the wrist: workout session lifecycle, background execution, WorkoutKit scheduling, Wear OS Health Services, tiles, phone pairing, battery and testing. Every platform claim verified against Apple's or Google's own documentation.",
    }),
    c(A11Y_PATH, releasedAccessibility(), "Accessibility for fitness and health apps", {
      intro:
        "Making a fitness product usable when somebody cannot see the screen, cannot hear the cue, or cannot reach the button mid-set. Every platform claim is verified against Apple's or Google's own documentation. This cluster deliberately cites no WCAG criteria and makes no legal claims: w3.org was unreachable when it was written, and an unverifiable standards citation is worse than none.",
    }),
    c(AUDIO_PATH, releasedAudioCoaching(), "Audio coaching for workout apps", {
      intro:
        "Spoken cues and tones that play over the user's music without stopping it, survive the lock screen and calls, and stay quiet when they should. Sourced only from Apple and Google developer documentation fetched 2026-10-03; no React Native, Expo, Flutter or Capacitor plugin claims, and no measured latency or ducking figures.",
    }),
    c(HKQ_PATH, releasedHealthkitQueries(), "HealthKit query classes", {
      intro:
        "How each HealthKit query class works and where it bites, one class per page, from Apple's own documentation: predicates, statistics, anchors, observers, async descriptors, routes and rings.",
    }),
    c(SENSORS_PATH, releasedPhoneSensors(), "Fitness features from phone motion sensors", {
      intro:
        "Steps, activity, altitude and head motion from the phone a user already carries, one platform API per page, from Apple's and Google's own documentation.",
    }),
    c(HCAPI_PATH, releasedHealthConnectApi(), "Health Connect Jetpack API", {
      intro:
        "How each Health Connect Jetpack call works and where it bites, one method or class per page, from Google's own guides and the androidx.health.connect.client reference: readRecords paging, aggregates, getChanges, upserts, deletes, permissions, background and history reads, routes and training plans.",
    }),
    c(OWN_DATA_PATH, releasedOwnYourData(), "Exporting your own health and fitness data", {
      intro:
        "How a person downloads their own data from each phone platform, wearable and fitness app: the vendor's official export path, the format it states, what it leaves out, any personal-use API, and the Python libraries, from each vendor's own help center or developer page. Where the vendor's page could not be read, the page says so.",
    }),
    { id: HC_BASE.slice(1), title: "Health Connect record reference", hub: HC_BASE, lines: hcRecordLines() },
    { id: HK_ID_BASE.slice(1), title: "HealthKit identifier pages", hub: HK_ID_BASE, lines: hkIdentifierLines() },
    { id: HS_BASE.slice(1), title: "Wear OS Health Services data type pages", hub: HS_BASE, lines: hsTypeLines() },
    { id: GHAPI_BASE.slice(1), title: "Google Health API reference", hub: GHAPI_BASE, lines: ghapiLines() },
    { id: LIBRARIES_BASE.slice(1), title: "Open-source health and fitness libraries", hub: LIBRARIES_BASE, lines: libraryLines() },
    { id: "healthkit-versions", title: "HealthKit types by iOS version", hub: "/healthkit-versions", lines: hkVersionLines() },
    { id: "tools", title: "Free tools", hub: "/", lines: toolLines() },
    { id: "blog", title: "Blog", hub: "/blog", lines: blogLines() },
  ];
  // A section with no pages has nothing to serve (the single file always
  // skipped an empty cluster), and ids must be unique to be addresses.
  const out = all.filter((s) => s.lines.some((l) => l.startsWith("## ")));
  const ids = out.map((s) => s.id);
  if (new Set(ids).size !== ids.length) throw new Error(`llms-full section ids repeat: ${ids.join(", ")}`);
  return out;
}

/** /llms-full.txt: the header, then every section. */
export function llmsFullText(): string {
  return [...fullHeader(), ...fullSections().flatMap((s) => s.lines)].join("\n");
}

/** /llms-full/<id>.txt: a short header naming the whole, then the section. */
export function fullSectionText(s: FullSection): string {
  return [
    `# ${site.name} — full reference for LLMs: ${s.title}`,
    "",
    `> ${site.description}`,
    "",
    `One section of ${absoluteUrl("/llms-full.txt")}, with the same lines that section carries there. Every section is listed in ${absoluteUrl("/llms.txt")}.`,
    "",
    ...s.lines,
  ].join("\n");
}

/** UTF-8 size of a text, for the listings that tell a reader what a fetch costs. */
export function byteLength(text: string): number {
  return Buffer.byteLength(text, "utf8");
}
