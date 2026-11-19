#!/usr/bin/env node
/**
 * Regenerate src/data/poseModelFiles.ts — the MediaPipe Pose Landmarker
 * `.task` files as Google's storage bucket serves them, measured by
 * downloading every byte:
 *
 *   NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-model-files.mjs
 *
 * Six files: lite, full and heavy, each on the `latest` path and on the
 * versioned `/1/` path. Both path shapes are Google's own: the `latest` URLs
 * are the ones in the mediapipe-samples iOS download script, the `/1/` URLs
 * the ones the Android sample's download_tasks.gradle.kts and the
 * @mediapipe/tasks-vision README use (see the sources list on
 * /motion/mediapipe-pose-landmarker-models and src/lib/poseBenchmark.ts).
 *
 * No model, no guess. Every field is either copied from the HTTP response or
 * computed from the downloaded bytes:
 *   bytes          — the length of the body actually received (and it must
 *                    equal Content-Length when the server sends one)
 *   sha256         — SHA-256 of those bytes, hex
 *   md5            — MD5 of those bytes, hex, checked against the md5 the
 *                    bucket states in its x-goog-hash header when it sends one
 *   lastModified   — the Last-Modified header, verbatim, or null if absent
 *   etag           — the ETag header, verbatim, or null if absent
 *   contentType    — the Content-Type header, verbatim, or null if absent
 *   members        — the bundle's zip members (name, uncompressed size,
 *                    CRC-32, SHA-256, stored modification time), read from
 *                    the zip central directory; each CRC-32 is recomputed
 *                    from the member's bytes and must match, and the SHA-256
 *                    is computed from the same bytes
 * Three fields are derived, and from measured values only:
 *   identicalToV1  — per variant, whether the `latest` file's SHA-256 equals
 *                    the `/1/` file's;
 *   differingBytes — how many byte positions differ (null if lengths differ);
 *   sameMembers    — both list the same members, in order, with the same
 *                    SHA-256 (the zip timestamps are not compared).
 *
 * House rule: a short run fails. Any download that is not HTTP 200, a body
 * that does not match its Content-Length or its stated md5, or fewer than
 * EXPECTED rows exits non-zero before anything is written.
 *
 * Nothing is cached: the point of the file is what the bucket serves today.
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { crc32, inflateRawSync } from "node:zlib";

const OUT = "src/data/poseModelFiles.ts";
const BASE = "https://storage.googleapis.com/mediapipe-models/pose_landmarker";
const VARIANTS = ["lite", "full", "heavy"];
const VERSIONS = ["latest", "1"];
const EXPECTED = VARIANTS.length * VERSIONS.length;

const urlFor = (variant, version) =>
  `${BASE}/pose_landmarker_${variant}/float16/${version}/pose_landmarker_${variant}.task`;

/**
 * The members of a .task bundle, read from its zip central directory. Each
 * member's CRC-32 is recomputed from its bytes (inflated first if deflated)
 * and must equal the directory's, so `crc32` is measured, not just copied.
 * `modified` is the stored DOS date-time, which has no time zone, written as
 * it is stored.
 */
function zipMembers(buf, url) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error(`${url}: no zip end-of-central-directory record`);
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const members = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error(`${url}: bad central directory entry ${n}`);
    const method = buf.readUInt16LE(p + 10);
    const time = buf.readUInt16LE(p + 12);
    const date = buf.readUInt16LE(p + 14);
    const crc = buf.readUInt32LE(p + 16);
    const csize = buf.readUInt32LE(p + 20);
    const usize = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString("utf8");
    p += 46 + nameLen + extraLen + commentLen;
    if (buf.readUInt32LE(local) !== 0x04034b50) throw new Error(`${url}: bad local header for ${name}`);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + csize);
    const data = method === 0 ? raw : method === 8 ? inflateRawSync(raw) : null;
    if (!data) throw new Error(`${url}: ${name} uses zip method ${method}, which this script does not read`);
    if (data.length !== usize) throw new Error(`${url}: ${name} is ${data.length} bytes, directory says ${usize}`);
    const crcHex = (crc32(data) >>> 0).toString(16).padStart(8, "0");
    if (crcHex !== crc.toString(16).padStart(8, "0")) throw new Error(`${url}: ${name} CRC-32 ${crcHex} does not match the directory`);
    const pad = (x) => String(x).padStart(2, "0");
    const modified = `${1980 + (date >> 9)}-${pad((date >> 5) & 15)}-${pad(date & 31)} ${pad(time >> 11)}:${pad((time >> 5) & 63)}:${pad((time & 31) * 2)}`;
    members.push({ name, bytes: usize, crc32: crcHex, sha256: createHash("sha256").update(data).digest("hex"), modified });
  }
  if (members.length === 0) throw new Error(`${url}: the bundle lists no members`);
  return members;
}

/** The md5 GCS states for the object, from `x-goog-hash: crc32c=…,md5=…` (base64). */
function statedMd5(header) {
  if (!header) return null;
  const m = /(?:^|,)\s*md5=([^,]+)/.exec(header);
  return m ? Buffer.from(m[1].trim(), "base64").toString("hex") : null;
}

