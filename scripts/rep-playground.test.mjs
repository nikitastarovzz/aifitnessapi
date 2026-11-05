/**
 * The /tools/rep-counter-playground logic, tested through the module the page
 * runs (src/lib/repPlayground.mjs, on top of src/lib/repCounter.mjs).
 *
 *   node --test scripts/rep-playground.test.mjs     (npm run test:rep-playground)
 *
 * Every sequence is synthetic: angles in degrees at 30 frames per second,
 * shaped like the movement (a cosine between two extremes), with noise,
 * dropouts and glitches where a case needs them. They pin the rules the page
 * prints: hysteresis between top and bottom, the minimum frames a zone must
 * hold, the minimum cycle time, both directions, side selection, the
 * config's JSON round trip and loading a form-rules preset.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  DEFAULT_CONFIG,
  configFromPreset,
  configJson,
  countAngles,
  countTrace,
  frameAngles,
  parseConfig,
  sideAngle,
  syntheticFrames,
  validateConfig,
} from "../src/lib/repPlayground.mjs";

const FPS = 30;
const DT = 1000 / FPS;

/** n cycles from `start` to `end` and back, each `periodMs` long, with a
 *  hold at `start` before and after. */
function cycles(n, start, end, periodMs = 2000, holdMs = 500) {
  const out = [];
  let t = 0;
  const push = (a) => {
    out.push([Math.round(t), a]);
    t += DT;
  };
  for (let i = 0; i < holdMs / DT; i++) push(start);
  for (let r = 0; r < n; r++) {
    const frames = Math.round(periodMs / DT);
    for (let i = 0; i < frames; i++) push(end + ((start - end) * (1 + Math.cos((i / frames) * 2 * Math.PI))) / 2);
  }
  for (let i = 0; i < holdMs / DT; i++) push(start);
  return out;
}

function noisy(samples, amp, seed = 3) {
  let x = seed;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648) * 2 - 1;
  return samples.map(([t, a]) => [t, a === null ? null : a + rnd() * amp]);
}

const cfg = (over = {}) => {
  const r = validateConfig({ ...DEFAULT_CONFIG, ...over });
  assert.ok(r.ok, r.errors?.join("; "));
  return r.config;
};

test("clean cycles: one rep each", () => {
  const r = countAngles(cfg(), cycles(6, 172, 80));
  assert.equal(r.reps, 6);
  assert.equal(r.rejected, 0);
  assert.equal(r.phase, "rest");
  assert.equal(r.series.length, cycles(6, 172, 80).length);
});

test("hysteresis: jitter between the thresholds never counts", () => {
  // Oscillates 105–155: inside the gap between bottom 100 and top 160.
  const samples = [...cycles(1, 172, 172, 1000), ...cycles(10, 155, 105, 600)].map(([, a], i) => [Math.round(i * DT), a]);
  assert.equal(countAngles(cfg(), samples).reps, 0);
});

test("noise of ±5 degrees around clean reps adds none", () => {
  assert.equal(countAngles(cfg(), noisy(cycles(5, 172, 80), 5)).reps, 5);
});

test("shallow reps that never reach the bottom are not counted", () => {
  assert.equal(countAngles(cfg(), cycles(4, 172, 110)).reps, 0);
  // Lowering the bottom threshold's bar (raising it to 115) counts them.
  assert.equal(countAngles(cfg({ bottom: 115 }), cycles(4, 172, 110)).reps, 4);
});

test("minFrames: a one-frame spike below the bottom is not a rep", () => {
  const samples = [];
  for (let i = 0; i < 30; i++) samples.push([Math.round(i * DT), 170]);
  samples.push([Math.round(30 * DT), 60]); // single-frame glitch
  for (let i = 31; i < 60; i++) samples.push([Math.round(i * DT), 170]);
  const glitch = cfg({ smoothingMs: 0, minFrames: 2 });
  assert.equal(countAngles(glitch, samples).reps, 0);
  // With minFrames 1 and no smoothing the same glitch is counted: the knob matters.
  assert.equal(countAngles(cfg({ smoothingMs: 0, minFrames: 1, minCycleMs: 0 }), samples).reps, 1);
});

test("minCycleMs rejects cycles faster than the floor", () => {
  const fast = cycles(5, 172, 80, 400);
  const r = countAngles(cfg({ minCycleMs: 600, smoothingMs: 0, minFrames: 1 }), fast);
  assert.ok(r.rejected > 0, "expected rejected cycles");
  assert.ok(r.reps < 5);
  const ok = countAngles(cfg({ minCycleMs: 0, smoothingMs: 0, minFrames: 1 }), fast);
  assert.equal(ok.reps, 5);
});

