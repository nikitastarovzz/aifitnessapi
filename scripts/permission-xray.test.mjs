// Tests for src/lib/permissionXray.mjs — the paste mode ("Permission X-ray")
// on /tools/permission-builder: the Health Connect lookup built from the
// generated module, the manifest and plist scanners, the findings, and that
// every sentence the tool quotes is still on the page it cites.
// Run: npm run test:permission-xray
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  HC_PREFIX,
  SOURCES,
  IOS_KEYS,
  IOS_ACCESS_VALUES,
  QUOTES,
  RATIONALE_ACTION,
  buildAndroidReference,
  scanAndroid,
  scanIos,
  xray,
  toMarkdown,
  androidGrants,
  findingText,
} from "../src/lib/permissionXray.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hc = await import(new URL("../src/data/healthConnectRecords.ts", import.meta.url).href);
const REF = buildAndroidReference(hc);

const P = (s) => `${HC_PREFIX}${s}`;
const ids = (report) => report.findings.map((f) => f.id);

/** Synthetic manifest, written for this test. */
const MANIFEST = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
  <uses-permission android:name="android.permission.health.READ_STEPS"/>
  <uses-permission android:name="android.permission.health.WRITE_STEPS" />
  <uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
  <uses-permission android:name="android.permission.health.READ_HEART_RATE"/>
  <uses-permission android:name="android.permission.health.READ_HEALTH_DATA_IN_BACKGROUND"/>
  <uses-permission android:name="android.permission.health.READ_EXERCISE_ROUTE"/>
  <uses-permission android:name="android.permission.health.READ_TELEPATHY"/>
  <uses-permission-sdk-23 android:name="android.permission.health.WRITE_WEIGHT" tools:node="remove"/>
  <uses-permission android:name="android.permission.INTERNET"/>
  <!-- <uses-permission android:name="android.permission.health.READ_SLEEP"/> -->
  <application android:label="Demo">
    <activity android:name=".Onboarding" android:exported="true"
        android:permission="android.permission.health.START_ONBOARDING" />
  </application>
</manifest>`;

const RATIONALE = `
    <activity android:name=".PermissionsRationaleActivity" android:exported="true">
      <intent-filter>
        <action android:name="androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE" />
      </intent-filter>
    </activity>
    <activity-alias android:name="ViewPermissionUsageActivity" android:exported="true"
        android:targetActivity=".PermissionsRationaleActivity"
        android:permission="android.permission.START_VIEW_PERMISSION_USAGE">
      <intent-filter>
        <action android:name="android.intent.action.VIEW_PERMISSION_USAGE" />
        <category android:name="android.intent.category.HEALTH_PERMISSIONS" />
      </intent-filter>
    </activity-alias>`;

/** Synthetic Info.plist + entitlements, written for this test. */
const PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
  <key>NSHealthShareUsageDescription</key>
  <string>We read your steps &amp; workouts to chart your week.</string>
  <key>NSHealthUpdateUsageDescription</key>
  <string></string>
  <key>NSHealthMadeUpUsageDescription</key>
  <string>x</string>
  <key>com.apple.developer.healthkit</key>
  <true/>
  <key>com.apple.developer.healthkit.access</key>
  <array>
    <string>health-records</string>
    <string>something-else</string>
  </array>
  <key>com.apple.developer.healthkit.background-delivery</key>
  <false/>
</dict>
</plist>`;

// ---------------------------------------------------------------------------
// The reference is the generated module, joined, and nothing else.
// ---------------------------------------------------------------------------

test("reference holds every framework permission, with Google's description verbatim", () => {
  assert.equal(REF.count, hc.HC_FRAMEWORK_PERMISSIONS.length);
  assert.equal(REF.fetchedOn, hc.HC_FETCHED_ON);
  for (const p of hc.HC_FRAMEWORK_PERMISSIONS) {
    assert.equal(REF.permissions[p.value].description, p.description, p.value);
    assert.equal(REF.permissions[p.value].protectionLevel, p.protectionLevel, p.value);
  }
});