async function measure(variant, version) {
  const url = urlFor(variant, version);
  const res = await fetch(url);
  if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const h = res.headers;
  const declared = h.get("content-length");
  if (declared !== null && Number(declared) !== buf.length) {
    throw new Error(`${url}: received ${buf.length} bytes, Content-Length says ${declared}`);
  }
  if (buf.length === 0) throw new Error(`${url}: empty body`);
  const sha256 = createHash("sha256").update(buf).digest("hex");
  const md5 = createHash("md5").update(buf).digest("hex");
  const stated = statedMd5(h.get("x-goog-hash"));
  if (stated && stated !== md5) throw new Error(`${url}: md5 ${md5} does not match the bucket's x-goog-hash md5 ${stated}`);
  return {
    row: {
      variant,
      version,
      url,
      bytes: buf.length,
      sha256,
      md5,
      md5MatchesServer: stated ? true : null,
      lastModified: h.get("last-modified"),
      etag: h.get("etag"),
      contentType: h.get("content-type"),
      members: zipMembers(buf, url),
    },
    buf,
  };
}

/** Bytes at which two equal-length buffers differ; null when the lengths differ. */
function differingBytes(a, b) {
  if (a.length !== b.length) return null;
  let n = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++;
  return n;
}

const sameMembers = (a, b) =>
  a.members.length === b.members.length &&
  a.members.every((m, i) => m.name === b.members[i].name && m.bytes === b.members[i].bytes && m.sha256 === b.members[i].sha256);

const rows = [];
const bodies = new Map();
for (const variant of VARIANTS) {
  for (const version of VERSIONS) {
    const { row, buf } = await measure(variant, version);
    rows.push(row);
    bodies.set(row.url, buf);
    console.log(`  ${variant.padEnd(5)} ${version.padEnd(6)} ${String(row.bytes).padStart(9)} B  sha256 ${row.sha256}  ${row.members.length} members`);
  }
}
if (rows.length < EXPECTED) {
  console.error(`✗ ${rows.length} files measured, expected ${EXPECTED}; nothing written.`);
  process.exit(1);
}

const variants = VARIANTS.map((variant) => {
  const latest = rows.find((r) => r.variant === variant && r.version === "latest");
  const v1 = rows.find((r) => r.variant === variant && r.version === "1");
  return {
    variant,
    file: `pose_landmarker_${variant}.task`,
    latest,
    v1,
    identicalToV1: latest.sha256 === v1.sha256,
    differingBytes: differingBytes(bodies.get(latest.url), bodies.get(v1.url)),
    sameMembers: sameMembers(latest, v1),
  };
});

const fetchedOn = new Date().toISOString().slice(0, 10);
const out = `/**
 * MediaPipe Pose Landmarker .task files as served by Google's mediapipe-models
 * storage bucket, measured by downloading each file in full.
 *
 * GENERATED — do not hand-edit; regenerate with
 * NODE_USE_ENV_PROXY=1 node scripts/fetch-pose-model-files.mjs
 *
 * bytes, sha256 and md5 are computed from the bytes received; lastModified,
 * etag and contentType are the response headers, verbatim (null when the
 * server sent none); identicalToV1 compares the two SHA-256 values. Rendered
 * on /motion/mediapipe-pose-landmarker-models (src/components/PoseModelFiles.tsx).
 */

export type PoseModelFile = {
  variant: "lite" | "full" | "heavy";
  version: "latest" | "1";
  url: string;
  bytes: number;
  sha256: string;
  md5: string;
  /** true when the bucket's x-goog-hash md5 was sent and equals ours; null when not sent. */
  md5MatchesServer: true | null;
  lastModified: string | null;
  etag: string | null;
  contentType: string | null;
  /** The bundle's zip members; crc32 recomputed from the member's bytes. modified is the stored DOS time (no zone). */
  members: { name: string; bytes: number; crc32: string; sha256: string; modified: string }[];
};

export type PoseModelVariant = {
  variant: "lite" | "full" | "heavy";
  file: string;
  latest: PoseModelFile;
  v1: PoseModelFile;
  /** The latest file's SHA-256 equals the /1/ file's, on POSE_MODEL_FILES_FETCHED_ON. */
  identicalToV1: boolean;
  /** How many byte positions differ between the two files; null when their lengths differ. */
  differingBytes: number | null;
  /** Both bundles list the same members, in order, with the same SHA-256 (zip timestamps not compared). */
  sameMembers: boolean;
};

/** The day every file below was downloaded and measured. */
export const POSE_MODEL_FILES_FETCHED_ON = ${JSON.stringify(fetchedOn)};

/** The URL pattern the files were read from; one per variant and version. */
export const POSE_MODEL_FILES_URL_PATTERN = ${JSON.stringify(`${BASE}/pose_landmarker_<variant>/float16/<latest|1>/pose_landmarker_<variant>.task`)};

export const POSE_MODEL_FILES: PoseModelVariant[] = ${JSON.stringify(variants, null, 2)};
`;
writeFileSync(OUT, out);
const same = variants.filter((v) => v.identicalToV1).length;
console.log(`✓ ${OUT}: ${rows.length} files measured on ${fetchedOn}; latest and /1/ byte-identical for ${same} of ${variants.length} variants.`);
