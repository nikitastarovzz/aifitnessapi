/**
 * The pure half of the pose arena on /tools/pose-benchmark: layout, the
 * rolling frame-time meter, the caption burned into every frame, the bone
 * list and the choice of recording format. No DOM and no clock, so
 * scripts/pose-arena.test.mjs runs exactly what the browser runs.
 *
 * Nothing here is a claim about either model. The arena draws what each model
 * returns on the reader's own frames and times it on the reader's device.
 */

/** Size of the one frame both models are given, in pixels. */
export const FRAME_W = 640;
export const FRAME_H = 480;
/** Size of each model's panel in the arena canvas (the recording's size). */
export const PANEL_W = 480;
export const PANEL_H = 360;
/** Height of the caption band under the panels. */
export const CAPTION_H = 56;
export const ARENA_W = PANEL_W * 2;
export const ARENA_H = PANEL_H + CAPTION_H;
/** "Record 5 seconds". */
export const RECORD_MS = 5000;
/** Frames the rolling meter averages over. */
export const METER_FRAMES = 30;
/**
 * Below this score (MoveNet) or visibility (MediaPipe) a keypoint is drawn
 * hollow. A display choice of this page, not a recommendation for either
 * model.
 */
export const DRAW_SCORE_MIN = 0.5;
export const ARENA_URL = "aifitnessapi.com/tools/pose-benchmark";

/**
 * The limbs drawn between keypoints, by the dataset's normalized point key.
 * The keypoint dataset records no skeleton connections, so these lines are
 * this page's drawing: the same twelve joints joined the same way for both
 * models, so the two panels are drawn alike.
 */
export const ARENA_BONE_KEYS = [
  ["leftshoulder", "rightshoulder"],
  ["leftshoulder", "leftelbow"],
  ["leftelbow", "leftwrist"],
  ["rightshoulder", "rightelbow"],
  ["rightelbow", "rightwrist"],
  ["leftshoulder", "lefthip"],
  ["rightshoulder", "righthip"],
  ["lefthip", "righthip"],
  ["lefthip", "leftknee"],
  ["leftknee", "leftankle"],
  ["righthip", "rightknee"],
  ["rightknee", "rightankle"],
];

/**
 * The bones as index pairs in one scheme, from that scheme's points as the
 * keypoint dataset lists them. Throws when a key is missing, so a dataset
 * change fails the build instead of drawing a wrong limb.
 * @param {{ index: number | null, key: string }[]} points
 * @param {string} label
 * @returns {[number, number][]}
 */
export function bonesFor(points, label) {
  const at = new Map(points.map((p) => [p.key, p.index]));
  return ARENA_BONE_KEYS.map(([a, b]) => {
    const i = at.get(a);
    const j = at.get(b);
    if (typeof i !== "number" || typeof j !== "number") throw new Error(`pose arena: ${label} has no indexed ${typeof i === "number" ? b : a}`);
    return [i, j];
  });
}

/**
 * Where a source of srcW × srcH lands inside dstW × dstH, scaled to fit
 * whole and centered (the rest is letterbox).
 */
export function fitContain(srcW, srcH, dstW, dstH) {
  if (!(srcW > 0 && srcH > 0)) return { x: 0, y: 0, w: dstW, h: dstH };
  const s = Math.min(dstW / srcW, dstH / srcH);
  const w = srcW * s;
  const h = srcH * s;
  return { x: (dstW - w) / 2, y: (dstH - h) / 2, w, h };
}

/**
 * A rolling meter over the last `size` inference times.
 * `fps` is 1000 / mean: the rate the model alone could sustain on this
 * device. Both models run on every arena frame, so the arena itself draws
 * slower than either number.
 */
export function createMeter(size = METER_FRAMES) {
  /** @type {number[]} */
  const ms = [];
  return {
    push(d) {
      if (!Number.isFinite(d) || d < 0) return;
      ms.push(d);
      if (ms.length > size) ms.shift();
    },
    get count() {
      return ms.length;
    },
    get meanMs() {
      return ms.length ? ms.reduce((a, b) => a + b, 0) / ms.length : NaN;
    },
    get fps() {
      const m = this.meanMs;
      return m > 0 ? 1000 / m : NaN;
    },
    reset() {
      ms.length = 0;
    },
  };
}

/** "24.3 fps" or "— fps" before the first timed frame. */
export function fpsLabel(fps) {
  return Number.isFinite(fps) ? `${fps.toFixed(1)} fps` : "— fps";
}

/**
 * The two caption lines burned into the canvas, so a shared screenshot or
 * clip names the models, the numbers and the page they came from.
 * @param {{ name: string, fps: number, state: string }} left
 * @param {{ name: string, fps: number, state: string }} right
 */
const STATE_LABEL = { off: "not started", loading: "loading", error: "did not load" };

export function captionLines(left, right) {
  const part = (m) => `${m.name} · ${m.state === "ready" ? fpsLabel(m.fps) : (STATE_LABEL[m.state] ?? m.state)}`;
  return [`${part(left)}   |   ${part(right)}`, `Same frames, one device, live in the browser · ${ARENA_URL}`];
}

/** Recording formats in order of preference; the browser picks the first it supports. */
export const RECORDER_TYPES = [
  { mimeType: "video/webm;codecs=vp9", ext: "webm" },
  { mimeType: "video/webm;codecs=vp8", ext: "webm" },
  { mimeType: "video/webm", ext: "webm" },
  { mimeType: "video/mp4", ext: "mp4" },
];

/**
 * The first format `isSupported` accepts, or null when none is (the page then
 * says recording is not available in this browser).
 * @param {(type: string) => boolean} isSupported
 */
export function pickRecorderType(isSupported) {
  for (const t of RECORDER_TYPES) {
    try {
      if (isSupported(t.mimeType)) return t;
    } catch {
      /* a browser that throws on the query supports none of them */
    }
  }
  return null;
}

/** "pose-arena-2026-11-24.webm", from the reader's local date. */
export function recordingName(localDate, ext) {
  return `pose-arena-${localDate}.${ext}`;
}
