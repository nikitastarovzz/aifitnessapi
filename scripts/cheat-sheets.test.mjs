// Tests for the printable cheat sheets (scripts/lib/cheatSheets.mjs, scripts/build-cheat-sheets.mjs).
// They need no browser: the HTML is checked against the data, and the published files against the
// manifest. Drawing is scripts/build-cheat-sheets.mjs's job.
import assert from "node:assert/strict";
import { test } from "node:test";
import { appleSentence, COMMON_HK, SHEETS } from "./lib/cheatSheets.mjs";
import { checkSheets, sheetSources } from "./build-cheat-sheets.mjs";

const src = await sheetSources();
const hk = await import("../src/data/healthkitIdentifiers.ts");
const hc = await import("../src/data/healthConnectRecords.ts");
const pose = await import("../src/data/poseKeypoints.ts");

test("published sheets match today's data, stay under 1.5 MB and are real PDFs and PNGs", async () => {
  assert.deepEqual(await checkSheets(), []);
});

test("the HealthKit sheet prints Apple's aggregation and unit family for every common identifier", () => {
  const html = src.healthkit.html;
  for (const c of [...COMMON_HK.activity, ...COMMON_HK.heart, ...COMMON_HK.body]) {
    const r = hk.HK_IDENTIFIERS.find((x) => x.case === c && x.family === "quantity");
    assert.ok(r, c);
    assert.match(html, new RegExp(`<code>\\.${c}</code></td><td>${r.aggregation}</td><td>${r.unitFamily.replace(/\//g, "\\/")}</td>`), c);
  }
  for (const c of COMMON_HK.category) assert.ok(html.includes(hk.HK_IDENTIFIERS.find((x) => x.case === c).valueEnum), c);
});

test("the Health Connect sheet lists every current record with its read permission, and Google's 30-day sentence", () => {
  const html = src["health-connect"].html;
  for (const r of hc.HC_RECORDS.filter((x) => !x.deprecated)) {
    assert.ok(html.includes(`<code>${r.className}</code>`), r.className);
    for (const p of r.readPermissions) assert.ok(html.includes(p.replace("android.permission.health.", "")), p);
  }
  assert.match(html, /older than 30 days from before the first HealthConnect permission was granted/);
});

test("the pose sheet prints COCO 17 and BlazePose 33 exactly as the sources index them", () => {
  const html = src["pose-keypoints"].html;
  for (const slug of ["coco-17", "blazepose-33"]) {
    const s = pose.POSE_SCHEMES.find((x) => x.slug === slug);
    for (const p of s.points) assert.match(html, new RegExp(`<td class="num">${p.index}</td><td><code>${p.name}</code>`), `${slug} ${p.index}`);
  }
  assert.match(html, /\[0, 2, 5, 7, 8, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28\]/);
});

test("appleSentence removes the empty link parenthetical and refuses other holes", () => {
  assert.equal(appleSentence("These samples use count units (described in ) and measure cumulative values (described in )."), "These samples use count units and measure cumulative values.");
  assert.equal(appleSentence("always verify by calling  before calling any other method."), null);
});

test("each sheet links back to its section of /cheat-sheets and carries the license", () => {
  for (const s of SHEETS) {
    assert.ok(src[s.slug].html.includes(`/cheat-sheets#${s.slug}`));
    assert.ok(src[s.slug].html.includes("CC BY 4.0"));
  }
});
