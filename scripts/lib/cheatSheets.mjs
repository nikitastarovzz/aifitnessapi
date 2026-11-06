/**
 * The printable cheat sheets (/cheat-sheets, ops/VIRAL-20-2026-11-06.md
 * item 13): one A4 page each, as HTML that scripts/build-cheat-sheets.mjs
 * prints to PDF and screenshots to PNG with Playwright's Chromium.
 *
 * Every row is copied from a generated module, never typed here:
 *   HealthKit       src/data/healthkitIdentifiers.ts (Apple's docs JSON: family,
 *                   aggregation with its sentence, unit family, value enum, iOS
 *                   version, HKError.Code abstracts), src/data/healthkitWritability.ts
 *                   (Apple's "read-only" sentences) and src/data/unifiedSchema.ts
 *                   (Apple's sentence on HKUnit.percent()).
 *   Health Connect  src/data/healthConnectRecords.ts (Google's data-types table,
 *                   the Jetpack references and HealthPermission's descriptions).
 *   Pose keypoints  src/data/poseKeypoints.ts (MediaPipe's and MMPose's source files).
 *
 * The only hand-written part is the choice of which HealthKit identifiers
 * count as common (COMMON_HK below); each one's facts still come from Apple's
 * data, and a missing identifier fails the build rather than printing a gap.
 */

export const SHEET_SITE = "https://aifitnessapi.com";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** HealthKit quantity and category identifiers a typical fitness app touches. A selection, not a ranking. */
export const COMMON_HK = {
  activity: ["stepCount", "distanceWalkingRunning", "distanceCycling", "activeEnergyBurned", "basalEnergyBurned", "flightsClimbed", "appleExerciseTime"],
  heart: ["heartRate", "restingHeartRate", "walkingHeartRateAverage", "heartRateVariabilitySDNN", "oxygenSaturation", "respiratoryRate", "vo2Max"],
  body: ["bodyMass", "height", "bodyMassIndex", "bodyFatPercentage", "leanBodyMass", "dietaryEnergyConsumed", "dietaryWater"],
  category: ["sleepAnalysis", "mindfulSession", "appleStandHour", "menstrualFlow"],
};

/**
 * Apple's prose with its inline symbol links dropped leaves "(described in )"
 * and "calling  before". The empty parenthetical is removed; any other hole
 * makes this return null, so the sentence is left out rather than printed.
 */
