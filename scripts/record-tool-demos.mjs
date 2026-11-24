#!/usr/bin/env node
/**
 * Record short screen videos of the most shareable tools, for the owner to
 * post (ops/TOOL-DEMOS.md). Owner-run; nothing here runs in CI or on deploy.
 *
 *   npx next dev -p 3100            (or `npm run build && npx next start -p 3100`)
 *   node scripts/record-tool-demos.mjs --base http://localhost:3100
 *   node scripts/record-tool-demos.mjs --only heart-rate-lab,daily --formats landscape
 *   node scripts/record-tool-demos.mjs --fake-video clip.y4m      (a real person doing push-ups, for /challenge)
 *   node scripts/record-tool-demos.mjs --list
 *
 * Each demo opens one page in Playwright's Chromium, drives the tool the way
 * a reader would (sample or synthetic modes only, so no device, file or
 * account is needed), and records it for 20–30 seconds in two formats:
 *
 *   portrait   1080×1920 (a 540×960 phone viewport: Reels, Shorts, TikTok, Stories)
 *   landscape  1920×1080 (a 1280×720 laptop viewport: X, LinkedIn, YouTube)
 *
 * Playwright records the screen at the viewport's CSS size (it ignores the
 * device scale factor), so the page is laid out at the phone or laptop size a
 * reader would see and ffmpeg scales the clip up to the posting size.
 *
 * Output goes to .cache/tool-demos/ (gitignored): <demo>-<format>.webm at the
 * viewport size, <demo>-<format>.mp4 at the posting size (H.264, needs ffmpeg
 * on the PATH; without it only the .webm is written and the manifest says so),
 * and manifest.json listing what was recorded, from which URL, how long and
 * whether every step ran. Video is
 * never written anywhere else: --out must stay under .cache/, so a clip cannot
 * land in public/ or in a commit by accident.
 *
 * The camera demo (/challenge) runs on Chromium's fake camera: its built-in
 * test pattern by default, which no pose model will find a person in, or the
 * file given with --fake-video (.y4m or .mjpeg, Chromium's
 * --use-file-for-fake-video-capture). The pose model is downloaded from
 * cdn.jsdelivr.net and storage.googleapis.com, as on the live page; where
 * those hosts are blocked the clip shows the page's own error message.
 * A step that finds nothing to click is logged and skipped, not fatal, so a
 * changed label shows up in the manifest instead of stopping the run.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : dflt;
};
const flag = (name) => process.argv.includes(name);

export const FORMATS = {
  portrait: { viewport: { width: 540, height: 960 }, size: { width: 1080, height: 1920 }, isMobile: true },
  landscape: { viewport: { width: 1280, height: 720 }, size: { width: 1920, height: 1080 }, isMobile: false },
};
export const MIN_SECONDS = 20;
export const MAX_SECONDS = 30;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Scroll by `px` over `ms`, in small steps, so the clip reads as a smooth pan. */
async function pan(page, px, ms = 1500) {
  const steps = Math.max(1, Math.round(ms / 50));
  for (let i = 0; i < steps; i++) {
    await page.evaluate((dy) => window.scrollBy(0, dy), px / steps);
    await sleep(50);
  }
}

/** Bring an element into view, centered, with a short pan rather than a jump. */
async function show(page, locator, ms = 1200) {
  const el = locator.first();
  await el.waitFor({ state: "visible", timeout: 8000 });
  const box = await el.boundingBox();
  if (!box) return;
  const vh = page.viewportSize().height;
  await pan(page, box.y - vh * 0.3, ms);
}

/** Click the first element matching, after showing it; a short pause after. */
async function click(page, locator, after = 800) {
  const el = locator.first();
  await show(page, el, 900);
  await el.click({ timeout: 5000 });
  await sleep(after);
}

/**
 * The demos. `steps` get the page and run in order; each is wrapped so one
 * that fails is recorded in the manifest and the rest still run. `path` is
 * the page, `title` the caption the owner can start from (see ops/TOOL-DEMOS.md).
 */
