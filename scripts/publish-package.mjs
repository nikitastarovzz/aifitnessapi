#!/usr/bin/env node
/**
 * Publishes one npm package from this repo when, and only when, its content
 * changed. Run by .github/workflows/publish-packages.yml for mcp/
 * (@aifitnessapi/mcp) and packages/health-data/ (@aifitnessapi/health-data).
 * ops/DISTRIBUTION.md section 1 is the background: both packages were built
 * and tested months ago and never published, because publishing needed the
 * owner at the keyboard each time.
 *
 * Why a content hash and not the version in package.json. Nobody remembers
 * to bump a version when a regenerated dataset lands in a package's data/,
 * and a forgotten bump either blocks the publish (npm refuses a version it
 * already has) or ships nothing. So the decision is made from the bytes:
 *
 *   1. Hash the files `npm pack --dry-run --json` says it would pack, in
 *      sorted path order, path and bytes each. package.json is hashed with
 *      its `version` and `aifitnessapi.contentHash` removed, and server.json
 *      (if packed) with its version fields removed, so a version bump alone
 *      never looks like a change.
 *   2. Read the latest release from the registry: `npm view <name>@latest
 *      --json`, fields `version` and `aifitnessapi.contentHash`. E404 means
 *      the package was never published.
 *   3. Decide. Never published: publish the version package.json carries.
 *      Same hash: nothing to do. Different hash: the next patch after the
 *      registry's latest, or the version in package.json when someone bumped
 *      it past the registry on purpose (a minor or major release).
 *
 * On publish the version and the hash are written into package.json (and
 * the version into mcp/server.json, the MCP registry manifest, which carries
 * it twice) in the working copy, `npm publish --access public` runs, and the
 * files are put back as they were. Nothing is committed: the registry is the
 * record of what was published, and the next run reads it from there.
 *
 * Usage:
 *   node scripts/publish-package.mjs mcp
 *   node scripts/publish-package.mjs packages/health-data --dry-run
 *
 * --dry-run does everything except the publish (it runs `npm publish
 * --dry-run`) and never needs a token. The token, when there is one, comes
 * from NODE_AUTH_TOKEN through the .npmrc that actions/setup-node writes;
 * this script never reads or prints it.
 *
 * Exits non-zero on any npm error except the E404 that means "not published
 * yet". Appends one line to $GITHUB_STEP_SUMMARY when that is set.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

/** package.json as hashed: no version, no content hash. */
export function normalizePackageJson(text) {
  const pkg = JSON.parse(text);
  delete pkg.version;
  if (pkg.aifitnessapi && typeof pkg.aifitnessapi === "object") {
    delete pkg.aifitnessapi.contentHash;
    if (Object.keys(pkg.aifitnessapi).length === 0) delete pkg.aifitnessapi;
  }
  return JSON.stringify(pkg);
}

/** server.json as hashed: no top-level version, no per-package version. */
export function normalizeServerJson(text) {
  const s = JSON.parse(text);
  delete s.version;
  if (Array.isArray(s.packages)) for (const p of s.packages) if (p && typeof p === "object") delete p.version;
  return JSON.stringify(s);
}

/**
 * sha256 over the packed files. `files` is the list of paths npm would pack,
 * relative to the package directory; `read(path)` returns its bytes.
 */
export function contentHash(files, read) {
  const h = crypto.createHash("sha256");
  for (const p of [...files].sort()) {
    let bytes = read(p);
    if (p === "package.json") bytes = Buffer.from(normalizePackageJson(bytes.toString("utf8")));
    else if (p === "server.json") bytes = Buffer.from(normalizeServerJson(bytes.toString("utf8")));
    h.update(`${p}\0${bytes.length}\0`);
    h.update(bytes);
  }
  return `sha256:${h.digest("hex")}`;
}

export function parseSemver(v) {
  const m = SEMVER.exec(String(v ?? ""));
  if (!m) throw new Error(`not a plain x.y.z version: ${JSON.stringify(v)}`);
  return m.slice(1).map(Number);
}

export function nextPatch(v) {
  const [a, b, c] = parseSemver(v);
  return `${a}.${b}.${c + 1}`;
}

