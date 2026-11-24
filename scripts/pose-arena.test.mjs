/**
 * The pose arena on /tools/pose-benchmark: the pure helpers in
 * src/lib/poseArena.mjs that decide what is drawn and burned into a clip.
 *
 *   node --test scripts/pose-arena.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { POSE_SCHEMES } from "../src/data/poseKeypoints.ts";
import {
  ARENA_BONE_KEYS,
  ARENA_URL,
  ARENA_W,
  PANEL_W,
  bonesFor,
  captionLines,
  createMeter,
  fitContain,
  pickRecorderType,
  recordingName,
} from "../src/lib/poseArena.mjs";

const scheme = (slug) => POSE_SCHEMES.find((s) => s.slug === slug);

test("the limb lines map to the same named joints in BlazePose 33 and COCO 17", () => {
  const bp = scheme("blazepose-33");
  const coco = scheme("coco-17");
  const a = bonesFor(bp.points, "blazepose-33");
  const b = bonesFor(coco.points, "coco-17");
  assert.equal(a.length, ARENA_BONE_KEYS.length);
  const keyAt = (s, i) => s.points.find((p) => p.index === i).key;
  for (const [n, [x, y]] of ARENA_BONE_KEYS.entries()) {
    assert.deepEqual([keyAt(bp, a[n][0]), keyAt(bp, a[n][1])], [x, y]);
    assert.deepEqual([keyAt(coco, b[n][0]), keyAt(coco, b[n][1])], [x, y]);
  }
  // The left knee is 25 in BlazePose and 13 in COCO, per the dataset.
  assert.ok(a.some(([i, j]) => i === 25 || j === 25));
  assert.ok(b.some(([i, j]) => i === 13 || j === 13));
  assert.throws(() => bonesFor([{ index: 0, key: "nose" }], "x"), /has no indexed/);
});

test("a frame is fitted whole and centered", () => {
  assert.deepEqual(fitContain(1280, 720, 640, 480), { x: 0, y: 60, w: 640, h: 360 });
  assert.deepEqual(fitContain(480, 640, 640, 480), { x: 140, y: 0, w: 360, h: 480 });
  assert.deepEqual(fitContain(0, 0, 640, 480), { x: 0, y: 0, w: 640, h: 480 });
  assert.equal(ARENA_W, PANEL_W * 2);
});

test("the rate is 1000 / mean over the last frames only", () => {
  const m = createMeter(3);
  assert.ok(Number.isNaN(m.fps));
  for (const d of [100, 10, 10, 10]) m.push(d);
  assert.equal(m.count, 3);
  assert.equal(m.meanMs, 10);
  assert.equal(m.fps, 100);
  m.push(NaN);
  m.push(-1);
  assert.equal(m.count, 3);
  m.reset();
  assert.equal(m.count, 0);
});

test("every caption names both models and the page", () => {
  const [l1, l2] = captionLines(
    { name: "Pose Landmarker lite", fps: 31.25, state: "ready" },
    { name: "MoveNet SinglePose Lightning", fps: NaN, state: "error" },
  );
  assert.match(l1, /Pose Landmarker lite · 31\.3 fps/);
  assert.match(l1, /MoveNet SinglePose Lightning · did not load/);
  assert.ok(l2.endsWith(ARENA_URL));
  assert.equal(ARENA_URL, "aifitnessapi.com/tools/pose-benchmark");
});

test("recording format: first supported, WebM before MP4, none when nothing is", () => {
  assert.deepEqual(pickRecorderType((t) => t.startsWith("video/webm")), { mimeType: "video/webm;codecs=vp9", ext: "webm" });
  assert.deepEqual(pickRecorderType((t) => t === "video/mp4"), { mimeType: "video/mp4", ext: "mp4" });
  assert.equal(pickRecorderType(() => false), null);
  assert.equal(
    pickRecorderType(() => {
      throw new Error("no");
    }),
    null,
  );
  assert.equal(recordingName("2026-11-24", "webm"), "pose-arena-2026-11-24.webm");
});