test("startAt low: a press counts from the bottom up and back", () => {
  // Elbow from 70 (racked) to 175 (locked out) and back.
  const press = cycles(4, 70, 175);
  const low = cfg({ joint: "elbow", startAt: "low", top: 160, bottom: 90 });
  assert.equal(countAngles(low, press).reps, 4);
  // Under "high" the counter waits for the first lockout and counts each
  // later one, so the first press is lost: direction is part of the rule.
  const high = countAngles(cfg({ joint: "elbow", startAt: "high", top: 160, bottom: 90 }), press);
  assert.equal(high.reps, 3);
});

test("a person leaving the frame holds the phase and is counted as missing", () => {
  const s = cycles(3, 172, 80);
  const withGap = s.map(([t, a], i) => [t, i > 70 && i < 80 ? null : a]);
  const r = countAngles(cfg(), withGap);
  assert.equal(r.reps, 3);
  assert.equal(r.missing, 9);
});

test("the synthetic demo recording counts the reps it was built with", () => {
  const frames = syntheticFrames("knee", 5);
  assert.equal(countTrace(cfg(), frames).reps, 5);
});

test("events carry the time and running count of each rep", () => {
  const r = countAngles(cfg(), cycles(3, 172, 80));
  assert.deepEqual(r.events.map((e) => e.n), [1, 2, 3]);
  assert.ok(r.events.every((e, i, a) => i === 0 || e.t > a[i - 1].t));
});

test("sideAngle: left, right, either and best", () => {
  const f = { image: { knee: [100, 140] }, world: null, vis: { knee: [0.9, 0.6] } };
  assert.equal(sideAngle(f, cfg({ side: "left" })), 100);
  assert.equal(sideAngle(f, cfg({ side: "right" })), 140);
  assert.equal(sideAngle(f, cfg({ side: "either" })), 120);
  assert.equal(sideAngle(f, cfg({ side: "best" })), 100);
  // Raising the visibility floor drops the weaker side.
  assert.equal(sideAngle(f, cfg({ side: "either", visibilityMin: 0.7 })), 100);
  assert.equal(sideAngle(f, cfg({ side: "right", visibilityMin: 0.7 })), null);
});

test("frameAngles: a right angle at the knee, image and world", () => {
  const pts = Array.from({ length: 33 }, () => ({ x: 0, y: 0, z: 0, visibility: 0.99 }));
  // Left hip above the knee, ankle to the side: 90 degrees at the knee.
  pts[23] = { x: 0.5, y: 0.2, z: 0, visibility: 0.9 };
  pts[25] = { x: 0.5, y: 0.5, z: 0, visibility: 0.9 };
  pts[27] = { x: 0.8, y: 0.5, z: 0, visibility: 0.9 };
  const a = frameAngles(pts, pts, 1);
  assert.equal(a.image.knee[0], 90);
  assert.equal(a.world.knee[0], 90);
  // With aspect 2 the image x is stretched; the world angle is unaffected.
  const b = frameAngles(pts, pts, 2);
  assert.equal(b.world.knee[0], 90);
  assert.equal(b.image.knee[0], 90);
});

test("config JSON round-trips, and invalid configs say why", () => {
  const c = cfg({ joint: "hip", top: 150, bottom: 70, minFrames: 3 });
  const back = parseConfig(configJson(c));
  assert.ok(back.ok);
  assert.deepEqual(back.config, c);
  const bad = parseConfig(JSON.stringify({ ...c, top: 60, bottom: 90 }));
  assert.equal(bad.ok, false);
  assert.match(bad.errors.join(" "), /top must be above bottom/);
  assert.equal(parseConfig("{").ok, false);
  assert.equal(parseConfig(JSON.stringify({ joint: "neck" })).ok, false);
  const partial = parseConfig(JSON.stringify({ joint: "elbow" }));
  assert.ok(partial.ok);
  assert.ok(partial.defaulted.includes("top"));
});

test("every form-rules preset loads as a valid config and counts its own shape", () => {
  const src = readFileSync(new URL("../src/data/formRules.ts", import.meta.url), "utf8");
  const i = src.indexOf("export const FORM_RULE_PRESETS:");
  const open = src.indexOf("= [", i) + 2;
  const presets = JSON.parse(src.slice(open, src.indexOf("\n];", open) + 2));
  assert.ok(presets.length >= 1);
  for (const p of presets) {
    const { config, fromSource } = configFromPreset(p);
    assert.equal(config.top, p.top);
    assert.equal(config.bottom, p.bottom);
    assert.ok(fromSource.includes("top"));
    // Reps that pass 10 degrees beyond each threshold are counted.
    assert.equal(countAngles(config, cycles(4, p.top + 10, p.bottom - 10)).reps, 4, p.id);
  }
});
