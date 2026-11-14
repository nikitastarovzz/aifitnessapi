/**
 * Permission X-ray: the parsing half of the paste mode on
 * /tools/permission-builder. Pure functions only, so the browser and
 * `npm run test:permission-xray` run the same code; nothing here fetches,
 * stores or uploads anything.
 *
 * What it reads, and what it is allowed to say about it:
 *
 *   Android: every android.permission.health.* string in a pasted
 *   AndroidManifest.xml (or any text). Each one is looked up in a reference
 *   built from src/data/healthConnectRecords.ts, which is GENERATED from
 *   Google's HealthPermissions reference and the Health Connect data-types
 *   table. A string that reference does not define is reported as not in it,
 *   never guessed at. The rationale-activity check repeats the sentence the
 *   site already quotes from Google's get-started guide on
 *   /health-connect-api/permissioncontroller-request-permissions.
 *
 *   iOS: the NSHealth* usage-description keys and com.apple.developer.healthkit*
 *   entitlements in a pasted Info.plist / .entitlements file (XML, or the JSON
 *   an Expo config uses). Every description below is copied from a page on
 *   this site that quotes Apple, and names that page; the test checks each
 *   quote is still in the cited entry. A key this table does not list is
 *   reported as not documented on this site.
 *
 * Nothing in this file states an Apple or Google rule of its own.
 */

export const HC_PREFIX = "android.permission.health.";
export const SITE_URL = "https://aifitnessapi.com";
export const TOOL_PATH = "/tools/permission-builder";

/** Inputs over this size are cut before scanning, so a stray paste of a whole
 *  build log cannot hang the tab. A real manifest or plist is far smaller. */
export const MAX_INPUT = 400_000;

// ---------------------------------------------------------------------------
// Sources on this site. `evidence` names the entry the quote is checked
// against by scripts/permission-xray.test.mjs.
// ---------------------------------------------------------------------------

export const SOURCES = {
  integrateHealthkit: {
    path: "/integrate/healthkit",
    label: "How to integrate Apple HealthKit",
    evidence: { file: "src/data/integrate.entries.ts", slug: "healthkit" },
  },
  clinicalRecords: {
    path: "/data/clinical-records-api",
    label: "HealthKit clinical records",
    evidence: { file: "src/data/data.entries.ts", slug: "clinical-records-api" },
  },
  backgroundDelivery: {
    path: "/fix/healthkit-background-delivery-not-working",
    label: "HealthKit background delivery not working",
    evidence: { file: "src/data/fix.entries.ts", slug: "healthkit-background-delivery-not-working" },
  },
  permissionController: {
    path: "/health-connect-api/permissioncontroller-request-permissions",
    label: "Health Connect PermissionController",
    evidence: { file: "src/data/healthConnectApi.entries.ts", slug: "permissioncontroller-request-permissions" },
  },
  hcPermissions: {
    path: "/health-connect/permissions",
    label: "Every Health Connect permission",
    evidence: null,
  },
  builder: {
    path: TOOL_PATH,
    label: "the builder above",
    evidence: null,
  },
};

/**
 * The iOS keys this site documents. `apple` is Apple's own description as a
 * page on this site quotes it; `null` where the site quotes none.
 */
export const IOS_KEYS = {
  NSHealthShareUsageDescription: {
    kind: "Info.plist key",
    xcodeName: "Privacy - Health Share Usage Description",
    apple: "A message that explains to people why the app requests permission to read samples from the HealthKit store.",
    use: "read",
    source: "integrateHealthkit",
    appleUrl: "https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription",
  },
  NSHealthUpdateUsageDescription: {
    kind: "Info.plist key",
    xcodeName: "Privacy - Health Update Usage Description",
    apple: "A message to the user that explains why the app requested permission to save samples to the HealthKit store.",
    use: "write",
    source: "integrateHealthkit",
    appleUrl: "https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthupdateusagedescription",
  },
  NSHealthClinicalHealthRecordsShareUsageDescription: {
    kind: "Info.plist key",
    xcodeName: null,
    apple: "A message to the user that explains why the app requested permission to read clinical records",
    use: "clinical",
    source: "clinicalRecords",
    appleUrl: null,
  },
  "com.apple.developer.healthkit": {
    kind: "Entitlement",
    xcodeName: "HealthKit",
    apple: "A Boolean value that indicates whether the app may request user authorization to access health and activity data that appears in the Health app.",
    use: "entitlement",
    source: "integrateHealthkit",
    appleUrl: "https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit",
  },
  "com.apple.developer.healthkit.background-delivery": {
    kind: "Entitlement",
    xcodeName: "HealthKit Observer Query Background Delivery",
    apple: "A Boolean value that indicates whether observer queries receive updates while running in the background.",
    use: "background",
    source: "integrateHealthkit",
    appleUrl: "https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.developer.healthkit.background-delivery",
  },
  "com.apple.developer.healthkit.access": {
    kind: "Entitlement",
    xcodeName: null,
    apple: null,
    note: 'The HealthKit Capabilities Entitlement. Apple: "Only add values for data types that your app needs to access."',
    use: "access",
    source: "clinicalRecords",
    appleUrl: null,
  },
};