export const DEMOS = [
  {
    id: "pose-benchmark",
    path: "/tools/pose-benchmark",
    title: "How fast does a pose model run in your browser? Benchmark MediaPipe Pose Landmarker on your own device.",
    steps: [
      ["pick the synthetic frame", (p) => click(p, p.getByLabel(/Synthetic test frame/))],
      ["run the benchmark", (p) => click(p, p.getByRole("button", { name: /Run benchmark/ }), 1000)],
      ["wait for results", (p) => p.locator("[data-bench-row]").first().waitFor({ timeout: 20000 })],
      ["show the results", (p) => show(p, p.locator("[data-bench-row]"), 1500)],
    ],
  },
  {
    id: "heart-rate-lab",
    path: "/tools/heart-rate-lab",
    title: "Decode a Bluetooth heart-rate stream byte by byte, in the browser. No device needed for the sample.",
    steps: [
      ["replay the synthetic sample", (p) => click(p, p.locator('[data-action="replay"]'), 5000)],
      ["pan down the decoded stream", (p) => pan(p, 500, 2500)],
      ["hold", () => sleep(3000)],
      ["pan further", (p) => pan(p, 500, 2500)],
    ],
  },
  {
    id: "rep-counter-playground",
    path: "/tools/rep-counter-playground",
    title: "Tune a rep counter's angle thresholds and watch the count change, on a synthetic demo or your own video.",
    steps: [
      ["pick the synthetic demo", (p) => click(p, p.getByLabel(/Synthetic demo/))],
      ["load it", (p) => click(p, p.locator("[data-rcp-demo]"), 5000)],
      ["pan to the trace", (p) => pan(p, 450, 2500)],
      ["hold", () => sleep(3000)],
      ["pan to the config", (p) => pan(p, 450, 2500)],
    ],
  },
  {
    id: "aggregator-chooser",
    path: "/tools/aggregator-chooser",
    title: "Terra, ROOK, Junction, Spike, Thryve, Sahha: tick what you need and see which aggregator documents it.",
    steps: [
      ["show the requirements", (p) => show(p, p.locator('[data-tool] input[type="checkbox"]'), 1500)],
      ["tick three requirements", async (p) => {
        const boxes = p.locator('[data-tool] input[type="checkbox"]');
        const n = Math.min(3, await boxes.count());
        for (let i = 0; i < n; i++) {
          await boxes.nth(i).check({ timeout: 4000 });
          await sleep(1200);
        }
      }],
      ["pan to the matrix", (p) => pan(p, 600, 3000)],
      ["hold", () => sleep(3000)],
      ["pan further", (p) => pan(p, 600, 3000)],
    ],
  },
  {
    id: "keypoint-playground",
    path: "/tools/keypoint-playground",
    title: "MediaPipe's 33 points vs COCO's 17: map pose keypoints between schemes and copy the code.",
    steps: [
      ["show the scheme pickers", (p) => show(p, p.locator("[data-kp-from]"), 1500)],
      ["pick another target scheme", async (p) => {
        const sel = p.locator("[data-kp-to]").first();
        const values = await sel.locator("option").evaluateAll((os) => os.map((o) => o.value));
        for (const v of values.slice(0, 3)) {
          await sel.selectOption(v);
          await sleep(1500);
        }
      }],
      ["pick joints on the body", async (p) => {
        // SVG groups; Playwright's hover/click actionability checks time out on
        // them, so the click is forced (it is the same click a reader makes).
        const joints = p.locator("[data-kp-joint]");
        const n = await joints.count();
        for (const i of [0, 11, 13, 23, 25].filter((x) => x < n)) {
          await joints.nth(i).click({ timeout: 3000, force: true });
          await sleep(900);
        }
      }],
      ["pan to the code", (p) => pan(p, 600, 3000)],
    ],
  },
  {
    id: "daily",
    path: "/daily",
    title: "Five questions a day about fitness and health APIs. How many can you get?",
    steps: [
      ["show the first question", (p) => show(p, p.locator('[data-testid="daily-question"]'), 1000)],
      ["answer the questions", async (p) => {
        for (let q = 0; q < 5; q++) {
          await p.locator('[data-testid="daily-option"]:not([disabled])').first().click({ timeout: 5000 });
          await sleep(1100);
          await p.locator('[data-testid="daily-next"]').first().click({ timeout: 5000 });
          await sleep(600);
        }
      }],
      ["show the result", (p) => show(p, p.locator('[data-testid="daily-result"]'), 1500)],
    ],
  },
  {
    id: "challenge",
    path: "/challenge?ex=pushups&beat=17",
    camera: true,
    title: "Beat 17 push-ups? A pose model in your browser counts them from your webcam. The video stays on your device.",
    steps: [
      ["show the beat-my-score banner", (p) => show(p, p.locator("[data-challenge-beat]"), 1500)],
      ["start the (fake) camera", (p) => click(p, p.getByRole("button", { name: /Start camera/ }), 1000)],
      ["wait for the model", (p) => p.getByRole("button", { name: /^Go$/ }).waitFor({ timeout: 10000 })],
      ["press Go", (p) => click(p, p.getByRole("button", { name: /^Go$/ }), 10000)],
    ],
  },
];

