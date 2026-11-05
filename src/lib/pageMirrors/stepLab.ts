import { DEFAULT_PARAMS, REPLAY_TRUE_STEPS } from "@/lib/stepDetector.mjs";
import { SOURCES_CHECKED_ON, STEP_LAB_SOURCES } from "@/lib/stepLab";
import { site } from "@/lib/site";
import { interactiveNote, link, type MirrorDoc } from "./core";

const PATH = "/tools/step-lab";
const UPDATED = "2026-10-31";

/** /tools/step-lab.md — mirrors src/app/tools/step-lab/page.tsx. */
export function stepLabMirror(): MirrorDoc {
  const src = (id: string) => STEP_LAB_SOURCES.find((s) => s.id === id)!;
  const cite = (id: string, text: string) => link(text, src(id).url);
  const threshold = DEFAULT_PARAMS.threshold.toFixed(1);
  return {
    path: PATH,
    title: "Step lab: a step counter you can watch think",
    description:
      "Walk with your phone and watch a step detector count: live accelerometer trace, each step marked, sliders that change the count. Runs in your browser.",
    updated: UPDATED,
    type: "tool",
    capsule:
      "Two step counters can disagree about the same walk because a step is not something an accelerometer reports: each counter decides what counts as one, with its own smoothing, its own threshold and its own rule for how soon the next step may come. This page runs a deliberately simple detector on your phone’s accelerometer in the browser, marks every step it counts on the live trace, and gives you sliders for the threshold and the minimum interval so you can watch the count change for a walk that has already happened. Motion data never leaves your device. Without a motion sensor, it replays a synthetic, labeled walk.",
    body: [
      interactiveNote(PATH, "the live accelerometer trace and sliders"),
      "",
      "## What the detector does",
      "",
      "This detector is ours, written for this page, and it is not a copy of any phone’s. It exists to make visible the choices every step counter makes somewhere. For each sample:",
      "",
      "1. **Magnitude.** It takes the length of the acceleration vector, √(x² + y² + z²), so it does not matter which way the phone is held.",
      `2. **Low-pass filter.** An exponential filter with a ${DEFAULT_PARAMS.cutoffHz} Hz cutoff smooths away hand tremor and vibration faster than a walking rhythm. This is the green line.`,
      `3. **Baseline.** A much slower average (a ${DEFAULT_PARAMS.baselineSeconds} s time constant) tracks the resting level, gravity included, so the threshold is measured from wherever the signal sits.`,
      `4. **Peak and threshold.** A local maximum of the filtered signal is a candidate step if it rises at least the threshold above the baseline (default ${threshold} m/s²). The dashed line is baseline plus threshold: a peak has to cross it.`,
      `5. **Minimum interval.** A candidate sooner than the minimum interval (default ${DEFAULT_PARAMS.minIntervalMs} ms) after the last counted step is ignored, so one footfall that rings twice counts once.`,
      "",
      `Every one of those numbers is a judgment. Raise the threshold and soft steps (a shuffle, a step on carpet, a phone in a loose bag) disappear; lower it and bumps that are not steps get counted. Lengthen the interval and a double impact merges into one step, until it passes your step period and every other step vanishes. The synthetic replay has ${REPLAY_TRUE_STEPS} steps built in, three of them soft and one with a double impact, so you can see each failure on a trace whose true count is known.`,
      "",
      "## Why your phone’s own count is different",
      "",
      `The step counts your phone keeps do not come from a page like this. On Android, Google’s motion sensors guide says the step counter and step detector sensors “are either hardware-based or software-based”, and that the step counter has more latency, up to 10 seconds, but more accuracy than the step detector; both are covered, with Google’s wording, in ${link("TYPE_STEP_COUNTER vs TYPE_STEP_DETECTOR", "/phone-sensors/android-step-counter-sensor")}. On iOS, Apple describes what CMPedometer returns as system-generated live walking data: the step counts arrive already counted, as ${link("CMPedometer", "/phone-sensors/cmpedometer")} covers. Those pages quote what Apple and Google document about the APIs: what they return, when, and with what permission. They do not describe how the platforms turn motion into steps, and this page does not guess.`,
      "",
      `What follows from that is the practical point of ${link("the step counting API page", "/data/step-counting-api")}: a step count is an algorithmic estimate from motion sensors, not a literal record of footfalls, so treat it as close rather than exact, prefer the platform’s aggregated total over summing sources yourself, and do not quote an accuracy percentage. Two apps that read different sources, a phone and a watch, or one counter that waits seconds to report and another that reports at once, will disagree for reasons this lab makes visible. A “today” total can also disagree for a reason that has nothing to do with motion: where the day starts, which is the bug in ${link("why “today’s steps” is a bug", "/day-boundaries")}. Every phone motion API is indexed at ${link("phone motion sensors", "/phone-sensors")}.`,
      "",
      "## What the browser gives this page",
      "",
      `- The \`devicemotion\` event, which ${cite("mdn-event", "MDN")} describes as “fired at a regular interval”; its \`interval\` property is the time between samples in milliseconds, which the page shows when the browser reports it.`,
      `- Acceleration in meters per second squared. The page reads \`accelerationIncludingGravity\`, which ${cite("mdn-aig", "MDN")} says “represents the raw data measured by an accelerometer” and “may be the only value available on devices that aren't able to remove gravity”, and falls back to \`acceleration\` when that is missing. The baseline makes either work.`,
      `- On iOS Safari, a permission prompt. The page calls \`DeviceMotionEvent.requestPermission()\` inside the Start tap because, per ${cite("mdn-perm", "MDN")}, it needs transient activation, meaning “it must be triggered by a UI event such as a button click”, and it resolves to \`"granted"\` or \`"denied"\`. Browsers without the method need no prompt.`,
      `- Rounded values, on purpose. The ${cite("w3c", "W3C Device Orientation and Motion draft")} tells browsers to limit each acceleration value’s precision to no more than 0.1 m/s² and to expose the interfaces only in secure contexts, as fingerprinting defenses. This detector’s default threshold is ${threshold} m/s², so the rounding does not hide a step from it.`,
      "",
      "On a desktop, or a browser that never delivers a sample, Start reports that nothing arrived within three seconds and the synthetic replay is the way to see the detector work.",
      "",
      "## How this works, and what it sends",
      "",
      "Motion data never leaves your device. Samples go from the browser’s `devicemotion` event into an array in this tab’s memory and onto the canvas; they are not stored, sent or logged, and this page has no server code behind it. Reloading discards the recording. The share card is drawn on a canvas in your browser and saved by your browser; nothing is uploaded to make it.",
      "",
      `The replay is synthetic: a generated trace of ${REPLAY_TRUE_STEPS} steps at 1.8 per second with seeded noise, three soft steps, one double impact and a burst of 9 Hz hand jitter. It is not a recording of anyone walking and says nothing about how accurate any real counter is. The detector and the trace generator are one module, tested in \`scripts/step-detector.test.mjs\` against a regular walk, jitter and a hop.`,
      "",
      `The browser-API statements were read on ${SOURCES_CHECKED_ON}. MDN’s site and the W3C hosts could not be reached from where this page was written, so the text was read from the sources they publish: MDN’s content repository and the W3C draft’s source file. Sources: ${STEP_LAB_SOURCES.map((s) => link(s.title, s.url)).join("; ")}.`,
      "",
      `A free tool from ${site.name}. Every phone motion API is at ${link("phone motion sensors", "/phone-sensors")}. More at ${link("free tools for health-app builders", "/tools")}.`,
    ],
  };
}
