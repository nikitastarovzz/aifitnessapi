/**
 * What /tools/step-lab states about the browser API, and where it was read.
 *
 * developer.mozilla.org and the W3C hosts were not reachable from the writing
 * environment on SOURCES_CHECKED_ON. The text was read instead from the
 * sources those pages are built from: MDN's content repository (the Markdown
 * each MDN page renders) and the W3C Device Orientation and Motion editor's
 * draft source (index.bs in w3c/deviceorientation). The page cites the
 * published URLs a reader can open; `readFrom` records what was fetched.
 * Each quote is verbatim from `readFrom` and is checked by
 * ops/sources/evidence/tools-step-lab.json.
 */
export const SOURCES_CHECKED_ON = "2026-10-31";

export type StepLabSource = { id: string; title: string; url: string; readFrom: string };

export const STEP_LAB_SOURCES: StepLabSource[] = [
  {
    id: "mdn-dme",
    title: "MDN: DeviceMotionEvent",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent",
    readFrom: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/devicemotionevent/index.md",
  },
  {
    id: "mdn-aig",
    title: "MDN: DeviceMotionEvent.accelerationIncludingGravity",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/accelerationIncludingGravity",
    readFrom:
      "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/devicemotionevent/accelerationincludinggravity/index.md",
  },
  {
    id: "mdn-perm",
    title: "MDN: DeviceMotionEvent.requestPermission()",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static",
    readFrom:
      "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/devicemotionevent/requestpermission_static/index.md",
  },
  {
    id: "mdn-event",
    title: "MDN: Window devicemotion event",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event",
    readFrom: "https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/api/window/devicemotion_event/index.md",
  },
  {
    id: "w3c",
    title: "W3C: Device Orientation and Motion (editor's draft)",
    url: "https://w3c.github.io/deviceorientation/",
    readFrom: "https://raw.githubusercontent.com/w3c/deviceorientation/main/index.bs",
  },
];