/** The ffmpeg command that scales a .webm to the posting size as an .mp4 most networks accept. */
export function mp4Args(src, dst, size) {
  return [
    "-y", "-loglevel", "error", "-i", src,
    "-vf", `scale=${size.width}:${size.height}:flags=lanczos`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", dst,
  ];
}

/** A video's length in seconds by ffprobe, or null. */
function probeSeconds(file) {
  try {
    const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
    const n = Number(out.trim());
    return Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
  } catch {
    return null;
  }
}

function hasFfmpeg() {
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function record(browserFor, demo, formatName, base, outDir) {
  const f = FORMATS[formatName];
  const tmp = fs.mkdtempSync(path.join(outDir, `.tmp-${demo.id}-`));
  const browser = await browserFor(demo);
  const context = await browser.newContext({
    viewport: f.viewport,
    deviceScaleFactor: 1,
    isMobile: f.isMobile,
    hasTouch: f.isMobile,
    colorScheme: "dark",
    reducedMotion: "no-preference",
    permissions: demo.camera ? ["camera"] : [],
    recordVideo: { dir: tmp, size: f.viewport },
  });
  const page = await context.newPage();
  const url = new URL(demo.path, base).href;
  const t0 = Date.now();
  const steps = [];
  let elapsed = 0;
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    await sleep(1500);
    for (const [name, fn] of demo.steps) {
      const left = MAX_SECONDS * 1000 - 1500 - (Date.now() - t0);
      if (left <= 0) {
        steps.push({ name, ok: false, note: "skipped: the clip reached its maximum length" });
        continue;
      }
      try {
        const run = fn(page);
        // The step keeps running after a timeout until the page closes; its
        // later failure is expected and must not surface as an unhandled rejection.
        run.catch(() => {});
        await Promise.race([run, sleep(left).then(() => Promise.reject(new Error("ran past the clip's maximum length")))]);
        steps.push({ name, ok: true });
      } catch (e) {
        steps.push({ name, ok: false, note: String(e.message ?? e).split("\n")[0].slice(0, 200) });
      }
    }
    // Pad a short clip to the minimum with a slow pan back up.
    const spent = Date.now() - t0;
    if (spent < MIN_SECONDS * 1000) await pan(page, -400, MIN_SECONDS * 1000 - spent + 500);
  } finally {
    elapsed = (Date.now() - t0) / 1000;
    await context.close(); // flushes the video
  }
  const video = fs.readdirSync(tmp).find((x) => x.endsWith(".webm"));
  const file = path.join(outDir, `${demo.id}-${formatName}.webm`);
  if (video) fs.renameSync(path.join(tmp, video), file);
  fs.rmSync(tmp, { recursive: true, force: true });
  const seconds = (video && probeSeconds(file)) ?? Math.round(elapsed * 10) / 10;
  return { demo: demo.id, format: formatName, url, file: video ? path.relative(ROOT, file) : null, recordedSize: f.viewport, postSize: f.size, seconds, steps };
}

