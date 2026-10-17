#!/usr/bin/env node
/**
 * Regenerate src/data/bluetoothGatt.ts from the Bluetooth SIG's own public
 * repository, https://bitbucket.org/bluetooth-SIG/public ("Public YAML files
 * for Bluetooth SIG Assigned Numbers, GATT Specification Supplement, and
 * Device Properties"):
 *
 *   assigned_numbers/uuids/service_uuids.yaml         service UUIDs, names, ids
 *   assigned_numbers/uuids/characteristic_uuids.yaml  characteristic UUIDs, names, ids
 *   assigned_numbers/uuids/units.yaml                 unit ids and names
 *   assigned_numbers/profiles_and_services/<x>/<x>_permitted_characteristics.yaml
 *                                                     the only files that tie
 *                                                     characteristics to a service
 *   gss/org.bluetooth.characteristic.<id>.yaml        one GATT Specification
 *                                                     Supplement structure per
 *                                                     characteristic
 *
 * How it reads them. The head of `main` is resolved through the Bitbucket API,
 * then the whole tree at that commit is downloaded as ONE archive
 * (bitbucket.org/bluetooth-SIG/public/get/<commit>.tar.gz) and read in memory —
 * nothing from it is written to disk except the archive itself, in the cache.
 * One request instead of ~300 also keeps clear of the AWS WAF challenge that
 * Bitbucket's raw endpoint serves to rapid-fire clients. The archive is
 * checked against the commit it claims to be (git's pax header carries it).
 *
 * The SIG's files carry no README or licence file; the only terms are the
 * notice at the top of every YAML file. It is copied into the generated file
 * verbatim (BT_GATT_TERMS), every file read must carry the same notice, and
 * the pages show it with the attribution. The notice says the files are
 * proprietary to Bluetooth SIG and that furnishing them grants no licence, so
 * nothing here relicenses the SIG's text: the pages quote it with attribution,
 * and the dataset (scripts/build-datasets.mjs) carries the structural facts
 * and the short lines they were read from, not the SIG's descriptions.
 *
 * No model in this loop. Everything published is copied from a file, or
 * computed mechanically from copied values, and the computed values keep
 * their evidence:
 *   - `units`: every org.bluetooth.unit… token in a field's description, with
 *     the line it appears on, and the unit's name only where units.yaml has
 *     exactly that id (no fuzzy match: the gss text sometimes names an id
 *     units.yaml does not have, and that is shown, not repaired).
 *   - `presence`: parsed only from a line reading exactly "Present if bit N of
 *     <Field> field is set to 0|1"; the line is stored beside it. Any other
 *     "Present if …" wording is kept as text and not parsed.
 *   - `offset`: the sum of the sizes before a field, and only where every one
 *     of those sizes is a plain number. Otherwise null, with the fields that
 *     make it vary listed.
 *   - `services`: only where a permitted-characteristics file lists the
 *     characteristic under a service. Nothing else in the repository maps a
 *     characteristic to a service, so nothing else is inferred.
 *
 * Usage: NODE_USE_ENV_PROXY=1 node scripts/fetch-bluetooth-gatt.mjs [--offline]
 *   --offline reparses the archive cached in .cache/bluetooth-gatt.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { createRequire } from "node:module";

const REPO = "https://bitbucket.org/bluetooth-SIG/public";
const API = "https://bitbucket.org/api/2.0/repositories/bluetooth-SIG/public";
const BRANCH = "main";
const CACHE = ".cache/bluetooth-gatt";
const META = join(CACHE, "meta.json");
const OUT = "src/data/bluetoothGatt.ts";
const OFFLINE = process.argv.includes("--offline");
const UA = { "User-Agent": "aifitnessapi-generator (+https://aifitnessapi.com)" };

// js-yaml through gray-matter, a declared dependency, rather than relying on
// whichever copy the dev tooling happens to hoist. gray-matter pins 3.x, whose
// safeLoad is the safe loader (4.x renamed it load).
const requireHere = createRequire(import.meta.url);
const requireYaml = createRequire(requireHere.resolve("gray-matter"));
const jsyaml = requireYaml("js-yaml");
const JSYAML_VERSION = requireYaml("js-yaml/package.json").version;
const loadYaml = (text) => (JSYAML_VERSION.startsWith("3.") ? jsyaml.safeLoad(text) : jsyaml.load(text));

// ── Scope ──────────────────────────────────────────────────────────────────
// An explicit allow-list, chosen by us — not a mapping read from the SIG.
// The repository assigns UUIDs to services and to characteristics in two
// separate lists and publishes one structure file per characteristic, but
// apart from the permitted-characteristics lists under
// assigned_numbers/profiles_and_services (on 2026-10-17: Cookware,
// Environmental Sensing, Industrial Measurement Device and User Data) no file
// says which characteristics a service contains. So the comments below say why
// each id is in scope, and that grouping stays in this file: the generated
// data and the pages group characteristics only by what the SIG's files state.
//
// Services: the device categories fitness and health developers pair — heart
// rate monitors, cycling power and speed/cadence sensors, running sensors,
// fitness machines (treadmills, cross trainers, step and stair climbers,
// rowers, indoor bikes), weight scales, body composition analysers, glucose
// meters and CGMs, blood pressure monitors, pulse oximeters, thermometers —
// plus User Data, the one such service the repository lists characteristics
// for (uds_permitted_characteristics.yaml).
const SCOPE_SERVICES = [
  "heart_rate",
  "cycling_speed_and_cadence",
  "cycling_power",
  "running_speed_and_cadence",
  "fitness_machine",
  "weight_scale",
  "body_composition",
  "user_data",
  "glucose",
  "continuous_glucose_monitoring",
  "blood_pressure",
  "pulse_oximeter",
  "health_thermometer",
].map((s) => `org.bluetooth.service.${s}`);

// Characteristics, in three lists so the reason each is in scope travels with
// it (`scopeReason`): named for one of the device categories above
// ("device"), referenced by one of their structures ("referenced"), or on the
// SIG's User Data list ("user-data"). The device categories in the comments
// are ours and stay here. Every id is included whether or not the repository
// has a gss structure for it; one without a structure is a row, never a page.
const DEVICE_CHARACTERISTICS = [
  // Heart rate monitors
  "heart_rate_measurement", "body_sensor_location", "heart_rate_control_point",
  // Cycling speed and cadence sensors
  "csc_measurement", "csc_feature", "sensor_location", "sc_control_point",
  // Cycling power meters
  "cycling_power_measurement", "cycling_power_vector", "cycling_power_feature", "cycling_power_control_point",
  // Running speed and cadence sensors
  "rsc_measurement", "rsc_feature",
  // Fitness machines
  "fitness_machine_feature", "treadmill_data", "cross_trainer_data", "step_climber_data", "stair_climber_data",
  "rower_data", "indoor_bike_data", "training_status", "supported_speed_range", "supported_inclination_range",
  "supported_resistance_level_range", "supported_heart_rate_range", "supported_power_range",
  "fitness_machine_control_point", "fitness_machine_status",
  // Weight scales and body composition analysers
  "weight_measurement", "weight_scale_feature", "body_composition_measurement", "body_composition_feature",
  // Glucose meters and continuous glucose monitors
  "glucose_measurement", "glucose_measurement_context", "glucose_feature", "record_access_control_point",
  "cgm_measurement", "cgm_feature", "cgm_status", "cgm_session_start_time", "cgm_session_run_time",
  "cgm_specific_ops_control_point",
  // Blood pressure monitors
  "blood_pressure_measurement", "intermediate_cuff_pressure", "blood_pressure_feature",
  "enhanced_blood_pressure_measurement", "enhanced_intermediate_cuff_pressure", "blood_pressure_record",
  // Pulse oximeters
  "plx_spot_check_measurement", "plx_continuous_measurement", "plx_features",
  // Thermometers
  "temperature_measurement", "temperature_type", "intermediate_temperature", "measurement_interval",
].map((s) => `org.bluetooth.characteristic.${s}`);
// Referenced by the structures above (\autoref to another characteristic's
// section), so a reader can follow a Time Stamp to its layout. The generator
// refuses to run if an in-scope structure references one not in scope.
const REFERENCED_CHARACTERISTICS = ["date_time", "time_zone", "dst_offset"].map((s) => `org.bluetooth.characteristic.${s}`);
// User Data: exactly the list in uds_permitted_characteristics.yaml. The
// generator refuses to run if that file lists one this array lacks.
const USER_DATA_CHARACTERISTICS = [
  "activity_goal", "aerobic_heart_rate_lower_limit", "aerobic_heart_rate_upper_limit", "aerobic_threshold", "age",
  "anaerobic_heart_rate_lower_limit", "anaerobic_heart_rate_upper_limit", "anaerobic_threshold", "caloric_intake",
  "date_of_birth", "date_of_threshold_assessment", "device_wearing_position", "email_address",
  "fat_burn_heart_rate_lower_limit", "fat_burn_heart_rate_upper_limit", "first_name", "five_zone_heart_rate_limits",
  "four_zone_heart_rate_limits", "gender", "handedness", "heart_rate_max", "height", "high_intensity_exercise_threshold",
  "high_resolution_height", "hip_circumference", "language", "last_name", "maximum_recommended_heart_rate",
  "middle_name", "preferred_units", "resting_heart_rate", "sedentary_interval_notification",
  "sport_type_for_aerobic_and_anaerobic_thresholds", "stride_length", "three_zone_heart_rate_limits",
  "two_zone_heart_rate_limits", "vo2_max", "waist_circumference", "weight",
].map((s) => `org.bluetooth.characteristic.${s}`);
const SCOPE_CHARACTERISTICS = [...DEVICE_CHARACTERISTICS, ...REFERENCED_CHARACTERISTICS, ...USER_DATA_CHARACTERISTICS];
const scopeReasonOf = (id) =>
  USER_DATA_CHARACTERISTICS.includes(id) ? "user-data" : REFERENCED_CHARACTERISTICS.includes(id) ? "referenced" : "device";

// Floors = the counts of the verified read on 2026-10-17 (main at 408f4a03,
// committed 2026-10-14). The repository-wide totals guard against a truncated
// archive; the scope counts against a parse that drops rows. Raise after a
// verified read; lower only after confirming in the repository that something
// really was removed — never to get a write through.
const EXPECTED_MIN_SERVICE_UUIDS = 76;
const EXPECTED_MIN_CHARACTERISTIC_UUIDS = 512;
const EXPECTED_MIN_UNITS = 127;
const EXPECTED_MIN_GSS_FILES = 278;
const EXPECTED_MIN_WITH_STRUCTURE = 90; // in-scope characteristics with a gss file
const EXPECTED_MIN_PAGES = 44; // in-scope characteristics that pass the thin-page rule
const EXPECTED_MIN_STRUCTURE_FIELDS = 330; // structure fields across the in-scope gss files

const problems = [];

// ── Fetch (or read the cache) ─────────────────────────────────────────────
mkdirSync(CACHE, { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);

async function getJson(url) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { ...UA, Accept: "application/json" } });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function getBuffer(url) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: UA, redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      // A challenge page is HTML, not gzip: refuse it rather than parse it.
      if (buf[0] !== 0x1f || buf[1] !== 0x8b) throw new Error(`not a gzip archive (challenge page?) for ${url}`);
      return buf;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

let commit, commitDate, fetchedOn, repoDescription;
if (OFFLINE) {
  if (!meta.commit) throw new Error(`offline and ${META} records no commit`);
  ({ commit, commitDate, fetchedOn, repoDescription } = meta);
} else {
  const ref = await getJson(`${API}/refs/branches/${BRANCH}`);
  commit = ref?.target?.hash;
  commitDate = String(ref?.target?.date ?? "").slice(0, 10);
  if (!/^[0-9a-f]{40}$/.test(commit ?? "")) throw new Error(`could not read the head of ${BRANCH}`);
  const repo = await getJson(API);
  repoDescription = repo?.description ?? null;
  fetchedOn = today;
}
const archivePath = join(CACHE, `${commit}.tar.gz`);
const archiveUrl = `${REPO}/get/${commit}.tar.gz`;
let archive;
if (existsSync(archivePath)) archive = readFileSync(archivePath);
else if (OFFLINE) throw new Error(`offline and ${archivePath} is not cached`);
else {
  archive = await getBuffer(archiveUrl);
  writeFileSync(archivePath, archive);
}
if (!OFFLINE) {
  writeFileSync(META, JSON.stringify({ commit, commitDate, fetchedOn, repoDescription, archiveUrl }, null, 2));
}

// ── Read the archive in memory ────────────────────────────────────────────
function parsePax(body) {
  const out = {};
  let i = 0;
  const s = body.toString("utf8");
  while (i < s.length) {
    const sp = s.indexOf(" ", i);
    if (sp < 0) break;
    const len = Number(s.slice(i, sp));
    if (!len) break;
    const rec = s.slice(sp + 1, i + len - 1);
    const eq = rec.indexOf("=");
    out[rec.slice(0, eq)] = rec.slice(eq + 1);
    i += len;
  }
  return out;
}

function readTar(gz) {
  const buf = gunzipSync(gz);
  const files = new Map();
  const globalPax = {};
  let pax = {};
  for (let off = 0; off + 512 <= buf.length; ) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    const str = (a, b) => h.subarray(a, b).toString("utf8").replace(/\0[\s\S]*$/, "");
    const size = parseInt(str(124, 136).trim() || "0", 8);
    const type = h[156] ? String.fromCharCode(h[156]) : "0";
    const prefix = str(257, 263).startsWith("ustar") ? str(345, 500) : "";
    const name = prefix ? `${prefix}/${str(0, 100)}` : str(0, 100);
    const body = buf.subarray(off + 512, off + 512 + size);
    off += 512 + Math.ceil(size / 512) * 512;
    if (type === "g") Object.assign(globalPax, parsePax(body));
    else if (type === "x") pax = parsePax(body);
    else if (type === "5") pax = {};
    else if (type === "0") {
      files.set(pax.path ?? name, body.toString("utf8"));
      pax = {};
    } else throw new Error(`unfamiliar tar entry type "${type}" for ${name} — check the archive by hand`);
  }
  return { files, globalPax };
}

const { files: rawFiles, globalPax } = readTar(archive);
if (globalPax.comment !== commit) problems.push(`the archive's pax comment is ${globalPax.comment}, not the commit ${commit}`);
const roots = new Set([...rawFiles.keys()].map((p) => p.split("/")[0]));
if (roots.size !== 1) problems.push(`the archive has ${roots.size} top-level folders, expected 1`);
const [root] = roots;
if (!root?.endsWith(commit.slice(0, 12))) problems.push(`the archive's folder ${root} does not name commit ${commit.slice(0, 12)}`);
/** Repository path → file text. */
const repoFiles = new Map([...rawFiles].map(([p, t]) => [p.slice(root.length + 1), t]));
const fileText = (path) => {
  const t = repoFiles.get(path);
  if (t === undefined) throw new Error(`${path} is not in the archive for ${commit}`);
  return t;
};