/** Values of com.apple.developer.healthkit.access this site documents. */
export const IOS_ACCESS_VALUES = {
  "health-records": {
    apple: "The app can request access to FHIR-backed clinical records.",
    note: "Added by the Clinical Health Records checkbox.",
    source: "clinicalRecords",
  },
};

/**
 * Sentences the findings quote, each from the entry its source names.
 * `by` says whose words they are: Apple's or Google's as the page quotes
 * them, or the page's own ("site"). Markdown emphasis and code ticks are
 * dropped; the test compares against the entry with those removed.
 */
export const QUOTES = {
  usageKeysCrash: { text: "You must set the usage keys, or your app will crash when you request authorization.", source: "integrateHealthkit", by: "Apple" },
  usageKeyPairing: {
    text: "HealthKit requires NSHealthShareUsageDescription to read data and NSHealthUpdateUsageDescription to write data.",
    source: "integrateHealthkit",
    by: "site",
  },
  usageValueShown: { text: "Their values are the text the system shows the user in the permission sheet.", source: "integrateHealthkit", by: "site" },
  appReview511: {
    text: "App Review Guideline 5.1.1 asks that they clearly and completely describe your use of the data",
    source: "integrateHealthkit",
    by: "site",
  },
  entitlementCapability: { text: "To add this entitlement to your app, enable the HealthKit capability in Xcode.", source: "integrateHealthkit", by: "Apple" },
  entitlementBoolean: {
    text: "A Boolean value that indicates whether the app may request user authorization to access health and activity data that appears in the Health app.",
    source: "integrateHealthkit",
    by: "Apple",
  },
  clinicalKeyRequired: { text: "This key is required if your app uses APIs that access the user's clinical records.", source: "clinicalRecords", by: "Apple" },
  clinicalStillShare: { text: "You still need NSHealthShareUsageDescription as for any HealthKit read.", source: "clinicalRecords", by: "site" },
  clinicalAccessNeeded: {
    text: "Access needs the Clinical Health Records capability (the health-records value of the com.apple.developer.healthkit.access entitlement)",
    source: "clinicalRecords",
    by: "site",
  },
  clinicalReview: {
    text: "App Review may reject apps that enable the Clinical Health Records capability if the app doesn't actually use the health record data.",
    source: "clinicalRecords",
    by: "Apple",
  },
  backgroundDefaultFalse: {
    text: "Since iOS 15 and watchOS 8 you must add the com.apple.developer.healthkit.background-delivery entitlement, which defaults to false; without it Apple documents that enableBackgroundDelivery(for:frequency:withCompletion:) fails with an HKError.Code.errorAuthorizationDenied error.",
    source: "backgroundDelivery",
    by: "site",
  },
  rationaleActivity: {
    text: "Your Android manifest needs to have an Activity that displays your app's privacy policy, which is your app's rationale of the requested permissions, describing how the user's data is used and handled.",
    source: "permissionController",
    by: "Google",
  },
  permissionUsageAlias: {
    text: "Because the permission screen links to your privacy policy, the manifest also needs an activity for ACTION_SHOW_PERMISSIONS_RATIONALE and, on Android 14 and later, an activity alias for VIEW_PERMISSION_USAGE.",
    source: "permissionController",
    by: "site",
  },
};

/** The rationale-activity strings, exactly as Google's manifest sample on
 *  SOURCES.permissionController prints them. */
export const RATIONALE_ACTION = "androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE";
export const PERMISSION_USAGE_ACTION = "android.intent.action.VIEW_PERMISSION_USAGE";
export const HEALTH_PERMISSIONS_CATEGORY = "android.intent.category.HEALTH_PERMISSIONS";

/** The placeholder the builder's Info.plist pane emits. */
export const BUILDER_PLACEHOLDER = "REPLACE ME";

// ---------------------------------------------------------------------------
// Android reference — built server-side from the generated module.
// ---------------------------------------------------------------------------

const defaultHelpers = {
  recordPath: (r) => `/health-connect/${r.slug}`,
  permissionAnchor: (p) => `perm-${p.replace(/^android\.permission\.health\./, "").toLowerCase().replace(/_/g, "-")}`,
  groupOf: () => null,
  availability: (added) => added,
};