test("reference maps a permission to a record only where Google's data-types table does", () => {
  for (const [perm, entry] of Object.entries(REF.permissions)) {
    for (const r of entry.records) {
      const rec = hc.HC_RECORDS.find((x) => x.className === r.className);
      assert.ok(rec, r.className);
      const list = r.access === "read" ? rec.readPermissions : rec.writePermissions;
      assert.ok(list.includes(perm), `${perm} is not in ${r.className}.${r.access}Permissions`);
      assert.equal(r.path, `/health-connect/${rec.slug}`);
    }
  }
  const steps = REF.permissions[P("READ_STEPS")];
  assert.ok(steps.records.some((r) => r.className === "StepsRecord" && r.access === "read"));
  assert.equal(steps.path, "/health-connect/permissions#perm-read-steps");
});

test("reference carries Google's labels for the additional read permissions and the unresolved strings", () => {
  for (const a of hc.HC_ADDITIONAL_READ_PERMISSIONS) assert.equal(REF.permissions[a.permission].label, a.label);
  for (const u of hc.HC_UNRESOLVED_PERMISSIONS) {
    assert.ok(REF.unresolved[u.permission].classNames.includes(u.className));
    assert.equal(REF.permissions[u.permission], undefined, "an unresolved string must not also be known");
  }
});

// ---------------------------------------------------------------------------
// Android scanning
// ---------------------------------------------------------------------------

test("manifest: requested, referenced, commented-out and other permissions are told apart", () => {
  const s = scanAndroid(MANIFEST);
  const req = s.requested.map((r) => r.permission);
  assert.deepEqual(req, [
    P("READ_STEPS"),
    P("WRITE_STEPS"),
    P("READ_HEART_RATE"),
    P("READ_HEALTH_DATA_IN_BACKGROUND"),
    P("READ_EXERCISE_ROUTE"),
    P("READ_TELEPATHY"),
    P("WRITE_WEIGHT"),
  ]);
  assert.equal(s.requested.find((r) => r.permission === P("READ_HEART_RATE")).count, 2);
  assert.deepEqual(s.requested.find((r) => r.permission === P("WRITE_WEIGHT")).attrs, ["tools:node=remove"]);
  assert.equal(s.requested.find((r) => r.permission === P("WRITE_WEIGHT")).element, "uses-permission-sdk-23");
  assert.deepEqual(s.commentedOut, [P("READ_SLEEP")]);
  assert.deepEqual(s.otherPermissions, ["android.permission.INTERNET"]);
  assert.deepEqual(
    s.referenced.map((r) => [r.permission, r.where, r.detail]),
    [[P("START_ONBOARDING"), "attribute", "android:permission on <activity>"]],
  );
  assert.equal(s.hasRationale, false);
  assert.equal(s.hasPermissionUsage, false);
});