// ── The notice every file carries ─────────────────────────────────────────
const noticeOf = (text) => {
  const lines = [];
  for (const l of text.split("\n")) {
    if (!l.startsWith("#")) break;
    lines.push(l.replace(/^# ?/, ""));
  }
  return lines.join("\n").trim();
};
const filesRead = new Set();
const read = (path) => {
  filesRead.add(path);
  return fileText(path);
};

// ── Assigned numbers ──────────────────────────────────────────────────────
const hex4 = (n) => `0x${n.toString(16).toUpperCase().padStart(4, "0")}`;

/** A uuids: list, with every UUID checked against the literal in the text. */
function uuidList(path) {
  const text = read(path);
  const doc = loadYaml(text);
  const list = doc?.uuids;
  if (!Array.isArray(list)) {
    problems.push(`${path}: no uuids list`);
    return [];
  }
  const literals = new Set([...text.matchAll(/^\s*-\s*uuid:\s*(0x[0-9A-Fa-f]{4})\s*$/gm)].map((m) => hex4(parseInt(m[1], 16))));
  const rows = [];
  for (const u of list) {
    if (typeof u.uuid !== "number" || typeof u.name !== "string" || typeof u.id !== "string") {
      problems.push(`${path}: an entry did not parse as uuid/name/id: ${JSON.stringify(u)}`);
      continue;
    }
    rows.push({ uuid: hex4(u.uuid), name: u.name, id: u.id });
  }
  const parsed = new Set(rows.map((r) => r.uuid));
  if (parsed.size !== literals.size || [...literals].some((l) => !parsed.has(l))) {
    problems.push(`${path}: the parsed UUIDs (${parsed.size}) do not match the 0x literals in the file (${literals.size})`);
  }
  return rows;
}

const SERVICE_UUIDS = "assigned_numbers/uuids/service_uuids.yaml";
const CHARACTERISTIC_UUIDS = "assigned_numbers/uuids/characteristic_uuids.yaml";
const UNITS = "assigned_numbers/uuids/units.yaml";
const services = uuidList(SERVICE_UUIDS);
const characteristics = uuidList(CHARACTERISTIC_UUIDS);
const units = uuidList(UNITS);
const unitName = new Map(units.map((u) => [u.id, u.name]));
const serviceById = new Map(services.map((s) => [s.id, s]));
const characteristicById = new Map(characteristics.map((c) => [c.id, c]));

// Permitted-characteristics files: discovered, not listed by hand, so a new
// one is read the day it appears.
const permitted = [];
for (const path of [...repoFiles.keys()].sort()) {
  if (!/^assigned_numbers\/profiles_and_services\/[^/]+\/[^/]+_permitted_characteristics\.yaml$/.test(path)) continue;
  const doc = loadYaml(read(path));
  for (const block of doc?.permitted_characteristics ?? []) {
    if (typeof block?.service !== "string" || !Array.isArray(block?.characteristics)) {
      problems.push(`${path}: a block did not parse as service + characteristics`);
      continue;
    }
    permitted.push({ path, service: block.service, characteristics: block.characteristics.map(String) });
  }
}
if (!permitted.length) problems.push("no *_permitted_characteristics.yaml file found");

// ── GATT Specification Supplement files ────────────────────────────────────
const gssPaths = [...repoFiles.keys()].filter((p) => /^gss\/[^/]+\.yaml$/.test(p)).sort();
/** characteristic id → { path, doc } — keyed by the identifier inside the file, since a few filenames differ from it. */
const gssById = new Map();
for (const path of gssPaths) {
  const doc = loadYaml(read(path));
  const id = doc?.characteristic?.identifier;
  if (typeof id !== "string") {
    problems.push(`${path}: no characteristic.identifier`);
    continue;
  }
  if (gssById.has(id)) problems.push(`${id} is defined by two gss files`);
  gssById.set(id, { path, doc: doc.characteristic });
}

// Every file read must carry the same notice.
const notices = new Map();
for (const p of filesRead) {
  const n = noticeOf(repoFiles.get(p));
  notices.set(n, [...(notices.get(n) ?? []), p]);
}
if (notices.size !== 1) {
  problems.push(`the files read carry ${notices.size} different notices — review the terms before publishing: ${[...notices.values()].map((v) => v[0]).join(", ")}`);
}
const [TERMS] = notices.keys();
// The generated header quotes the notice; each quoted phrase must still be in it.
const flatTerms = String(TERMS ?? "").replace(/\s+/g, " ");
const COPYRIGHT_LINE = /Copyright ©[^.]*?Bluetooth SIG, Inc\./.exec(flatTerms)?.[0] ?? null;
const QUOTED_TERMS = [
  "This document is proprietary to Bluetooth SIG.",
  "The furnishing of this document does not grant any license to any intellectual property of Bluetooth SIG or its members.",
  "This document is subject to change without notice.",
];
if (!COPYRIGHT_LINE) problems.push("the notice no longer carries a Bluetooth SIG copyright line — review the terms");
for (const q of QUOTED_TERMS) if (!flatTerms.includes(q)) problems.push(`the notice no longer says "${q}" — review the terms and the generated header`);

// ── Text helpers ──────────────────────────────────────────────────────────
/** Every LaTeX-style macro the renderer knows. Anything else stops the run, so new markup is handled on purpose. */
const KNOWN_MACROS = new Set(["autoref", "RefRef", "textellipsis", "textsubscript", "newpage"]);
const slugOf = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
/** The key an \autoref{sec:<id>/field/<key>} uses for a `fields` entry: its name, lowercased, spaces and
 *  slashes to underscores, hyphens and parentheses kept ("RR-Interval" → rr-interval, "Cal/Temp" → cal_temp,
 *  "… Value (mmHg)" → …_value_(mmhg)), as every key in the 2026-10-17 files reads. A key that matches no
 *  entry is recorded in unresolvedRefs and shown as text — never matched loosely. */
const defKey = (name) => name.toLowerCase().replace(/[ /]/g, "_");
const UNIT_RE = /org\.bluetooth\.(?:unitless|unit\.[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)/g;
const PRESENT_RE = /^Present if bit (\d+) of (?:the )?(.+?) field is set to ([01])\.?$/;

/** Every string value inside a parsed YAML node, depth first. */
function stringsOf(node, out = []) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => stringsOf(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => stringsOf(n, out));
  return out;
}

function checkMacros(where, node) {
  for (const s of stringsOf(node)) {
    for (const m of s.matchAll(/\\([A-Za-z]+)/g)) {
      if (!KNOWN_MACROS.has(m[1])) problems.push(`${where}: unknown macro \\${m[1]} — teach the renderer (src/data/btPages.ts) and this list`);
    }
  }
}

/** Unit ids named in a description, each with the line it was read from. */
function unitsIn(description) {
  const lines = String(description).split("\n").map((l) => l.trim());
  const out = [];
  lines.forEach((line, i) => {
    for (const m of line.matchAll(UNIT_RE)) {
      const id = m[0];
      if (out.some((u) => u.id === id)) continue;
      // "Unit:" on its own line with the id on the next: keep both as the evidence.
      const evidence = line === id && i > 0 && /:\s*$/.test(lines[i - 1]) ? `${lines[i - 1]} ${line}` : line;
      out.push({ id, name: unitName.get(id) ?? null, evidence });
    }
  });
  return out;
}

/** The "Present if …" lines of a description, and the condition when one line states a flag bit. */
function presenceIn(description) {
  const lines = String(description).split("\n").map((l) => l.trim()).filter((l) => /^Present if\b/.test(l));
  const text = lines.length ? lines.join(" ") : null;
  let parsed = null;
  if (lines.length === 1) {
    const m = PRESENT_RE.exec(lines[0]);
    if (m) parsed = { bit: Number(m[1]), field: m[2], value: Number(m[3]), evidence: lines[0] };
  }
  return { text, parsed };
}

/** Size string → fixed / optional ("0 or N") / variable, with the number of units where it is a plain number. */
function sizeOf(size) {
  const s = String(size).trim();
  if (/^\d+$/.test(s)) return { kind: "fixed", n: Number(s) };
  const opt = /^0 or (\d+)$/.exec(s);
  if (opt) return { kind: "optional", n: Number(opt[1]) };
  return { kind: "variable", n: null };
}

/** Offsets for a run of fields: a number only where every earlier size is a plain number. */
function withOffsets(fields) {
  let offset = 0;
  const varying = [];
  return fields.map((f) => {
    const out = { ...f, offset: varying.length ? null : offset, offsetVariesWith: [...varying] };
    if (f.sizeKind === "fixed" && varying.length === 0) offset += f.sizeN;
    else if (f.sizeKind !== "fixed") varying.push(f.name);
    return out;
  });
}

/** \autoref targets anywhere in a node: { charId, part: "field"|"subfield"|null, key } or a non-characteristic section. */
function refsIn(node) {
  const out = [];
  for (const s of stringsOf(node)) {
    for (const m of s.matchAll(/\\autoref\{sec:([^}]+)\}/g)) {
      const [head, part, key] = m[1].split("/");
      out.push(head.startsWith("org.bluetooth.characteristic.") ? { target: m[1], charId: head, part: part ?? null, key: key ?? null } : { target: m[1], charId: null, part: null, key: null });
    }
  }
  return out;
}

const asString = (where, v) => {
  if (typeof v === "string") return v;
  problems.push(`${where}: expected a string, got ${JSON.stringify(v)}`);
  return String(v ?? "");
};

/** One `fields` entry (and its nested subfields) as published, with a computed layout where it is a struct. */
function definitionOf(where, d) {
  const name = asString(`${where} name`, d.name);
  const rows = (d.values ?? []).map((row, i) => {
    const out = {};
    for (const [k, v] of Object.entries(row)) out[k] = asString(`${where} "${name}" row ${i} ${k}`, v);
    return out;
  });
  const columns = [];
  for (const r of rows) for (const k of Object.keys(r)) if (!columns.includes(k)) columns.push(k);
  for (const k of Object.keys(d)) {
    if (!["name", "description", "values", "subfields", "section_title", "table_caption", "value_header", "description_header", "size_in_bits"].includes(k)) {
      problems.push(`${where} "${name}": unfamiliar key "${k}" — extend the generator and the page`);
    }
  }
  const all = (k) => rows.length > 0 && rows.every((r) => k in r);
  const kind = all("bit") ? "bits" : all("field") && all("data_type") && all("size") ? "struct" : all("value") ? "values" : "table";
  const sizeInBits = d.size_in_bits === true;
  let layout = null;
  if (kind === "struct") {
    layout = withOffsets(
      rows.map((r) => {
        const sz = sizeOf(r.size);
        const presence = presenceIn(r.description ?? "");
        return {
          name: r.field,
          anchor: `def-${slugOf(name)}--${slugOf(r.field)}`,
          type: r.data_type,
          size: r.size,
          sizeKind: sz.kind,
          sizeN: sz.n,
          units: unitsIn(r.description ?? ""),
          presenceText: presence.text,
          presence: presence.parsed,
        };
      }),
    );
  }
  return {
    name,
    key: defKey(name),
    anchor: `def-${slugOf(name)}`,
    description: d.description == null ? null : asString(`${where} "${name}" description`, d.description),
    sectionTitle: d.section_title ?? null,
    tableCaption: d.table_caption ?? null,
    valueHeader: d.value_header ?? null,
    descriptionHeader: d.description_header ?? null,
    sizeInBits,
    kind,
    columns,
    rows,
    layout,
    subfields: (d.subfields ?? []).map((s) => definitionOf(`${where} "${name}" subfield`, s)),
  };
}

// ── Scope checks ──────────────────────────────────────────────────────────
for (const id of SCOPE_SERVICES) if (!serviceById.has(id)) problems.push(`scope service ${id} is not in ${SERVICE_UUIDS}`);
for (const id of SCOPE_CHARACTERISTICS) if (!characteristicById.has(id)) problems.push(`scope characteristic ${id} is not in ${CHARACTERISTIC_UUIDS}`);
if (new Set(SCOPE_CHARACTERISTICS).size !== SCOPE_CHARACTERISTICS.length) problems.push("a characteristic is listed twice in SCOPE_CHARACTERISTICS");
for (const p of permitted) {
  if (!SCOPE_SERVICES.includes(p.service)) continue;
  for (const c of p.characteristics) {
    if (!SCOPE_CHARACTERISTICS.includes(c)) problems.push(`${p.path} lists ${c} under in-scope ${p.service}, but SCOPE_CHARACTERISTICS lacks it — add it`);
  }
}
// USER_DATA_CHARACTERISTICS is exactly the SIG's User Data list, both ways.
{
  const uds = permitted.find((p) => p.service === "org.bluetooth.service.user_data");
  if (!uds) problems.push("no permitted-characteristics list for org.bluetooth.service.user_data");
  else {
    for (const c of uds.characteristics) if (!USER_DATA_CHARACTERISTICS.includes(c)) problems.push(`the User Data list names ${c}; add it to USER_DATA_CHARACTERISTICS`);
    for (const c of USER_DATA_CHARACTERISTICS) if (!uds.characteristics.includes(c)) problems.push(`USER_DATA_CHARACTERISTICS has ${c}, which the User Data list no longer names`);
  }
}

// ── Build the in-scope records ────────────────────────────────────────────
const inScope = new Set(SCOPE_CHARACTERISTICS);
const records = [];
for (const id of SCOPE_CHARACTERISTICS) {
  const base = characteristicById.get(id);
  if (!base) continue;
  const slug = id.replace("org.bluetooth.characteristic.", "").replace(/_/g, "-");
  const servicesStated = permitted
    .filter((p) => p.characteristics.includes(id))
    .map((p) => {
      const s = serviceById.get(p.service);
      return { id: p.service, name: s?.name ?? null, uuid: s?.uuid ?? null, source: p.path };
    });
  const g = gssById.get(id);
  let gss = null;
  if (g) {
    const c = g.doc;
    const where = g.path;
    if (c.name !== base.name) problems.push(`${id}: gss name "${c.name}" differs from ${CHARACTERISTIC_UUIDS} "${base.name}"`);
    for (const k of Object.keys(c)) {
      if (!["identifier", "name", "description", "structure", "fields", "size_in_bits"].includes(k)) problems.push(`${where}: unfamiliar key "${k}"`);
    }
    checkMacros(where, c);
    const definitions = (c.fields ?? []).map((d) => definitionOf(where, d));
    const structure = withOffsets(
      (c.structure ?? []).map((s, i) => {
        const fw = `${where} structure[${i}]`;
        const name = asString(`${fw} field`, s.field);
        const description = asString(`${fw} description`, s.description ?? "");
        const sz = sizeOf(asString(`${fw} size`, s.size));
        const presence = presenceIn(description);
        return {
          name,
          anchor: `field-${slugOf(name)}`,
          type: asString(`${fw} type`, s.type),
          size: String(s.size),
          sizeKind: sz.kind,
          sizeN: sz.n,
          description,
          units: unitsIn(description),
          presenceText: presence.text,
          presence: presence.parsed,
        };
      }),
    );
    if (!structure.length) problems.push(`${where}: empty structure`);
    if (new Set(structure.map((f) => f.anchor)).size !== structure.length) problems.push(`${where}: two structure fields share an anchor`);
    // Same-file references must resolve to a `fields` entry (or a nested
    // subfield); a miss is recorded and shown as plain text, not guessed.
    const keys = new Set();
    const collect = (defs) => defs.forEach((d) => (keys.add(d.key), collect(d.subfields)));
    collect(definitions);
    const unresolved = [];
    for (const r of refsIn(c)) {
      if (r.charId === id && r.key && !keys.has(r.key)) unresolved.push(r.target);
    }
    // A flags field: a boolean[…] field named "Flags" (or "… Flags") in the
    // structure or in a struct the structure defines.
    const isFlags = (name, type) => /^boolean\[\d+\]/.test(type) && /(^|\s)flags$/i.test(name);
    const flagsFields = [
      ...structure.filter((f) => isFlags(f.name, f.type)).map((f) => f.name),
      ...definitions.filter((d) => d.layout).flatMap((d) => d.layout.filter((f) => isFlags(f.name, f.type)).map((f) => `${d.name} › ${f.name}`)),
    ];
    gss = {
      file: g.path,
      description: asString(`${where} description`, c.description ?? ""),
      structure,
      definitions,
      flagsFields,
      unresolvedRefs: [...new Set(unresolved)],
    };
  }
  const pageReason = !gss ? null : gss.structure.length >= 2 ? "fields" : gss.flagsFields.length ? "flags" : null;
  records.push({ id, uuid: base.uuid, name: base.name, slug, scopeReason: scopeReasonOf(id), services: servicesStated, referencedBy: [], hasPage: pageReason !== null, pageReason, gss });
}

// Who references whom, and the closure check: every characteristic an
// in-scope structure points at must itself be in scope.
const defKeysOf = (rec) => {
  const keys = new Set();
  const collect = (defs) => defs.forEach((d) => (keys.add(d.key), collect(d.subfields)));
  collect(rec?.gss?.definitions ?? []);
  return keys;
};
for (const r of records) {
  if (!r.gss) continue;
  for (const ref of refsIn(gssById.get(r.id).doc)) {
    if (!ref.charId || ref.charId === r.id) continue;
    if (!inScope.has(ref.charId)) {
      problems.push(`${r.id} references ${ref.charId}, which is not in SCOPE_CHARACTERISTICS — add it`);
      continue;
    }
    const target = records.find((x) => x.id === ref.charId);
    if (target && !target.referencedBy.includes(r.id)) target.referencedBy.push(r.id);
    // A reference into another characteristic's definitions must land too.
    if (target && ref.key && !defKeysOf(target).has(ref.key) && !r.gss.unresolvedRefs.includes(ref.target)) r.gss.unresolvedRefs.push(ref.target);
  }
}

const scopeServices = SCOPE_SERVICES.map((id) => serviceById.get(id))
  .filter(Boolean)
  .map((s) => {
    const p = permitted.find((x) => x.service === s.id);
    return { ...s, permittedCharacteristics: p ? p.characteristics : null, permittedSource: p ? p.path : null };
  })
  .sort((a, b) => a.uuid.localeCompare(b.uuid));
records.sort((a, b) => a.uuid.localeCompare(b.uuid));

// ── Integrity gates ───────────────────────────────────────────────────────
const withStructure = records.filter((r) => r.gss);
const pages = records.filter((r) => r.hasPage);
const fieldCount = withStructure.reduce((n, r) => n + r.gss.structure.length, 0);
if (services.length < EXPECTED_MIN_SERVICE_UUIDS) problems.push(`only ${services.length} service UUIDs parsed (expected >= ${EXPECTED_MIN_SERVICE_UUIDS})`);
if (characteristics.length < EXPECTED_MIN_CHARACTERISTIC_UUIDS) problems.push(`only ${characteristics.length} characteristic UUIDs parsed (expected >= ${EXPECTED_MIN_CHARACTERISTIC_UUIDS})`);
if (units.length < EXPECTED_MIN_UNITS) problems.push(`only ${units.length} units parsed (expected >= ${EXPECTED_MIN_UNITS})`);
if (gssById.size < EXPECTED_MIN_GSS_FILES) problems.push(`only ${gssById.size} gss files parsed (expected >= ${EXPECTED_MIN_GSS_FILES})`);
if (scopeServices.length !== SCOPE_SERVICES.length) problems.push(`${scopeServices.length} of ${SCOPE_SERVICES.length} scope services resolved`);
if (records.length !== SCOPE_CHARACTERISTICS.length) problems.push(`${records.length} of ${SCOPE_CHARACTERISTICS.length} scope characteristics resolved`);
if (withStructure.length < EXPECTED_MIN_WITH_STRUCTURE) problems.push(`only ${withStructure.length} in-scope characteristics have a gss structure (expected >= ${EXPECTED_MIN_WITH_STRUCTURE})`);
if (pages.length < EXPECTED_MIN_PAGES) problems.push(`only ${pages.length} characteristics pass the thin-page rule (expected >= ${EXPECTED_MIN_PAGES})`);
if (fieldCount < EXPECTED_MIN_STRUCTURE_FIELDS) problems.push(`only ${fieldCount} structure fields parsed (expected >= ${EXPECTED_MIN_STRUCTURE_FIELDS})`);
if (new Set(records.map((r) => r.slug)).size !== records.length) problems.push("two characteristics share a slug");
// Evidence must be the source's own words (whitespace aside).
const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const checkEvidence = (where, f, description) => {
  for (const u of f.units) {
    if (!u.evidence.includes(u.id) || !norm(description).includes(norm(u.evidence))) problems.push(`${where} ${f.name}: unit ${u.id} without its line`);
  }
  if (f.presence && !String(description).split("\n").map((l) => l.trim()).includes(f.presence.evidence)) problems.push(`${where} ${f.name}: presence without its line`);
};
const checkDefs = (where, defs) =>
  defs.forEach((d) => {
    (d.layout ?? []).forEach((f, i) => checkEvidence(`${where} ${d.name}`, f, d.rows[i].description ?? ""));
    checkDefs(where, d.subfields);
  });
for (const r of withStructure) {
  for (const f of r.gss.structure) checkEvidence(r.id, f, f.description);
  checkDefs(r.id, r.gss.definitions);
  // One page, one set of ids: structure rows, definitions and struct rows.
  const anchors = [];
  const walk = (defs) => defs.forEach((d) => (anchors.push(d.anchor, ...(d.layout ?? []).map((f) => f.anchor)), walk(d.subfields)));
  anchors.push(...r.gss.structure.map((f) => f.anchor));
  walk(r.gss.definitions);
  const dupes = anchors.filter((a, i) => anchors.indexOf(a) !== i);
  if (dupes.length) problems.push(`${r.id}: duplicate anchors ${[...new Set(dupes)].join(", ")}`);
}
if (problems.length) {
  console.error("REFUSING TO WRITE — the repository's shape may have changed:");
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

// ── Write ─────────────────────────────────────────────────────────────────
// The derived helpers above carry sizeN for the arithmetic; the published
// record keeps it, since the byte-layout table prints it.
const sources = {
  repository: REPO,
  branch: BRANCH,
  commit,
  commitDate,
  archive: archiveUrl,
  description: repoDescription,
  files: { serviceUuids: SERVICE_UUIDS, characteristicUuids: CHARACTERISTIC_UUIDS, units: UNITS, gssFolder: "gss/" },
};
const totals = {
  serviceUuids: services.length,
  characteristicUuids: characteristics.length,
  units: units.length,
  gssFiles: gssById.size,
  permittedFiles: [...new Set(permitted.map((p) => p.path))].length,
  filesRead: filesRead.size,
};
const unresolvedAll = withStructure.flatMap((r) => r.gss.unresolvedRefs.map((t) => `${r.id}: ${t}`));
/** Every permitted-characteristics list in the repository, in or out of scope. */
const permittedLists = permitted.map((p) => {
  const s = serviceById.get(p.service);
  return { service: p.service, name: s?.name ?? null, uuid: s?.uuid ?? null, characteristics: p.characteristics.length, source: p.path };
});

const body = `/**
 * Bluetooth GATT services and characteristics for fitness and health devices,
 * with each characteristic's structure as the Bluetooth SIG's GATT
 * Specification Supplement (gss) YAML publishes it.
 *
 * GENERATED — do not hand-edit; regenerate with NODE_USE_ENV_PROXY=1 node scripts/fetch-bluetooth-gatt.mjs
 *
 * Source: ${REPO} (branch ${BRANCH})
 *   commit ${commit} (committed ${commitDate}), read as ${archiveUrl}
 *   ${SERVICE_UUIDS}, ${CHARACTERISTIC_UUIDS}, ${UNITS},
 *   assigned_numbers/profiles_and_services/<x>/<x>_permitted_characteristics.yaml, gss/*.yaml
 * Fetched: ${fetchedOn}
 *
 * Terms. The repository has no README or licence file. Every file read
 * (${filesRead.size}) carries the same notice, kept verbatim in BT_GATT_TERMS. It says:
${QUOTED_TERMS.map((q) => ` *   "${q}"`).join("\n")}
 *   "${COPYRIGHT_LINE}"
 * So the SIG's text is quoted on the pages with that attribution, and this
 * site does not relicense it. This site is not affiliated with Bluetooth SIG.
 *
 * Scope is an allow-list in the generator, not a mapping: no file in the
 * repository says which characteristics a service contains, except the
 * permitted-characteristics lists, so \`services\` is set only from those.
 * Derived values keep their evidence: each unit carries the line it was read
 * from, each parsed presence condition its "Present if" line, and an offset is
 * a number only where every earlier size is a plain number.
 */

/** The date the generator last read the repository. */
export const BT_GATT_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** Where this file was read from: repository, branch, the commit at its head, and the archive. */
export const BT_GATT_SOURCE = ${JSON.stringify(sources, null, 2)} as const;

/** The notice at the top of every file read (all ${filesRead.size} identical), verbatim. */
export const BT_GATT_TERMS = ${JSON.stringify(TERMS)};

/** Totals across the whole repository at this commit, for context. */
export const BT_GATT_TOTALS = ${JSON.stringify(totals, null, 2)};

/** The js-yaml version the files were parsed with. */
export const BT_GATT_PARSER = ${JSON.stringify(`js-yaml ${JSYAML_VERSION}`)};

/** Every permitted-characteristics list in the repository — the only files that tie characteristics to a service. */
export const BT_GATT_PERMITTED_LISTS: { service: string; name: string | null; uuid: string | null; characteristics: number; source: string }[] = ${JSON.stringify(permittedLists, null, 2)};

export type BtUnit = {
  /** The unit id as the gss text writes it, e.g. "org.bluetooth.unit.period.beats_per_minute". */
  id: string;
  /** units.yaml's name for exactly that id; null where units.yaml has no such id. */
  name: string | null;
  /** The line of the description the id was read from. */
  evidence: string;
};

export type BtPresence = {
  bit: number;
  /** The flags field the line names, e.g. "Flags". */
  field: string;
  value: number;
  /** The "Present if bit N of … field is set to V" line, verbatim. */
  evidence: string;
};

export type BtField = {
  name: string;
  /** The row id on the characteristic's page (structure fields and struct rows). */
  anchor: string;
  /** The gss type (structure) or data_type (struct rows), verbatim. */
  type: string;
  /** The size as published, verbatim: "1", "0 or 2", "variable", "0–18"… (octets, or bits where the struct says size_in_bits). */
  size: string;
  /** "fixed" for a plain number, "optional" for "0 or N", "variable" for anything else. */
  sizeKind: "fixed" | "optional" | "variable";
  /** N for a fixed or "0 or N" size; null otherwise. */
  sizeN: number | null;
  /** Present on structure fields: the gss description, verbatim (macros such as \\autoref kept). */
  description?: string;
  units: BtUnit[];
  /** Every "Present if …" line, verbatim; null where there is none. */
  presenceText: string | null;
  /** The condition, parsed only when it is one "Present if bit N of … field is set to V" line. */
  presence: BtPresence | null;
  /** Offset from the start of the value (structure) or of the struct (struct rows); null where an earlier size is not a plain number. */
  offset: number | null;
  /** The earlier fields whose size is "0 or N" or variable, when offset is null. */
  offsetVariesWith: string[];
};

export type BtDefinition = {
  /** The \`fields\` entry's name, verbatim. */
  name: string;
  /** The key an \\autoref{sec:<id>/field/<key>} uses for it. */
  key: string;
  /** The row id on the characteristic's page. */
  anchor: string;
  description: string | null;
  sectionTitle: string | null;
  tableCaption: string | null;
  valueHeader: string | null;
  descriptionHeader: string | null;
  sizeInBits: boolean;
  /** "bits" (a flags-style table), "struct" (field/data_type/size rows), "values" (value tables) or "table" (op codes and the like). */
  kind: "bits" | "struct" | "values" | "table";
  /** The keys used across its rows, in first-seen order. */
  columns: string[];
  /** Its rows, every value verbatim. */
  rows: Record<string, string>[];
  /** For a struct: its rows with sizes, offsets, units and presence computed as for a structure. */
  layout: BtField[] | null;
  subfields: BtDefinition[];
};

export type BtCharacteristic = {
  /** e.g. "org.bluetooth.characteristic.heart_rate_measurement". */
  id: string;
  /** The 16-bit UUID as characteristic_uuids.yaml writes it, e.g. "0x2A37". */
  uuid: string;
  name: string;
  /** The page slug: the id's last part with hyphens. */
  slug: string;
  /** Why it is in scope: chosen for a device category, referenced by an in-scope structure, or on the SIG's User Data list. */
  scopeReason: "device" | "referenced" | "user-data";
  /** Services a permitted-characteristics file lists it under; empty where no file does. */
  services: { id: string; name: string | null; uuid: string | null; source: string }[];
  /** In-scope characteristics whose gss text references this one. */
  referencedBy: string[];
  /** Thin-page rule: a page only with a structure of at least two fields, or a flags field. */
  hasPage: boolean;
  pageReason: "fields" | "flags" | null;
  /** The gss structure; null where the repository has no gss file for this characteristic. */
  gss: {
    file: string;
    description: string;
    structure: BtField[];
    definitions: BtDefinition[];
    /** Flags fields found, as "Field" or "Struct › Field". */
    flagsFields: string[];
    /** Same-file \\autoref targets that match no \`fields\` entry, shown as text. */
    unresolvedRefs: string[];
  } | null;
};

export type BtService = {
  uuid: string;
  name: string;
  id: string;
  /** The characteristics a permitted-characteristics file lists for it; null where no such file exists. */
  permittedCharacteristics: string[] | null;
  permittedSource: string | null;
};

/** The in-scope services, in UUID order. */
export const BT_SERVICES: BtService[] = ${JSON.stringify(scopeServices, null, 2)};

/** The in-scope characteristics, in UUID order. */
export const BT_CHARACTERISTICS: BtCharacteristic[] = ${JSON.stringify(records, null, 2)};
`;
writeFileSync(OUT, body);
console.log(
  `wrote ${OUT}: ${scopeServices.length} services, ${records.length} characteristics (${withStructure.length} with a gss structure, ${pages.length} with a page, ${records.length - withStructure.length} without a structure), ${fieldCount} structure fields`,
);
console.log(`  commit ${commit} (${commitDate}); ${totals.filesRead} files read; repository totals: ${services.length} service UUIDs, ${characteristics.length} characteristic UUIDs, ${gssById.size} gss files`);
console.log(`  without a structure: ${records.filter((r) => !r.gss).map((r) => r.name).join(", ") || "none"}`);
if (unresolvedAll.length) console.log(`  references shown as text (no matching fields entry):\n    ${unresolvedAll.join("\n    ")}`);