export function appleSentence(s) {
  const t = String(s ?? "")
    .replace(/\s*\(described in\s*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return /\(\s*\)|\s[,.]|calling\s+(before|to)\b|see\s*\.$/.test(t) ? null : t;
}

/** The first sentence of Apple's discussion, when it reads whole. */
function firstSentence(s) {
  const m = /^[^.]*\./.exec(String(s ?? ""));
  return m ? appleSentence(m[0]) : null;
}

const AUTH_ERRORS = ["errorHealthDataUnavailable", "errorHealthDataRestricted", "errorAuthorizationNotDetermined", "errorAuthorizationDenied"];

const CSS = `
@page { size: 210mm 297mm; margin: 0 }
* { box-sizing: border-box }
html, body { margin: 0; padding: 0; background: #fff }
body { width: 210mm; height: 297mm; overflow: hidden; font-family: "Liberation Sans", Arial, Helvetica, sans-serif; color: #111827; font-size: 7.6pt; line-height: 1.28 }
.sheet { padding: 9mm 9mm 7mm; height: 297mm; display: flex; flex-direction: column }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #0f766e; padding-bottom: 2.2mm; margin-bottom: 3mm }
h1 { font-size: 17pt; margin: 0; letter-spacing: -0.2pt }
header .meta { text-align: right; color: #4b5563; font-size: 7pt }
h2 { font-size: 9pt; margin: 3mm 0 1.2mm; color: #0f766e; text-transform: uppercase; letter-spacing: 0.4pt }
.cols { columns: 2; column-gap: 6mm }
.split { display: grid; grid-template-columns: 37% 1fr; gap: 6mm }
.block { break-inside: avoid }
table { width: 100%; border-collapse: collapse }
th { text-align: left; font-size: 6.6pt; color: #4b5563; font-weight: 700; border-bottom: 1px solid #d1d5db; padding: 0.5mm 1mm }
td { padding: 0.45mm 1mm; border-bottom: 1px solid #f0f1f3; vertical-align: top }
code, .mono { font-family: "DejaVu Sans Mono", "Liberation Mono", Menlo, monospace; font-size: 6.7pt }
.num { text-align: right; width: 7mm; color: #0f766e; font-weight: 700 }
.muted { color: #6b7280 }
.note { margin: 0.8mm 0; overflow-wrap: anywhere }
.note b { color: #0f766e }
blockquote { margin: 0.6mm 0 1.4mm; padding-left: 2mm; border-left: 2px solid #99f6e4; color: #1f2937; overflow-wrap: anywhere }
.split > div { min-width: 0 }
footer { margin-top: auto; padding-top: 2mm; border-top: 1px solid #d1d5db; color: #6b7280; font-size: 6.4pt; display: flex; justify-content: space-between; gap: 4mm }
`;

function page({ title, subtitle, meta, body, footerLeft, slug, extraCss = "" }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${CSS}${extraCss}</style></head><body><div class="sheet">
<header><div><h1>${esc(title)}</h1><div class="muted">${esc(subtitle)}</div></div><div class="meta">${meta.map(esc).join("<br>")}</div></header>
${body}
<footer><div>${footerLeft}</div><div>${esc(SHEET_SITE.replace("https://", ""))}/cheat-sheets#${esc(slug)} · CC BY 4.0 · credit AIFitnessAPI</div></footer>
</div></body></html>`;
}

/* ── HealthKit ─────────────────────────────────────────────────────────── */

export function healthkitSheet({ identifiers, errors, readOnly, fetchedOn, percentEvidence, percentNote, hrvNote }) {
  const find = (c) => {
    const r = identifiers.find((x) => x.case === c && x.family !== "workoutActivity");
    if (!r) throw new Error(`cheat sheet: HealthKit identifier ${c} is not in src/data/healthkitIdentifiers.ts`);
    return r;
  };
  const ios = (r) => r.platforms.find((p) => p.name === "iOS")?.introducedAt ?? "—";
  const qRows = (cases) =>
    cases
      .map(find)
      .map((r) => `<tr><td><code>.${esc(r.case)}</code></td><td>${esc(r.aggregation ?? "not stated")}</td><td>${esc(r.unitFamily ?? "not stated")}</td><td class="muted">${esc(ios(r))}</td></tr>`)
      .join("");
  const qTable = (label, cases) => `<div class="block"><h2>${esc(label)}</h2><table><tr><th>HKQuantityTypeIdentifier</th><th>Aggregation</th><th>Unit family</th><th>iOS</th></tr>${qRows(cases)}</table></div>`;
  const cats = COMMON_HK.category
    .map(find)
    .map((r) => `<tr><td><code>.${esc(r.case)}</code></td><td><code>${esc(r.valueEnum ?? "—")}</code></td><td class="muted">${esc(ios(r))}</td></tr>`)
    .join("");
  const errs = AUTH_ERRORS.map((c) => {
    const e = errors.find((x) => x.case === c);
    if (!e) throw new Error(`cheat sheet: HKError.Code.${c} is not in src/data/healthkitIdentifiers.ts`);
    const more = firstSentence(e.discussion);
    return `<div class="note"><code>.${esc(e.case)}</code><blockquote>${esc(e.abstract)}${more ? ` ${esc(more)}` : ""}</blockquote></div>`;
  }).join("");
  const ro = readOnly.map((r) => `<code>.${esc(r.case)}</code>`).join(", ");
  const roQuote = readOnly[0]?.evidence ?? "";
  const sample = find("stepCount");
  const disc = find("heartRate");
  const body = `
<div class="cols">
${qTable("Activity", COMMON_HK.activity)}
${qTable("Heart and fitness", COMMON_HK.heart)}
${qTable("Body and nutrition", COMMON_HK.body)}
<div class="block"><h2>Category types: decode with the value enum</h2><table><tr><th>HKCategoryTypeIdentifier</th><th>Value enum</th><th>iOS</th></tr>${cats}</table></div>
<div class="block"><h2>Sum or average</h2>
<p class="note">Cumulative types are summed (<code>.cumulativeSum</code>), discrete types averaged (<code>.discreteAverage</code>) in <code>HKStatisticsQuery</code>. Apple states it in prose:</p>
<blockquote>${esc(appleSentence(sample.aggregationEvidence))}</blockquote><blockquote>${esc(appleSentence(disc.aggregationEvidence))}</blockquote>
<p class="note muted">Apple's sentences, with the empty “(described in …)” its inline links leave removed.</p></div>
<div class="block"><h2>Units</h2>
<p class="note"><b>Percent is a fraction.</b> Apple on <code>HKUnit.percent()</code>:</p><blockquote>${esc(percentEvidence)}</blockquote>
<p class="note">${esc(percentNote)}</p></div>
<div class="block"><h2>HRV is not the same number</h2><p class="note">${esc(hrvNote)}</p><p class="note muted">From this site's HealthKit ↔ Health Connect matrix, ${esc(SHEET_SITE)}/matrix</p></div>
<div class="block"><h2>Permission and availability errors</h2>${errs}</div>
<div class="block"><h2>Read-only: apps cannot save these</h2><p class="note">${ro}.</p><blockquote>${esc(roQuote)}</blockquote></div>
</div>`;
  return page({
    title: "HealthKit cheat sheet",
    subtitle: "Common identifiers, units and permission gotchas, from Apple's documentation",
    meta: [`Apple's docs read ${fetchedOn}`, "developer.apple.com/documentation/healthkit"],
    body,
    footerLeft: `Generated from src/data/healthkitIdentifiers.ts and healthkitWritability.ts (Apple's documentation JSON). Every type: ${esc(SHEET_SITE)}/healthkit-identifiers`,
    slug: "healthkit",
  });
}