test("manifest: rows say what Google's reference says, and nothing for strings it lacks", () => {
  const r = xray(MANIFEST, REF);
  const row = (short) => r.androidRows.find((x) => x.short === short);

  const steps = row("READ_STEPS");
  assert.equal(steps.status, "known");
  assert.equal(steps.grants, hc.HC_FRAMEWORK_PERMISSIONS.find((p) => p.value === P("READ_STEPS")).description);
  assert.ok(steps.records.some((x) => x.className === "StepsRecord"));

  assert.equal(row("READ_HEALTH_DATA_IN_BACKGROUND").label, "Read data in background");

  const route = row("READ_EXERCISE_ROUTE");
  assert.equal(route.status, "unresolved");
  assert.equal(route.grants, null);
  assert.equal(route.frameworkNear, P("READ_EXERCISE_ROUTES"));

  const fake = row("READ_TELEPATHY");
  assert.equal(fake.status, "unknown");
  assert.equal(fake.grants, null);
  assert.deepEqual(fake.records, []);
  assert.match(androidGrants(fake), /^Not in Health Connect's published reference\.$/);

  const guard = row("START_ONBOARDING");
  assert.equal(guard.requested, false);
  assert.equal(guard.status, "known");

  assert.equal(r.counts.androidRequested, 7);
  assert.equal(r.counts.androidRead, 5);
  assert.equal(r.counts.androidWrite, 2);
  assert.equal(r.counts.androidUnresolved, 1);
  assert.equal(r.counts.androidUnknown, 1);
  assert.equal(r.counts.androidKnown, 5);
  assert.equal(r.counts.androidReferencedOnly, 1);
  assert.equal(r.counts.androidOtherPermissions, 1);

  const f = ids(r);
  for (const id of [
    "android-no-rationale",
    "android-no-permission-usage",
    "android-unresolved-READ_EXERCISE_ROUTE",
    "android-unknown-READ_TELEPATHY",
    "android-duplicate-READ_HEART_RATE",
    "android-commented",
  ]) {
    assert.ok(f.includes(id), `missing finding ${id}: ${f.join(", ")}`);
  }
  const rationale = r.findings.find((x) => x.id === "android-no-rationale");
  assert.equal(rationale.source.href, SOURCES.permissionController.path);
  assert.equal(rationale.quote.by, "Google");
  assert.match(findingText(rationale), new RegExp(RATIONALE_ACTION.replace(/\./g, "\\.")));
});

test("manifest: the rationale activity and the HEALTH_PERMISSIONS alias clear their findings", () => {
  const withRationale = MANIFEST.replace("</application>", `${RATIONALE}\n  </application>`);
  const r = xray(withRationale, REF);
  assert.ok(!ids(r).includes("android-no-rationale"));
  assert.ok(!ids(r).includes("android-no-permission-usage"));
});

test("manifest: VIEW_PERMISSION_USAGE without the category in its intent-filter is still flagged", () => {
  const split = MANIFEST.replace(
    "</application>",
    `${RATIONALE.replace('<category android:name="android.intent.category.HEALTH_PERMISSIONS" />', "")}
    <activity android:name=".Other"><intent-filter><category android:name="android.intent.category.HEALTH_PERMISSIONS" /></intent-filter></activity>
  </application>`,
  );
  const r = xray(split, REF);
  const f = r.findings.find((x) => x.id === "android-no-permission-usage");
  assert.ok(f);
  assert.match(f.text, /not in the same intent-filter/);
});

test("no health permissions requested: no rationale finding", () => {
  const r = xray('<manifest><uses-permission android:name="android.permission.INTERNET"/></manifest>', REF);
  assert.equal(r.counts.androidRequested, 0);
  assert.ok(!ids(r).includes("android-no-rationale"));
});

test("malformed and partial input never throws and still finds the strings", () => {
  const broken = [
    '<manifest><uses-permission android:name="android.permission.health.READ_STEPS"',
    "<application><activity><intent-filter><action android:name='androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE'>",
    "val p = setOf(\"android.permission.health.WRITE_DISTANCE\")",
    "<!-- unterminated comment android.permission.health.READ_SLEEP",
  ].join("\n");
  const r = xray(broken, REF);
  assert.ok(r.androidRows.some((x) => x.short === "WRITE_DISTANCE" && !x.requested && x.how.startsWith("text")));
  assert.ok(r.androidRows.some((x) => x.short === "READ_STEPS"));
  assert.ok(!r.androidRows.some((x) => x.short === "READ_SLEEP"));
  for (const junk of ["", "   ", "<<<>>>", "<key>", "\u0000\u0001", "<string>", "{\"a\":"]) {
    const j = xray(junk, REF);
    assert.equal(j.empty, true, JSON.stringify(junk));
  }
  assert.equal(xray(undefined, REF).empty, true);
});

test("case and near-miss strings are never matched to a known permission", () => {
  const r = xray('<uses-permission android:name="android.permission.health.read_steps"/>', REF);
  assert.equal(r.androidRows[0].status, "unknown");
});

// ---------------------------------------------------------------------------
// iOS scanning
// ---------------------------------------------------------------------------

test("plist: keys, values, entitlement arrays and booleans are read", () => {
  const s = scanIos(PLIST);
  const k = (key) => s.keys.find((x) => x.key === key);
  assert.equal(k("NSHealthShareUsageDescription").value, "We read your steps & workouts to chart your week.");
  assert.equal(k("NSHealthUpdateUsageDescription").value, "");
  assert.equal(k("com.apple.developer.healthkit").value, true);
  assert.deepEqual(k("com.apple.developer.healthkit.access").value, ["health-records", "something-else"]);
  assert.equal(k("com.apple.developer.healthkit.background-delivery").value, false);
});

test("plist: rows explain documented keys from the site's sourced text and leave the rest unexplained", () => {
  const r = xray(PLIST, REF);
  const row = (item) => r.iosRows.find((x) => x.item === item);
  assert.equal(row("NSHealthShareUsageDescription").grants, IOS_KEYS.NSHealthShareUsageDescription.apple);
  assert.equal(row("com.apple.developer.healthkit.access → health-records").grants, IOS_ACCESS_VALUES["health-records"].apple);
  assert.equal(row("NSHealthMadeUpUsageDescription").status, "unknown");
  assert.equal(row("NSHealthMadeUpUsageDescription").grants, null);
  assert.equal(row("com.apple.developer.healthkit.access → something-else").status, "unknown");

  const f = ids(r);
  for (const id of [
    "ios-empty-NSHealthUpdateUsageDescription",
    "ios-clinical-no-key",
    "ios-clinical-review",
    "ios-background-false",
    "ios-unknown-NSHealthMadeUpUsageDescription",
  ]) {
    assert.ok(f.includes(id), `missing finding ${id}: ${f.join(", ")}`);
  }
  assert.ok(!f.includes("ios-no-usage-keys"));
  assert.ok(!f.includes("ios-no-entitlement"));
  assert.equal(r.counts.iosKeys, 8);
  assert.equal(r.counts.iosUnknown, 2);
});

test("entitlements alone: the missing usage keys are flagged with Apple's sentence", () => {
  const ent = "<dict><key>com.apple.developer.healthkit</key><true/></dict>";
  const r = xray(ent, REF);
  const f = r.findings.find((x) => x.id === "ios-no-usage-keys");
  assert.ok(f);
  assert.equal(f.quote.text, QUOTES.usageKeysCrash.text);
  assert.equal(f.source.href, "/integrate/healthkit");
});

test("Info.plist alone: one usage key, the builder's placeholder, and no entitlement", () => {
  const plist = "<key>NSHealthShareUsageDescription</key>\n<string>REPLACE ME — say plainly what you read and what you do with it.</string>";
  const f = ids(xray(plist, REF));
  assert.ok(f.includes("ios-one-usage-key"));
  assert.ok(f.includes("ios-placeholder-NSHealthShareUsageDescription"));
  assert.ok(f.includes("ios-no-entitlement"));
});

test("clinical key without the share key or health-records value", () => {
  const plist = [
    "<key>NSHealthClinicalHealthRecordsShareUsageDescription</key><string>We show your lab results.</string>",
    "<key>com.apple.developer.healthkit</key><true/>",
  ].join("\n");
  const f = ids(xray(plist, REF));
  assert.ok(f.includes("ios-clinical-no-share"));
  assert.ok(f.includes("ios-clinical-no-access"));
});

test("Expo-style JSON config is read too", () => {
  const app = JSON.stringify(
    { expo: { ios: { infoPlist: { NSHealthShareUsageDescription: "Reads \"steps\"", NSHealthUpdateUsageDescription: "Saves workouts" }, entitlements: { "com.apple.developer.healthkit": true, "com.apple.developer.healthkit.access": [] } } } },
    null,
    2,
  );
  const r = xray(app, REF);
  const row = (item) => r.iosRows.find((x) => x.item === item);
  assert.equal(row("NSHealthShareUsageDescription").value.value, 'Reads "steps"');
  assert.equal(row("com.apple.developer.healthkit").value.value, true);
  assert.deepEqual(row("com.apple.developer.healthkit.access").value.value, []);
  assert.ok(!ids(r).includes("ios-no-usage-keys"));
});

test("a bare mention is listed without a value", () => {
  const r = xray("We set NSHealthShareUsageDescription in Xcode.", REF);
  assert.equal(r.iosRows[0].value.form, "mention");
  assert.ok(!ids(r).some((id) => id.startsWith("ios-empty")));
});

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------

test("markdown: both tables, counts, findings, absolute links, escaped pipes", () => {
  const md = toMarkdown(xray(`${MANIFEST}\n${PLIST.replace("chart your week", "chart | your week")}`, REF));
  assert.match(md, /^# Permission X-ray$/m);
  assert.match(md, /^\| Permission \| How it appears \| What it grants \| Source \|$/m);
  assert.match(md, /^\| Key \| Kind \| Value \| What it is \| Source \|$/m);
  assert.match(md, /7 health permissions requested \(5 READ_\*, 2 WRITE_\*\)/);
  assert.match(md, /chart \\\| your week/);
  assert.match(md, /\(https:\/\/aifitnessapi\.com\/health-connect\/steps-record\)/);
  assert.match(md, /^## Findings$/m);
  assert.match(md, /Nothing was uploaded\./);
});

// ---------------------------------------------------------------------------
// Every sentence the tool quotes is still on the page it cites.
// ---------------------------------------------------------------------------

const entryCache = new Map();
function entryText({ file, slug }) {
  const key = `${file}#${slug}`;
  if (entryCache.has(key)) return entryCache.get(key);
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  const re = /"slug":\s*"([^"]+)"/g;
  const starts = [...src.matchAll(re)];
  const i = starts.findIndex((m) => m[1] === slug);
  assert.ok(i >= 0, `no entry ${slug} in ${file}`);
  const chunk = src.slice(starts[i].index, starts[i + 1]?.index ?? src.length);
  const text = chunk.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\*\*/g, "").replace(/`/g, "");
  entryCache.set(key, text);
  return text;
}

test("every quote is in the entry its source cites", () => {
  for (const [k, q] of Object.entries(QUOTES)) {
    const src = SOURCES[q.source];
    assert.ok(src?.evidence, `${k}: source ${q.source} has no evidence entry`);
    assert.ok(entryText(src.evidence).includes(q.text), `${k}: not found in ${src.evidence.slug}: ${q.text}`);
  }
});

test("every iOS description is in the entry its source cites, and the Xcode names too", () => {
  for (const [k, doc] of Object.entries(IOS_KEYS)) {
    const text = entryText(SOURCES[doc.source].evidence);
    assert.ok(text.includes(k), `${k} is not named in ${doc.source}`);
    if (doc.apple) assert.ok(text.includes(doc.apple), `${k}: Apple's description not in ${doc.source}`);
    if (doc.xcodeName) assert.ok(text.includes(`"${doc.xcodeName}"`), `${k}: Xcode name not in ${doc.source}`);
    if (doc.appleUrl) assert.ok(text.includes(doc.appleUrl), `${k}: Apple URL not in ${doc.source}`);
    for (const m of (doc.note ?? "").matchAll(/"([^"]+)"/g)) assert.ok(text.includes(m[1]), `${k}: note quote not in ${doc.source}`);
  }
  for (const [v, doc] of Object.entries(IOS_ACCESS_VALUES)) {
    const text = entryText(SOURCES[doc.source].evidence);
    assert.ok(text.includes(v) && text.includes(doc.apple), `${v}: not in ${doc.source}`);
  }
});

test("the rationale strings the scanner looks for are the ones in the cited manifest sample", () => {
  const text = entryText(SOURCES.permissionController.evidence);
  for (const s of [RATIONALE_ACTION, "android.intent.action.VIEW_PERMISSION_USAGE", "android.intent.category.HEALTH_PERMISSIONS"]) {
    assert.ok(text.includes(s), s);
  }
});

test("every page the tool links to is a real route", () => {
  const exists = (p) => {
    const [clean] = p.split("#");
    const seg = clean.replace(/^\//, "").split("/");
    const dir = path.join(ROOT, "src/app", ...seg);
    if (fs.existsSync(path.join(dir, "page.tsx"))) return true;
    // A cluster spoke: /<cluster>/<slug> rendered by [slug]/page.tsx and an entry with that slug.
    const parent = path.join(ROOT, "src/app", ...seg.slice(0, -1));
    return fs.existsSync(parent) && fs.readdirSync(parent).some((d) => /^\[.+\]$/.test(d));
  };
  for (const s of Object.values(SOURCES)) assert.ok(exists(s.path), s.path);
});