/**
 * Join the generated Health Connect tables into the one lookup the scanner
 * needs: permission string → Google's description, availability, protection
 * level, the record classes whose data-types row prints it, and the page
 * that lists it. Plain JSON, so the page can hand it to the client.
 */
export function buildAndroidReference(hc, helpers = {}) {
  const h = { ...defaultHelpers, ...helpers };
  const listPath = SOURCES.hcPermissions.path;
  const permissions = {};
  for (const p of hc.HC_FRAMEWORK_PERMISSIONS) {
    permissions[p.value] = {
      constant: p.constant,
      description: p.description ?? null,
      protectionLevel: p.protectionLevel ?? null,
      added: h.availability(p.added ?? null),
      group: h.groupOf(p) ?? null,
      label: null,
      records: [],
      path: `${listPath}#${h.permissionAnchor(p.value)}`,
    };
  }
  for (const a of hc.HC_ADDITIONAL_READ_PERMISSIONS ?? []) {
    if (permissions[a.permission]) permissions[a.permission].label = a.label;
  }
  const unresolved = {};
  for (const u of hc.HC_UNRESOLVED_PERMISSIONS ?? []) {
    const plural = permissions[`${u.permission}S`] ? `${u.permission}S` : null;
    const prev = unresolved[u.permission];
    unresolved[u.permission] = {
      classNames: [...(prev?.classNames ?? []), u.className],
      frameworkNear: plural,
      path: `${listPath}#${h.permissionAnchor(u.permission)}`,
    };
  }
  for (const r of hc.HC_RECORDS) {
    for (const [list, access] of [
      [r.readPermissions, "read"],
      [r.writePermissions, "write"],
    ]) {
      for (const perm of list) {
        const target = permissions[perm];
        if (!target) continue;
        target.records.push({ className: r.className, label: r.dataTypeLabel, category: r.category ?? null, access, path: h.recordPath(r) });
      }
    }
  }
  return {
    fetchedOn: hc.HC_FETCHED_ON,
    frameworkUrl: hc.HC_FW_PERMISSIONS_URL ?? null,
    dataTypesUrl: hc.HC_DATA_TYPES_URL ?? null,
    count: Object.keys(permissions).length,
    permissions,
    unresolved,
  };
}

// ---------------------------------------------------------------------------
// Shared text helpers
// ---------------------------------------------------------------------------

function clip(text) {
  const s = typeof text === "string" ? text : String(text ?? "");
  return s.length > MAX_INPUT ? s.slice(0, MAX_INPUT) : s;
}

/** Replace XML comments with spaces of the same length (newlines kept), so
 *  offsets and line numbers still point at the original text. */
function blankComments(text) {
  const comments = [];
  const out = text.replace(/<!--[\s\S]*?(?:-->|$)/g, (m) => {
    comments.push(m);
    return m.replace(/[^\n]/g, " ");
  });
  return { clean: out, comments };
}

function lineAt(text, index) {
  let n = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, x) => String.fromCodePoint(parseInt(x, 16)))
    .replace(/&amp;/g, "&");
}