/* ── Health Connect ────────────────────────────────────────────────────── */

const strip = (p) => p.replace(/^android\.permission\.health\./, "");

export function healthConnectSheet({ records, categories, jetpackPermissions, additionalRead, fetchedOn, dataTypesUrl, dataTypesUpdated }) {
  const order = categories.map((c) => c.name);
  const rows = [...records]
    .filter((r) => !r.deprecated)
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category) || (a.className < b.className ? -1 : 1));
  let lastCat = null;
  const trs = rows
    .map((r) => {
      const head = r.category !== lastCat ? `<tr><th colspan="3" style="color:#0f766e;padding-top:1.2mm">${esc(r.category ?? "Uncategorized")}</th></tr>` : "";
      lastCat = r.category;
      const read = r.readPermissions.map(strip).join(", ") || "—";
      return `${head}<tr><td><code>${esc(r.className)}</code>${r.featureFlag ? ' <span class="muted">*</span>' : ""}</td><td class="muted">${esc(r.recordShape ?? "")}</td><td><code>${esc(read)}</code></td></tr>`;
    })
    .join("");
  const jp = (name) => {
    const p = jetpackPermissions.find((x) => x.constant === name);
    if (!p?.description) throw new Error(`cheat sheet: HealthPermission.${name} has no description in src/data/healthConnectRecords.ts`);
    return p.description;
  };
  const history = jp("PERMISSION_READ_HEALTH_DATA_HISTORY");
  const firstTwo = history.split(/(?<=\.)\s+(?=Any |This )/).slice(0, 3).join(" ");
  const background = jp("PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND");
  const extra = additionalRead.map((p) => `<tr><td><code>${esc(strip(p.permission))}</code></td><td>${esc(p.label)}</td></tr>`).join("");
  const flagged = rows.filter((r) => r.featureFlag);
  const body = `
<div class="split">
<div class="block"><h2>The 30-day window</h2>
<p class="note">Google's HealthPermission reference, <code>PERMISSION_READ_HEALTH_DATA_HISTORY</code>:</p>
<blockquote>${esc(firstTwo)}</blockquote>
<p class="note"><code>PERMISSION_READ_HEALTH_DATA_IN_BACKGROUND</code>:</p><blockquote>${esc(background)}</blockquote>
<table><tr><th>Extra read permission</th><th>Google's label</th></tr>${extra}</table>
<p class="note muted">Prefix every permission with <code>android.permission.health.</code></p></div>
<div class="block"><h2>Record types and read permissions</h2>
<table><tr><th>Record (androidx.health.connect.client.records)</th><th>Shape</th><th>Read permission</th></tr>${trs}</table>
<p class="note muted">* Behind a feature flag: ${flagged.map((r) => `${esc(r.className)} (${esc(r.featureFlag)})`).join(", ")}. Check HealthConnectFeatures.getFeatureStatus first.</p></div>
</div>`;
  return page({
    title: "Health Connect cheat sheet",
    subtitle: `${rows.length} record types, their read permissions, and the 30-day history window`,
    meta: [`Google's pages read ${fetchedOn}`, `data-types page updated ${dataTypesUpdated}`],
    body,
    extraCss: "body{font-size:7.1pt;line-height:1.2} td{padding:0.25mm 1mm} code{font-size:6.3pt}",
    footerLeft: `Generated from src/data/healthConnectRecords.ts (${esc(dataTypesUrl)} and the Jetpack references). Every record: ${esc(SHEET_SITE)}/health-connect`,
    slug: "health-connect",
  });
}