function compareSemver(x, y) {
  const a = parseSemver(x);
  const b = parseSemver(y);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

/**
 * registry: null when never published, else { version, contentHash }.
 * Returns { action: "publish" | "unchanged", version, reason }.
 */
export function decide({ localVersion, localHash, registry }) {
  parseSemver(localVersion);
  if (!registry) {
    return { action: "publish", version: localVersion, reason: "never published" };
  }
  parseSemver(registry.version);
  if (registry.contentHash === localHash) {
    return { action: "unchanged", version: registry.version, reason: `content matches ${registry.version} on the registry` };
  }
  const why = registry.contentHash ? "content differs from" : "no content hash recorded on";
  if (compareSemver(localVersion, registry.version) > 0) {
    return { action: "publish", version: localVersion, reason: `${why} ${registry.version}; package.json was bumped to ${localVersion}` };
  }
  return { action: "publish", version: nextPatch(registry.version), reason: `${why} ${registry.version}` };
}

function npm(args, cwd) {
  return execFileSync("npm", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
}

function packedFiles(dir) {
  const out = npm(["pack", "--dry-run", "--json", "--ignore-scripts"], dir);
  const list = JSON.parse(out);
  const files = list?.[0]?.files?.map((f) => f.path);
  if (!Array.isArray(files) || files.length === 0) throw new Error(`npm pack --dry-run listed no files in ${dir}`);
  if (!files.includes("package.json")) throw new Error(`npm pack --dry-run did not list package.json in ${dir}`);
  return files;
}

/** null on E404, else { version, contentHash }. Any other failure throws. */
function readRegistry(name, dir) {
  let out;
  try {
    out = npm(["view", `${name}@latest`, "--json"], dir);
  } catch (e) {
    const text = `${e.stdout ?? ""}\n${e.stderr ?? ""}`;
    if (/\bE404\b/.test(text)) return null;
    throw new Error(`npm view ${name} failed: ${String(e.stderr || e.message).trim().split("\n").slice(-3).join(" | ")}`);
  }
  if (!out.trim()) return null;
  const doc = JSON.parse(out);
  const latest = Array.isArray(doc) ? doc[doc.length - 1] : doc;
  return { version: latest.version, contentHash: latest.aifitnessapi?.contentHash ?? null };
}

function summary(line) {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ${line}\n`);
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const rel = args.find((a) => !a.startsWith("--"));
  if (!rel) {
    console.error("usage: node scripts/publish-package.mjs <dir> [--dry-run]");
    process.exit(2);
  }
  const dir = path.resolve(ROOT, rel);
  const pkgPath = path.join(dir, "package.json");
  const serverPath = path.join(dir, "server.json");
  const pkgText = fs.readFileSync(pkgPath, "utf8");
  const pkg = JSON.parse(pkgText);
  if (pkg.private) throw new Error(`${rel}/package.json is private; not publishing`);

  const files = packedFiles(dir);
  const hash = contentHash(files, (p) => fs.readFileSync(path.join(dir, p)));
  const registry = readRegistry(pkg.name, dir);
  const d = decide({ localVersion: pkg.version, localHash: hash, registry });
  console.log(`${pkg.name}: ${files.length} packed files, ${hash}`);
  console.log(`${pkg.name}: registry ${registry ? `latest ${registry.version}, hash ${registry.contentHash ?? "none"}` : "has no release (E404)"}`);
  console.log(`${pkg.name}: decision ${d.action} ${d.version} (${d.reason})`);

  if (d.action === "unchanged") {
    summary(`${pkg.name}: unchanged, ${d.version} on the registry matches`);
    return;
  }

  const serverText = fs.existsSync(serverPath) ? fs.readFileSync(serverPath, "utf8") : null;
  try {
    const next = { ...pkg, version: d.version, aifitnessapi: { ...(pkg.aifitnessapi ?? {}), contentHash: hash } };
    fs.writeFileSync(pkgPath, `${JSON.stringify(next, null, 2)}\n`);
    if (serverText !== null) {
      const s = JSON.parse(serverText);
      if ("version" in s) s.version = d.version;
      for (const p of s.packages ?? []) if (p?.identifier === pkg.name && "version" in p) p.version = d.version;
      fs.writeFileSync(serverPath, `${JSON.stringify(s, null, 2)}\n`);
    }
    // The hash must describe what is actually uploaded: recompute after the
    // write and stop if writing the version moved it.
    const again = contentHash(packedFiles(dir), (p) => fs.readFileSync(path.join(dir, p)));
    if (again !== hash) throw new Error(`content hash moved after writing the version (${hash} -> ${again})`);

    const publishArgs = ["publish", "--access", "public", ...(dryRun ? ["--dry-run"] : [])];
    // Inherited output: npm prints its tarball listing and any error to
    // stderr, and the run log should carry both.
    execFileSync("npm", publishArgs, { cwd: dir, stdio: ["ignore", "inherit", "inherit"] });
  } finally {
    fs.writeFileSync(pkgPath, pkgText);
    if (serverText !== null) fs.writeFileSync(serverPath, serverText);
  }
  summary(dryRun ? `${pkg.name}: dry run, would publish ${d.version} (${d.reason})` : `${pkg.name}: published ${d.version} (${d.reason})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (e) {
    console.error(`publish-package: ${e.message}`);
    process.exit(1);
  }
}