function parseAttrs(raw) {
  const attrs = {};
  for (const m of raw.matchAll(/([A-Za-z_][\w.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[m[1]] = decodeEntities(m[2] ?? m[3] ?? "");
  }
  return attrs;
}

/** The attribute whose local name is `local` (android:name, a:name …). */
function attrByLocal(attrs, local) {
  for (const [k, v] of Object.entries(attrs)) {
    if (k === local || k.endsWith(`:${local}`)) return v;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Android
// ---------------------------------------------------------------------------

const TAG_RE = /<([A-Za-z][\w.:-]*)((?:[^<>"']|"[^"]*"|'[^']*')*)>/g;
const HEALTH_RE = /android\.permission\.health\.[A-Za-z0-9_]+/g;

/**
 * Scan pasted text for Health Connect permissions. Tolerant of fragments and
 * broken XML: elements are read with a tag regex, not a parser, and any
 * android.permission.health.* string outside an element is still listed.
 */
export function scanAndroid(input) {
  const text = clip(input);
  const { clean, comments } = blankComments(text);
  const requested = new Map();
  const referenced = [];
  const otherPermissions = new Set();
  const actions = [];
  const categories = [];
  const tagRanges = [];
  let usesPermissionCount = 0;

  for (const m of clean.matchAll(TAG_RE)) {
    const name = m[1];
    const raw = m[2] ?? "";
    const start = m.index;
    const end = start + m[0].length;
    tagRanges.push([start, end]);
    const attrs = parseAttrs(raw);
    const lname = name.toLowerCase();
    if (lname === "uses-permission" || lname === "uses-permission-sdk-23") {
      usesPermissionCount++;
      const perm = attrByLocal(attrs, "name");
      if (perm && perm.startsWith(HC_PREFIX)) {
        const line = lineAt(text, start);
        const extra = [];
        const maxSdk = attrByLocal(attrs, "maxSdkVersion");
        if (maxSdk) extra.push(`maxSdkVersion=${maxSdk}`);
        const node = attrs["tools:node"];
        if (node) extra.push(`tools:node=${node}`);
        const prev = requested.get(perm);
        if (prev) {
          prev.count++;
          prev.lines.push(line);
        } else {
          requested.set(perm, { permission: perm, element: lname, attrs: extra, lines: [line], count: 1 });
        }
      } else if (perm) {
        otherPermissions.add(perm);
      }
      continue;
    }
    if (lname === "action") {
      const a = attrByLocal(attrs, "name");
      if (a) actions.push({ name: a, index: start });
    } else if (lname === "category") {
      const c = attrByLocal(attrs, "name");
      if (c) categories.push({ name: c, index: start });
    }
    for (const [k, v] of Object.entries(attrs)) {
      for (const hm of v.matchAll(HEALTH_RE)) {
        referenced.push({ permission: hm[0], where: "attribute", detail: `${k} on <${name}>`, line: lineAt(text, start) });
      }
    }
  }

  // Strings outside any element: a resource array, Kotlin, a plain list.
  for (const hm of clean.matchAll(HEALTH_RE)) {
    const i = hm.index;
    if (tagRanges.some(([s, e]) => i >= s && i < e)) continue;
    referenced.push({ permission: hm[0], where: "text", detail: "outside a <uses-permission> element", line: lineAt(text, i) });
  }

  const commentedOut = [...new Set(comments.flatMap((c) => [...c.matchAll(HEALTH_RE)].map((x) => x[0])))];

  // Intent filters, so the VIEW_PERMISSION_USAGE action and the
  // HEALTH_PERMISSIONS category are only paired when they share one.
  const filters = [...clean.matchAll(/<intent-filter\b[^>]*>([\s\S]*?)<\/intent-filter\s*>/g)].map((m) => [m.index, m.index + m[0].length]);
  const inFilter = (idx) => filters.findIndex(([s, e]) => idx >= s && idx < e);
  const hasRationale = actions.some((a) => /SHOW_PERMISSIONS_RATIONALE$/.test(a.name));
  const usageActions = actions.filter((a) => a.name === PERMISSION_USAGE_ACTION);
  const healthCats = categories.filter((c) => c.name === HEALTH_PERMISSIONS_CATEGORY);
  let hasPermissionUsage = false;
  if (filters.length === 0) {
    hasPermissionUsage = usageActions.length > 0 && healthCats.length > 0;
  } else {
    hasPermissionUsage = usageActions.some((a) => {
      const f = inFilter(a.index);
      return healthCats.some((c) => inFilter(c.index) === f);
    });
  }

  return {
    requested: [...requested.values()],
    referenced: referenced.filter((r) => !requested.has(r.permission)),
    commentedOut: commentedOut.filter((p) => !requested.has(p)),
    otherPermissions: [...otherPermissions],
    usesPermissionCount,
    hasRationale,
    hasPermissionUsageAction: usageActions.length > 0,
    hasPermissionUsage,
  };
}

// ---------------------------------------------------------------------------
// iOS
// ---------------------------------------------------------------------------

const IOS_NAME_RE = /\b(NSHealth[A-Za-z]*|com\.apple\.developer\.healthkit(?:\.[A-Za-z][A-Za-z-]*)*)/g;

function isIosName(k) {
  return /^NSHealth[A-Za-z]*$/.test(k) || /^com\.apple\.developer\.healthkit(?:\.[A-Za-z][A-Za-z-]*)*$/.test(k);
}

/**
 * Scan pasted text for HealthKit Info.plist keys and entitlements: XML plist
 * <key>/<value> pairs, "Key": value pairs (an Expo infoPlist or entitlements
 * object), and, failing both, a bare mention whose value is not read.
 */
export function scanIos(input) {
  const text = clip(input);
  const { clean } = blankComments(text);
  const keys = new Map();
  const add = (key, entry) => {
    if (!keys.has(key)) keys.set(key, { key, ...entry, count: 1 });
    else if (entry.form !== "mention") keys.get(key).count++;
  };

  const XML_PAIR =
    /<key>\s*([^<]*?)\s*<\/key>\s*(?:<string>([\s\S]*?)<\/string>|<string\s*\/>|<(true|false)\s*\/>|<array>([\s\S]*?)<\/array>|<array\s*\/>|<(\w+)\b[^>]*>)?/g;
  for (const m of clean.matchAll(XML_PAIR)) {
    const key = decodeEntities(m[1]).trim();
    if (!isIosName(key)) continue;
    const line = lineAt(text, m.index);
    const whole = m[0];
    let value;
    if (m[2] !== undefined) value = { type: "string", value: decodeEntities(m[2]).trim() };
    else if (/<string\s*\/>\s*$/.test(whole)) value = { type: "string", value: "" };
    else if (m[3]) value = { type: "boolean", value: m[3] === "true" };
    else if (m[4] !== undefined || /<array\s*\/>\s*$/.test(whole)) {
      const items = [...(m[4] ?? "").matchAll(/<string>([\s\S]*?)<\/string>/g)].map((x) => decodeEntities(x[1]).trim());
      value = { type: "array", value: items };
    } else if (m[5]) value = { type: "other", value: `<${m[5]}>` };
    else value = { type: "missing", value: null };
    add(key, { ...value, line, form: "plist" });
  }

  const JSON_PAIR = /["']([A-Za-z][\w.-]*)["']\s*:\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|(true|false)\b|\[([^\]]*)\])/g;
  for (const m of clean.matchAll(JSON_PAIR)) {
    const key = m[1];
    if (!isIosName(key) || keys.has(key)) continue;
    const line = lineAt(text, m.index);
    let value;
    if (m[2] !== undefined || m[3] !== undefined) {
      let v = m[2] !== undefined ? m[2] : m[3].replace(/\\'/g, "'");
      if (m[2] !== undefined) {
        try {
          v = JSON.parse(`"${m[2]}"`);
        } catch {
          v = m[2];
        }
      }
      value = { type: "string", value: String(v).trim() };
    } else if (m[4]) value = { type: "boolean", value: m[4] === "true" };
    else {
      const items = [...(m[5] ?? "").matchAll(/["']([^"']*)["']/g)].map((x) => x[1].trim());
      value = { type: "array", value: items };
    }
    add(key, { ...value, line, form: "json" });
  }

  for (const m of clean.matchAll(IOS_NAME_RE)) {
    const key = m[1];
    if (keys.has(key)) continue;
    add(key, { type: "missing", value: null, line: lineAt(text, m.index), form: "mention" });
  }
  return { keys: [...keys.values()] };
}

// ---------------------------------------------------------------------------
// The report
// ---------------------------------------------------------------------------

function prefixKind(perm) {
  const short = perm.slice(HC_PREFIX.length);
  return /^READ_/.test(short) ? "read" : /^WRITE_/.test(short) ? "write" : "other";
}

function androidRow(perm, how, ref, extra = {}) {
  const known = ref.permissions[perm];
  const unresolved = ref.unresolved[perm];
  const base = { platform: "android", item: perm, short: perm.slice(HC_PREFIX.length), how, byName: prefixKind(perm), ...extra };
  if (known) {
    return {
      ...base,
      status: "known",
      grants: known.description,
      label: known.label,
      group: known.group,
      added: known.added,
      protectionLevel: known.protectionLevel,
      records: known.records,
      links: [{ label: "Permission reference", href: known.path }, ...known.records.map((r) => ({ label: r.className, href: r.path }))],
    };
  }
  if (unresolved) {
    return {
      ...base,
      status: "unresolved",
      grants: null,
      classNames: unresolved.classNames,
      frameworkNear: unresolved.frameworkNear,
      records: [],
      links: [{ label: "Where Google's pages disagree", href: unresolved.path }],
    };
  }
  return { ...base, status: "unknown", grants: null, records: [], links: [{ label: "Every Health Connect permission", href: SOURCES.hcPermissions.path }] };
}

function finding(level, id, text, quoteKey, sourceKey) {
  const q = quoteKey ? QUOTES[quoteKey] : null;
  const src = SOURCES[sourceKey ?? q?.source];
  return { level, id, text, quote: q ? { text: q.text, by: q.by } : null, source: src ? { label: src.label, href: src.path } : null };
}

function iosRow(k) {
  const doc = IOS_KEYS[k.key];
  const src = doc ? SOURCES[doc.source] : null;
  const links = [];
  if (src) links.push({ label: src.label, href: src.path });
  if (doc?.appleUrl) links.push({ label: "Apple reference", href: doc.appleUrl });
  return {
    platform: "ios",
    item: k.key,
    kind: doc?.kind ?? (k.key.startsWith("NSHealth") ? "Info.plist key" : "Entitlement"),
    xcodeName: doc?.xcodeName ?? null,
    value: k,
    status: doc ? "known" : "unknown",
    grants: doc?.apple ?? null,
    note: doc?.note ?? null,
    links,
  };
}

/**
 * Run both scanners and turn what they found into rows, counts and findings.
 * `ref` is buildAndroidReference()'s output. Platform is decided by what is
 * in the paste, not by a switch: a manifest yields Android rows, a plist iOS
 * rows, a mixed paste both.
 */
export function xray(input, ref) {
  const text = clip(input);
  const truncated = typeof input === "string" && input.length > MAX_INPUT;
  const a = scanAndroid(text);
  const i = scanIos(text);

  // ---- Android rows
  const androidRows = [];
  for (const r of a.requested) {
    const how = [r.element === "uses-permission" ? "<uses-permission>" : "<uses-permission-sdk-23>", ...r.attrs].join(" · ");
    androidRows.push(androidRow(r.permission, how, ref, { requested: true, lines: r.lines, count: r.count }));
  }
  const seenRef = new Set();
  for (const r of a.referenced) {
    const key = `${r.permission}|${r.where}|${r.detail}`;
    if (seenRef.has(key)) continue;
    seenRef.add(key);
    androidRows.push(androidRow(r.permission, r.where === "attribute" ? r.detail : "text, not a <uses-permission>", ref, { requested: false, lines: [r.line], count: 1 }));
  }

  const req = androidRows.filter((r) => r.requested);
  const findings = [];

  if (req.length > 0 && !a.hasRationale) {
    findings.push(
      finding(
        "warn",
        "android-no-rationale",
        `No ${RATIONALE_ACTION} action in what you pasted, although it requests ${req.length} health permission${req.length === 1 ? "" : "s"}.`,
        "rationaleActivity",
      ),
    );
  }
  if (req.length > 0 && !a.hasPermissionUsage) {
    findings.push(
      finding(
        "warn",
        "android-no-permission-usage",
        a.hasPermissionUsageAction
          ? `${PERMISSION_USAGE_ACTION} is here, but not in the same intent-filter as ${HEALTH_PERMISSIONS_CATEGORY}, which is how Google's manifest sample declares it.`
          : `No ${PERMISSION_USAGE_ACTION} intent-filter with ${HEALTH_PERMISSIONS_CATEGORY} in what you pasted.`,
        "permissionUsageAlias",
      ),
    );
  }
  for (const r of androidRows.filter((x) => x.status === "unresolved")) {
    findings.push(
      finding(
        "warn",
        `android-unresolved-${r.short}`,
        `${r.item} is printed in Google's data-types table (${r.classNames.join(", ")}) but defined by neither Google permission reference.${r.frameworkNear ? ` The framework reference defines ${r.frameworkNear}.` : ""}`,
        null,
        "hcPermissions",
      ),
    );
  }
  for (const r of androidRows.filter((x) => x.status === "unknown")) {
    findings.push(
      finding(
        "warn",
        `android-unknown-${r.short}`,
        `${r.item} is not in Health Connect's published reference as read on ${ref.fetchedOn}. Nothing is inferred from its name.`,
        null,
        "hcPermissions",
      ),
    );
  }
  for (const r of req.filter((x) => x.count > 1)) {
    findings.push(finding("note", `android-duplicate-${r.short}`, `${r.item} is declared ${r.count} times (lines ${r.lines.join(", ")}).`, null, null));
  }
  if (a.commentedOut.length) {
    findings.push(
      finding(
        "note",
        "android-commented",
        `${a.commentedOut.length} health permission${a.commentedOut.length === 1 ? " appears" : "s appear"} only inside XML comments and ${a.commentedOut.length === 1 ? "was" : "were"} not counted: ${a.commentedOut.join(", ")}.`,
        null,
        null,
      ),
    );
  }

  // ---- iOS rows
  const iosRows = [];
  for (const k of i.keys) {
    iosRows.push(iosRow(k));
    if (k.key === "com.apple.developer.healthkit.access" && k.type === "array") {
      for (const v of k.value) {
        const doc = IOS_ACCESS_VALUES[v];
        const src = doc ? SOURCES[doc.source] : null;
        iosRows.push({
          platform: "ios",
          item: `com.apple.developer.healthkit.access → ${v}`,
          kind: "Entitlement value",
          xcodeName: null,
          value: { type: "string", value: v, line: k.line, form: k.form },
          status: doc ? "known" : "unknown",
          grants: doc?.apple ?? null,
          note: doc?.note ?? null,
          links: src ? [{ label: src.label, href: src.path }] : [],
        });
      }
    }
  }

  const has = (key) => i.keys.find((k) => k.key === key) ?? null;
  const share = has("NSHealthShareUsageDescription");
  const update = has("NSHealthUpdateUsageDescription");
  const clinical = has("NSHealthClinicalHealthRecordsShareUsageDescription");
  const ent = has("com.apple.developer.healthkit");
  const bg = has("com.apple.developer.healthkit.background-delivery");
  const access = has("com.apple.developer.healthkit.access");
  const anyEntitlement = i.keys.some((k) => k.key.startsWith("com.apple.developer.healthkit"));
  const healthRecords = access?.type === "array" && access.value.includes("health-records");

  if (anyEntitlement && !share && !update) {
    findings.push(finding("warn", "ios-no-usage-keys", "HealthKit entitlements are here, but neither NSHealthShareUsageDescription nor NSHealthUpdateUsageDescription is. Check that your Info.plist has the one each operation needs.", "usageKeysCrash"));
  }
  if ((share && !update) || (update && !share)) {
    const present = share ? "NSHealthShareUsageDescription" : "NSHealthUpdateUsageDescription";
    const absent = share ? "NSHealthUpdateUsageDescription" : "NSHealthShareUsageDescription";
    findings.push(
      finding("note", "ios-one-usage-key", `Only ${present} is here. If your app also ${share ? "writes" : "reads"}, it needs ${absent} too.`, "usageKeyPairing"),
    );
  }
  for (const k of [share, update, clinical].filter(Boolean)) {
    if (k.type === "string" && k.value === "") {
      findings.push(finding("warn", `ios-empty-${k.key}`, `${k.key} has an empty value.`, "usageValueShown"));
    } else if (k.type === "string" && k.value.includes(BUILDER_PLACEHOLDER)) {
      findings.push(
        finding("warn", `ios-placeholder-${k.key}`, `${k.key} still holds the builder's placeholder text. Write what your app actually does with the data.`, "appReview511"),
      );
    } else if (k.type !== "string" && k.form !== "mention") {
      findings.push(finding("warn", `ios-nonstring-${k.key}`, `${k.key} is not a string here (${k.type === "boolean" ? String(k.value) : k.type}).`, "usageValueShown"));
    }
  }
  if (healthRecords && !clinical) {
    findings.push(finding("warn", "ios-clinical-no-key", "health-records is in com.apple.developer.healthkit.access but NSHealthClinicalHealthRecordsShareUsageDescription is not here.", "clinicalKeyRequired"));
  }
  if (clinical && !share) {
    findings.push(finding("warn", "ios-clinical-no-share", "NSHealthClinicalHealthRecordsShareUsageDescription is here without NSHealthShareUsageDescription.", "clinicalStillShare"));
  }
  if (clinical && anyEntitlement && !healthRecords) {
    findings.push(finding("note", "ios-clinical-no-access", "NSHealthClinicalHealthRecordsShareUsageDescription is here, but the entitlements you pasted have no health-records value.", "clinicalAccessNeeded"));
  }
  if (healthRecords) {
    findings.push(finding("note", "ios-clinical-review", "This app enables Clinical Health Records.", "clinicalReview"));
  }
  if ((share || update || clinical) && !ent) {
    findings.push(finding("note", "ios-no-entitlement", "com.apple.developer.healthkit is not in what you pasted. The integration guide lists it as an entitlement, not an Info.plist key, so an Info.plist alone will not show it.", "entitlementCapability"));
  }
  if (ent && ent.type === "boolean" && ent.value === false) {
    findings.push(finding("note", "ios-entitlement-false", "com.apple.developer.healthkit is set to false here.", "entitlementBoolean"));
  }
  if (bg && bg.type === "boolean" && bg.value === false) {
    findings.push(finding("note", "ios-background-false", "com.apple.developer.healthkit.background-delivery is set to false here.", "backgroundDefaultFalse"));
  }
  for (const r of iosRows.filter((x) => x.status === "unknown")) {
    findings.push(finding("note", `ios-unknown-${r.item}`, `${r.item} is not documented on this site, so it is listed without an explanation.`, null, null));
  }

  const known = androidRows.filter((r) => r.status === "known");
  const records = new Set(req.flatMap((r) => (r.records ?? []).map((x) => x.className)));
  const counts = {
    androidRequested: req.length,
    androidRead: req.filter((r) => r.byName === "read").length,
    androidWrite: req.filter((r) => r.byName === "write").length,
    androidOther: req.filter((r) => r.byName === "other").length,
    androidKnown: known.filter((r) => r.requested).length,
    androidUnresolved: req.filter((r) => r.status === "unresolved").length,
    androidUnknown: req.filter((r) => r.status === "unknown").length,
    androidReferencedOnly: androidRows.filter((r) => !r.requested).length,
    androidRecords: records.size,
    androidOtherPermissions: a.otherPermissions.length,
    iosKeys: iosRows.length,
    iosKnown: iosRows.filter((r) => r.status === "known").length,
    iosUnknown: iosRows.filter((r) => r.status === "unknown").length,
    warnings: findings.filter((f) => f.level === "warn").length,
    notes: findings.filter((f) => f.level === "note").length,
  };

  return {
    empty: androidRows.length === 0 && iosRows.length === 0,
    truncated,
    androidRows,
    iosRows,
    otherPermissions: a.otherPermissions,
    findings,
    counts,
    referenceDate: ref.fetchedOn,
  };
}

// ---------------------------------------------------------------------------
// Markdown
// ---------------------------------------------------------------------------

function cell(s) {
  return String(s ?? "")
    .replace(/\r?\n+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();
}

function abs(href, siteUrl) {
  return href.startsWith("/") ? `${siteUrl}${href}` : href;
}

function mdLinks(links, siteUrl) {
  return links.map((l) => `[${cell(l.label)}](${abs(l.href, siteUrl)})`).join(", ");
}

export function valueText(v) {
  if (!v) return "";
  if (v.form === "mention") return "named, value not read";
  if (v.type === "string") return v.value === "" ? "(empty string)" : `"${v.value}"`;
  if (v.type === "boolean") return String(v.value);
  if (v.type === "array") return v.value.length ? v.value.join(", ") : "(empty array)";
  if (v.type === "other") return v.value;
  return "(no value)";
}

/** What the Android row says the permission grants, in one line. */
export function androidGrants(r) {
  if (r.status === "unresolved") return "Printed in Google's data-types table, defined by neither permission reference.";
  if (r.status === "unknown") return "Not in Health Connect's published reference.";
  const parts = [];
  if (r.grants) parts.push(`"${r.grants}"`);
  if (r.records.length) parts.push(`Record: ${r.records.map((x) => `${x.className} (${x.label}, ${x.access})`).join("; ")}`);
  else if (r.label) parts.push(`Google's label: ${r.label}`);
  else if (r.group) parts.push(r.group);
  if (r.added) parts.push(r.added);
  if (r.protectionLevel && r.protectionLevel !== "dangerous") parts.push(`protection level: ${r.protectionLevel}`);
  return parts.join(" · ");
}

export function iosGrants(r) {
  if (r.status === "unknown") return "Not documented on this site.";
  const parts = [];
  if (r.grants) parts.push(`"${r.grants}"`);
  if (r.note) parts.push(r.note);
  if (r.xcodeName) parts.push(`Xcode: ${r.xcodeName}`);
  return parts.join(" · ");
}

/** "Apple:", "Google:" or "The linked page:", before a finding's quote. */
export function quoteLead(by) {
  return by === "site" ? "The linked page:" : `${by}:`;
}

export function findingText(f) {
  return f.quote ? `${f.text} ${quoteLead(f.quote.by)} "${f.quote.text}"` : f.text;
}

export function toMarkdown(report, { siteUrl = SITE_URL } = {}) {
  const c = report.counts;
  const out = ["# Permission X-ray", "", `Scanned in the browser with ${siteUrl}${TOOL_PATH}. Nothing was uploaded.`, ""];
  if (report.androidRows.length) {
    out.push(
      `## Android: Health Connect`,
      "",
      `${c.androidRequested} health permission${c.androidRequested === 1 ? "" : "s"} requested (${c.androidRead} READ_*, ${c.androidWrite} WRITE_*${c.androidOther ? `, ${c.androidOther} other` : ""}); ${c.androidKnown} in Google's reference as read on ${report.referenceDate}, ${c.androidUnresolved + c.androidUnknown} not; ${c.androidRecords} record class${c.androidRecords === 1 ? "" : "es"}.`,
      "",
      "| Permission | How it appears | What it grants | Source |",
      "|---|---|---|---|",
    );
    for (const r of report.androidRows) out.push(`| \`${r.item}\` | \`${cell(r.how)}\` | ${cell(androidGrants(r))} | ${mdLinks(r.links, siteUrl)} |`);
    out.push("");
  }
  if (report.iosRows.length) {
    out.push(`## iOS: HealthKit`, "", `${c.iosKeys} key${c.iosKeys === 1 ? "" : "s"} or value${c.iosKeys === 1 ? "" : "s"} found; ${c.iosKnown} documented on this site, ${c.iosUnknown} not.`, "", "| Key | Kind | Value | What it is | Source |", "|---|---|---|---|---|");
    for (const r of report.iosRows) out.push(`| \`${r.item}\` | ${cell(r.kind)} | ${cell(valueText(r.value))} | ${cell(iosGrants(r))} | ${mdLinks(r.links, siteUrl)} |`);
    out.push("");
  }
  if (report.findings.length) {
    out.push("## Findings", "");
    for (const f of report.findings) {
      out.push(`- **${f.level === "warn" ? "Check" : "Note"}:** ${findingText(f)}${f.source ? ` (${mdLinks([f.source], siteUrl)})` : ""}`);
    }
    out.push("");
  }
  if (report.empty) out.push("Nothing health-related was found in the paste.", "");
  return out.join("\n");
}