/* ── Pose keypoints ────────────────────────────────────────────────────── */

export function poseSheet({ schemes, sources, fetchedOn }) {
  const get = (slug) => {
    const s = schemes.find((x) => x.slug === slug);
    if (!s) throw new Error(`cheat sheet: pose scheme ${slug} is not in src/data/poseKeypoints.ts`);
    return s;
  };
  const coco = get("coco-17");
  const blaze = get("blazepose-33");
  const src = (s) => sources.find((x) => x.id === s.sourceId);
  const byKey = (s) => new Map(s.points.map((p) => [p.key, p]));
  const blazeByKey = byKey(blaze);
  const cocoByKey = byKey(coco);
  const table = (s, other, otherLabel) =>
    `<table><tr><th class="num">#</th><th>Name (as the source spells it)</th><th>${esc(otherLabel)}</th></tr>${s.points
      .map((p) => {
        const o = other.get(p.key);
        return `<tr><td class="num">${p.index}</td><td><code>${esc(p.name)}</code></td><td class="muted">${o ? `${o.index}` : "—"}</td></tr>`;
      })
      .join("")}</table>`;
  const used = (s) => s.usedBy.map((u) => esc(u.model)).join("; ");
  const pairs = coco.points.filter((p) => blazeByKey.has(p.key)).length;
  const body = `
<div class="cols">
<div class="block"><h2>COCO 17 keypoints</h2>
<p class="note muted">Names and order: ${esc(coco.nameSource)}. Used by ${used(coco)}.</p>
${table(coco, blazeByKey, "BlazePose #")}
<h2>Mapping COCO 17 to BlazePose 33</h2>
<p class="note">All ${pairs} COCO points have a BlazePose point with the same name once case and separators are removed, so <code>blaze[map[i]]</code> reads COCO point <code>i</code>:</p>
<p class="note"><code>[${coco.points.map((p) => blazeByKey.get(p.key)?.index ?? "null").join(", ")}]</code></p>
<p class="note muted">The reverse is partial: BlazePose's ${blaze.points.length - pairs} other points (eye corners, mouth, fingers, heels, foot index) have no COCO 17 counterpart.</p>
<h2>Sources</h2>
<p class="note muted">${esc(src(coco)?.page ?? "")}<br>${esc(src(blaze)?.page ?? "")}</p>
</div>
<div class="block"><h2>BlazePose 33 landmarks</h2>
<p class="note muted">Names and order: ${esc(blaze.nameSource)}. Used by ${used(blaze)}.</p>
${table(blaze, cocoByKey, "COCO #")}</div>
</div>`;
  return page({
    title: "Pose keypoints cheat sheet",
    subtitle: "COCO 17 and BlazePose 33 index maps, copied from the model sources",
    meta: [`Sources read ${fetchedOn}`, "MMPose · MediaPipe Tasks"],
    body,
    footerLeft: `Generated from src/data/poseKeypoints.ts. All nine schemes and the crosswalk: ${esc(SHEET_SITE)}/tools/keypoint-playground`,
    slug: "pose-keypoints",
  });
}

export const SHEETS = [
  { slug: "healthkit", title: "HealthKit cheat sheet" },
  { slug: "health-connect", title: "Health Connect cheat sheet" },
  { slug: "pose-keypoints", title: "Pose keypoints cheat sheet" },
];
