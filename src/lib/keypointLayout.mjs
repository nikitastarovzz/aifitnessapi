/**
 * Where /tools/keypoint-playground DRAWS each point. Layout, not data.
 *
 * These coordinates place a dot on a hand-drawn front-facing figure so a
 * reader can click it. They are not measurements, not any model's output and
 * not a claim that two models put a point in the same place: two keys drawn
 * at one spot (left_shoulder and OpenPose's LShoulder) stay separate points,
 * and only the dataset's name crosswalk ever joins points. Placement follows
 * the words in each name (left, shoulder, inner, big toe) and nothing else.
 *
 * Convention of the drawing only: the figure faces the reader, so points
 * named left are drawn on the right of the image.
 *
 * COCO-WholeBody's 68 face points and 42 hand points are deliberately absent.
 * Their names (face-0 … face-67, left_thumb1 …) do not say where each sits,
 * so the page lists them in index order instead of inventing positions.
 */

export const VIEW_W = 400;
export const VIEW_H = 680;
const MID = VIEW_W / 2;

/** Subject's right side (drawn on the left of the image), keyed by part. */
const RIGHT = {
  eyeinner: [190, 74],
  eye: [180, 74],
  eyeouter: [170, 74],
  ear: [152, 84],
  mouth: [188, 112],
  shoulder: [146, 168],
  elbow: [122, 262],
  wrist: [108, 350],
  thumb: [90, 372],
  index: [104, 392],
  pinky: [120, 386],
  hip: [170, 330],
  knee: [164, 480],
  ankle: [160, 614],
  heel: [164, 638],
  bigtoe: [150, 656],
  smalltoe: [130, 650],
  footindex: [146, 664],
};

const mirror = ([x, y]) => [VIEW_W - x, y];

/** key -> [x, y] in the viewBox. */
export const LAYOUT = (() => {
  /** @type {Record<string, [number, number]>} */
  const out = {};
  const put = (key, xy) => {
    out[key] = xy;
  };
  for (const [part, xy] of Object.entries(RIGHT)) {
    put(`right${part}`, xy);
    put(`left${part}`, mirror(xy));
  }
  // Spellings with the side after the part (BlazePose MOUTH_LEFT).
  put("mouthright", RIGHT.mouth);
  put("mouthleft", mirror(RIGHT.mouth));
  // OpenPose's one-letter sides.
  for (const part of ["shoulder", "elbow", "wrist", "hip", "knee", "ankle", "eye", "ear", "bigtoe", "smalltoe", "heel"]) {
    put(`r${part}`, RIGHT[part]);
    put(`l${part}`, mirror(RIGHT[part]));
  }
  // Midline points, top to bottom.
  put("tophead", [MID, 30]);
  put("head", [MID, 38]);
  put("centerhead", [MID, 58]);
  put("nose", [MID, 94]);
  put("neck", [MID, 148]);
  put("centershoulder", [MID, 168]);
  put("spine", [MID, 250]);
  put("hip", [MID, 330]);
  put("midhip", [MID, 330]);
  put("root", [MID, 330]);
  return out;
})();

/** The drawn figure: a head and limb strokes, decoration only. */
export const FIGURE = {
  head: { cx: MID, cy: 80, rx: 50, ry: 58 },
  torso: `M146 168 Q${MID} 150 254 168 L230 330 Q${MID} 342 170 330 Z`,
  limbs: [
    "M146 168 L122 262 L108 350",
    "M254 168 L278 262 L292 350",
    "M170 330 L164 480 L160 614",
    "M230 330 L236 480 L240 614",
    `M${MID} 138 L${MID} 160`,
  ],
  feet: ["M164 638 L130 650 L146 664 L160 614", "M236 638 L270 650 L254 664 L240 614"],
  hands: [
    { cx: 104, cy: 372, r: 20 },
    { cx: 296, cy: 372, r: 20 },
  ],
};