async function main() {
  if (flag("--list")) {
    for (const d of DEMOS) console.log(`${d.id.padEnd(24)} ${d.path}`);
    return;
  }
  const base = arg("--base", "http://localhost:3000");
  const outDir = path.resolve(ROOT, arg("--out", ".cache/tool-demos"));
  if (!outDir.startsWith(path.join(ROOT, ".cache") + path.sep)) {
    throw new Error(`--out must be under .cache/ (gitignored), not ${outDir}: videos are never committed`);
  }
  const only = arg("--only", "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const unknown = only.filter((id) => !DEMOS.some((d) => d.id === id));
  if (unknown.length) throw new Error(`unknown demo(s): ${unknown.join(", ")}; --list shows them`);
  const formats = arg("--formats", "portrait,landscape").split(",").map((s) => s.trim());
  for (const f of formats) if (!FORMATS[f]) throw new Error(`unknown format ${f}; use portrait and/or landscape`);
  const fakeVideo = arg("--fake-video", "");
  if (fakeVideo && !/\.(y4m|mjpeg)$/i.test(fakeVideo)) throw new Error("--fake-video takes a .y4m or .mjpeg file");
  if (fakeVideo && !fs.existsSync(fakeVideo)) throw new Error(`--fake-video ${fakeVideo} does not exist`);
  fs.mkdirSync(outDir, { recursive: true });

  const plain = await chromium.launch();
  let camera = null;
  const browserFor = async (demo) => {
    if (!demo.camera) return plain;
    camera ??= await chromium.launch({
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        ...(fakeVideo ? [`--use-file-for-fake-video-capture=${path.resolve(fakeVideo)}`] : []),
      ],
    });
    return camera;
  };

  const ffmpeg = !flag("--no-mp4") && hasFfmpeg();
  const results = [];
  try {
    for (const demo of DEMOS.filter((d) => only.length === 0 || only.includes(d.id))) {
      for (const fmt of formats) {
        process.stdout.write(`recording ${demo.id} (${fmt})… `);
        const r = await record(browserFor, demo, fmt, base, outDir);
        if (ffmpeg && r.file) {
          const mp4 = r.file.replace(/\.webm$/, ".mp4");
          try {
            execFileSync("ffmpeg", mp4Args(path.join(ROOT, r.file), path.join(ROOT, mp4), FORMATS[fmt].size), { stdio: "ignore" });
            r.mp4 = mp4;
          } catch {
            r.mp4 = null;
          }
        }
        results.push(r);
        const failed = r.steps.filter((s) => !s.ok);
        console.log(`${r.mp4 ?? r.file ?? "no video"} · ${r.seconds} s${failed.length ? ` · ${failed.length} step(s) skipped: ${failed.map((s) => s.name).join(", ")}` : ""}`);
      }
    }
  } finally {
    await plain.close();
    await camera?.close();
  }
  const manifest = {
    recordedAt: new Date().toISOString(),
    base,
    fakeVideo: fakeVideo || null,
    note: "Owner-run clips for posting; see ops/TOOL-DEMOS.md. Never commit these files.",
    clips: results.map((r) => ({ ...r, title: DEMOS.find((d) => d.id === r.demo).title })),
  };
  fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ ${results.filter((r) => r.file).length} clip(s) in ${path.relative(ROOT, outDir)}/, manifest.json beside them.`);
  const short = results.filter((r) => r.file && (r.seconds < MIN_SECONDS || r.seconds > MAX_SECONDS + 3));
  if (short.length) {
    console.error(`✗ ${short.length} clip(s) outside ${MIN_SECONDS}–${MAX_SECONDS} s: ${short.map((r) => `${r.demo}-${r.format} ${r.seconds} s`).join(", ")}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(`record-tool-demos: ${e.message}`);
    process.exit(1);
  });
}
