import {
  POSE_CROSSWALK,
  POSE_KEYPOINTS_FETCHED_ON,
  POSE_SCHEMES,
  POSE_SOURCES,
  type PosePoint,
  type PoseScheme,
  type PoseSource,
} from "./poseKeypoints";

/**
 * Page copy for /pose-keypoints and /pose-keypoints/<scheme>, derived from
 * the generated src/data/poseKeypoints.ts. Every count, name and index in the
 * copy is read from that module; what is written here by hand is the
 * framing (titles, the unit word) and which page on this site covers each
 * model the sources name. No fact about a model is introduced here.
 */

export const POSE_BASE = "/pose-keypoints";
export const POSE_FETCHED = POSE_KEYPOINTS_FETCHED_ON;

/** The crosswalk rule, stated once so the hub, the scheme pages and the FAQs agree. */
export const CROSSWALK_RULE =
  "Two points share a crosswalk row only when their names are identical after lowercasing and removing every character that is not a letter or a digit. left_knee, LEFT_KNEE and leftKnee all become leftknee and share a row; MOUTH_LEFT and LEFT_MOUTH, or RShoulder and right_shoulder, do not, and stay unmapped rather than guessed.";

export const schemePath = (s: { slug: string }) => `${POSE_BASE}/${s.slug}`;
export const getScheme = (slug: string): PoseScheme | undefined => POSE_SCHEMES.find((s) => s.slug === slug);
export const sourceById = (id: string): PoseSource => {
  const s = POSE_SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`unknown pose source ${id}`);
  return s;
};
/** Row anchor on a scheme page: the index where the source gives one, else the key. */
export const pointId = (p: PosePoint) => (p.index !== null ? `kp-${p.index}` : `kp-${p.key}`);
export const crosswalkId = (key: string) => `xw-${key}`;
/** How a point is cited: "13 left_knee", or Apple's bare name. */
export const pointLabel = (p: { index: number | null; name: string }) => (p.index !== null ? `${p.index} ${p.name}` : p.name);

export function listOf(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

type Copy = {
  /** What one point is called on the page. */
  unit: string;
  /** The scheme's name inside a sentence or question. */
  label: string;
  title: (s: PoseScheme) => string;
  h1: (s: PoseScheme) => string;
  description: (s: PoseScheme) => string;
};
const ends = (s: PoseScheme) => ({ first: pointLabel(s.points[0]), last: pointLabel(s.points.at(-1)!), n: s.points.length });

/** Hand-written framing per scheme. Every number is read from the data. */
const COPY: Record<string, Copy> = {
  "blazepose-33": {
    unit: "landmarks",
    label: "MediaPipe BlazePose",
    title: (s) => `MediaPipe Pose Landmarks: All ${s.points.length} BlazePose Indices`,
    h1: (s) => `MediaPipe pose landmarks: the ${s.points.length} BlazePose indices`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} MediaPipe PoseLandmark indices, ${first} to ${last}, as Google's source spells them, with TF.js spellings and the models that use them.`;
    },
  },
  "ml-kit": {
    unit: "landmarks",
    label: "ML Kit",
    title: (s) => `ML Kit PoseLandmark Constants: All ${s.points.length} Landmarks`,
    h1: (s) => `ML Kit pose landmarks: the ${s.points.length} PoseLandmark constants`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} ML Kit PoseLandmark constants with Google's values and wording, ${first} to ${last}, and how their names line up with MediaPipe's.`;
    },
  },
  "coco-17": {
    unit: "keypoints",
    label: "COCO",
    title: () => "COCO 17 Keypoints: Index Order for MoveNet, YOLO, RTMPose",
    h1: () => "COCO 17 keypoints: the index order MoveNet, YOLO pose and RTMPose share",
    description: (s) => {
      const { n, first, last } = ends(s);
      return `The ${n} COCO keypoints in index order, ${first} to ${last}, read from MMPose, TF.js and Ultralytics source files, with the models that output them.`;
    },
  },
  "halpe-26": {
    unit: "keypoints",
    label: "Halpe26",
    title: (s) => `Halpe26 Keypoints: All ${s.points.length} Indices Used by RTMPose`,
    h1: (s) => `Halpe26 keypoints: the ${s.points.length} indices of RTMPose's 26-keypoint models`,
    description: (s) =>
      `All ${s.points.length} Halpe26 keypoints in index order from MMPose's halpe26.py, as RTMPose's 26-keypoint body models use them, with a name map to COCO.`,
  },
  "coco-wholebody-133": {
    unit: "keypoints",
    label: "COCO-WholeBody",
    title: (s) => `COCO-WholeBody Keypoints: All ${s.points.length} Indices, Face to Hands`,
    h1: (s) => `COCO-WholeBody keypoints: all ${s.points.length} indices`,
    description: (s) => {
      const face = s.points.filter((p) => /^face-\d+$/.test(p.name));
      return `All ${s.points.length} COCO-WholeBody keypoints from MMPose's coco_wholebody.py: body, feet, ${face[0]?.name} to ${face.at(-1)?.name} and both hands, with a name map.`;
    },
  },
  "openpose-body-25": {
    unit: "body parts",
    label: "OpenPose BODY_25",
    title: (s) => `OpenPose BODY_25 Keypoints: All ${s.points.length} Body Part Indices`,
    h1: (s) => `OpenPose BODY_25 keypoints: the ${s.points.length} body-part indices`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} OpenPose BODY_25 body parts in index order from poseParameters.cpp, ${first} to ${last}, with the JSON output layout and a name map.`;
    },
  },
  "openpose-coco-18": {
    unit: "body parts",
    label: "OpenPose COCO",
    title: (s) => `OpenPose COCO 18 Keypoints: All ${s.points.length} Body Part Indices`,
    h1: (s) => `OpenPose COCO 18 keypoints: the ${s.points.length} body-part indices`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} OpenPose COCO body parts in index order from poseParameters.cpp, ${first} to ${last}, and where they sit against BODY_25.`;
    },
  },
  "apple-vision-2d": {
    unit: "joints",
    label: "Apple Vision 2D",
    title: (s) => `Apple Vision Body Pose Joint Names: All ${s.points.length} (2D)`,
    h1: (s) => `Apple Vision 2D body pose: the ${s.points.length} joint names`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} VNHumanBodyPoseObservation.JointName constants Apple documents, ${first} to ${last}, with Apple's wording and topic groups.`;
    },
  },
  "apple-vision-3d": {
    unit: "joints",
    label: "Apple Vision 3D",
    title: (s) => `Apple Vision 3D Body Pose Joint Names: All ${s.points.length}`,
    h1: (s) => `Apple Vision 3D body pose: the ${s.points.length} joint names`,
    description: (s) => {
      const { n, first, last } = ends(s);
      return `All ${n} VNHumanBodyPose3DObservation.JointName constants, ${first} to ${last}, with Apple's wording, groups and the 3D observation notes.`;
    },
  },
};
const copyOf = (s: PoseScheme): Copy => {
  const c = COPY[s.slug];
  if (!c) throw new Error(`no page copy for pose scheme ${s.slug}`);
  return c;
};
export const schemeUnit = (s: PoseScheme) => copyOf(s).unit;
export const schemeLabel = (s: PoseScheme) => copyOf(s).label;
export const schemeTitle = (s: PoseScheme) => copyOf(s).title(s);
export const schemeH1 = (s: PoseScheme) => copyOf(s).h1(s);
export const schemeDescription = (s: PoseScheme) => copyOf(s).description(s);

/**
 * Which page on this site covers each model a source names. Editorial: the
 * claim that a model uses a scheme comes from the generated `usedBy`
 * evidence, never from this map.
 */
export const MODEL_PAGES: Record<string, { href: string; label: string }> = {
  "mediapipe-pose-landmarker": { href: "/motion/mediapipe-pose-landmarker-models", label: "MediaPipe Pose Landmarker: lite vs full vs heavy" },
  movenet: { href: "/motion/movenet-models", label: "MoveNet Lightning, Thunder and MultiPose" },
  "yolo-pose": { href: "/motion/yolo-pose-models", label: "Ultralytics YOLO pose models" },
  rtmpose: { href: "/motion/rtmpose-models", label: "RTMPose models (MMPose)" },
  "ml-kit": { href: "/motion/ml-kit-pose-detection", label: "ML Kit Pose Detection" },
  openpose: { href: "/motion/openpose-models", label: "OpenPose models" },
  "apple-vision-2d": { href: "/motion/apple-vision-body-pose", label: "Apple Vision body pose" },
  "apple-vision-3d": { href: "/motion/apple-vision-body-pose", label: "Apple Vision body pose" },
};

/**
 * Editorial: a page for readers moving off a scheme's model, keyed by scheme
 * slug. Rendered under "Models that output it"; it adds no claim to the page.
 */
export const SCHEME_ALTERNATIVES: Record<string, { href: string; label: string }> = {
  "openpose-body-25": {
    href: "/alternatives/openpose-alternatives",
    label: "alternatives to OpenPose with BODY_25-style foot points",
  },
};

export const mapped = (s: PoseScheme) => s.points.filter((p) => p.sharedWith.length > 0);
export const unmapped = (s: PoseScheme) => s.points.filter((p) => p.sharedWith.length === 0);
export const shortNameOf = (slug: string) => getScheme(slug)?.shortName ?? slug;

/** "the TF.js pose-detection README says “…”", or an enum docstring quoted as one. */
export function evidenceSentence(u: PoseScheme["usedBy"][number]): string {
  const title = sourceById(u.sourceId).title;
  const doc = /^class (\w+)\(enum\.IntEnum\): """(.*)"""$/.exec(u.evidence);
  if (doc) return `the ${doc[1]} enum in ${title} is documented as “${doc[2]}”`;
  return `${title} says “${u.evidence}”`;
}

/** The answer capsule: 2–4 sentences, every number from the data. */
export function schemeCapsule(s: PoseScheme): string {
  const { n, first, last } = ends(s);
  const unit = schemeUnit(s);
  const users = listOf(s.usedBy.map((u) => u.model));
  const m = mapped(s).length;
  const order = s.indexed
    ? `${s.shortName} has ${n} ${unit}, numbered from ${first} to ${last}, as ${s.nameSource} defines them.`
    : `${s.shortName} has ${n} named joint constants, ${first} to ${last}, on ${s.nameSource.replace(/^the static joint-name constants of /, "")}; Apple gives them no numeric index.`;
  const xw =
    m === n
      ? `All ${n} names match a point in another scheme once lowercased with separators removed.`
      : `${m} of the ${n} names match a point in another scheme once lowercased with separators removed; the other ${n - m} stay unmapped.`;
  return `${order} The sources tie it to ${users}. ${xw} Read from the sources on ${POSE_FETCHED}.`;
}

export type Faq = { q: string; a: string };

/** Per-scheme FAQs. Each question names the scheme, so none repeats site-wide. */
export function schemeFaqs(s: PoseScheme): Faq[] {
  const n = s.points.length;
  const unit = schemeUnit(s);
  const label = schemeLabel(s);
  const faqs: Faq[] = [];

  // 1. The order itself.
  const coco = getScheme("coco-17");
  const face = s.points.filter((p) => /^face-\d+$/.test(p.name));
  if (s.slug === "coco-wholebody-133" && coco && face.length) {
    const head = s.points.slice(0, coco.points.length);
    const feet = s.points.slice(head.length, face[0].order);
    const hands = s.points.slice(face.at(-1)!.order + 1);
    faqs.push({
      q: `How are the ${n} ${label} keypoints ordered?`,
      a: `MMPose's coco_wholebody.py numbers them 0 to ${n - 1}. Indices 0 to ${head.length - 1} use COCO 17's names (${head[0].name} to ${head.at(-1)!.name}); ${feet[0].index} to ${feet.at(-1)!.index} are ${listOf(feet.map((p) => p.name))}; ${face[0].index} to ${face.at(-1)!.index} are ${face[0].name} to ${face.at(-1)!.name}; and ${hands[0].index} to ${hands.at(-1)!.index} run from ${hands[0].name} to ${hands.at(-1)!.name}. The table on this page lists all ${n}.`,
    });
  } else if (s.indexed) {
    faqs.push({
      q: `What are the ${n} ${label} ${unit} in index order?`,
      a: `${s.nameSource[0].toUpperCase()}${s.nameSource.slice(1)} numbers them ${s.points.map(pointLabel).join(", ")}.${
        s.excluded.length ? ` The same map also lists ${listOf(s.excluded.map(pointLabel))}, which the source excludes from the body-part count.` : ""
      }`,
    });
  } else {
    faqs.push({
      q: `What are the ${n} ${label} body pose joint names?`,
      a: `Apple documents ${listOf(s.points.map((p) => p.name))}, filed under the topic groups ${listOf([...new Set(s.points.map((p) => p.group ?? ""))])}. They are named constants with no numeric index.`,
    });
  }

  // 2. Who uses it, with the sentence that says so.
  const users = s.usedBy.map((u) => `${u.model}: ${evidenceSentence(u)}`).join("; ");
  faqs.push({
    q: `Which pose models output ${label} ${unit}?`,
    a: `${users}${/[.!?]”$/.test(users) ? "" : "."} Only models a fetched source ties to this scheme are listed.`,
  });

  // 3. The crosswalk, for this scheme.
  const un = unmapped(s);
  const partners = [...new Set(mapped(s).flatMap((p) => p.sharedWith))].map(shortNameOf);
  faqs.push({
    q: `How do ${label} ${unit} map to other pose keypoint schemes?`,
    a: `By name only. ${mapped(s).length} of the ${n} share an identical name, once lowercased with separators removed, with a point in ${listOf(partners)}${
      un.length === 0
        ? ", so every one has a crosswalk row."
        : un.length <= 12
          ? `; ${listOf(un.map(pointLabel))} ${un.length === 1 ? "does" : "do"} not and ${un.length === 1 ? "stays" : "stay"} unmapped.`
          : `; the other ${un.length}, from ${pointLabel(un[0])} to ${pointLabel(un.at(-1)!)}, stay unmapped.`
    } A shared row means the names match, not that two models place the point in the same spot.`,
  });

  // 4. Coordinates, where the sources state a convention.
  const notes = s.notes
    .filter((x) => !/^VNHuman\w*Observation\.JointName:/.test(x.text))
    .filter((x) => /coordinat|meter|pixel|normaliz|origin|position|relative to|transform|x,y|\bz\b|depth/i.test(x.text))
    .slice(0, 5);
  if (notes.length) {
    faqs.push({
      q: `What coordinates come with ${label} ${unit}?`,
      a: `In the sources' words: ${notes.map((x) => `“${x.text.replace(/`/g, "")}” (${sourceById(x.sourceId).title})`).join("; ")}.`,
    });
  }
  return faqs;
}

/** Hub numbers, computed. */
export function hubTotals() {
  const points = POSE_SCHEMES.reduce((n, s) => n + s.points.length, 0);
  const unmappedPoints = POSE_SCHEMES.reduce((n, s) => n + unmapped(s).length, 0);
  return { schemes: POSE_SCHEMES.length, points, rows: POSE_CROSSWALK.length, unmappedPoints };
}

/** A pair that shows why an index alone is not enough: the same number, a different point. */
export function indexClash(): { index: number; a: string; b: string } | null {
  const coco = getScheme("coco-17");
  const blaze = getScheme("blazepose-33");
  if (!coco || !blaze) return null;
  for (const p of coco.points) {
    const q = blaze.points.find((x) => x.index === p.index);
    if (q && p.index !== null && q.key !== p.key && p.index >= 5) {
      return { index: p.index, a: `${p.name} in ${coco.shortName}`, b: `${q.name} in ${blaze.shortName}` };
    }
  }
  return null;
}

/**
 * Points whose source description names the opposite side from the point's
 * own name (Google describes ML Kit's RIGHT_EYE as "the left eye"). A literal
 * comparison of two strings from the same source, shown so a reader is not
 * misled by the copied wording.
 */
export function sideMismatches(s: PoseScheme): PosePoint[] {
  return s.points.filter((p) => {
    const side = /^(left|right)/i.exec(p.name)?.[1]?.toLowerCase();
    if (!side || !p.description) return false;
    const other = side === "left" ? "right" : "left";
    return new RegExp(`\\b${other}\\b`, "i").test(p.description) && !new RegExp(`\\b${side}\\b`, "i").test(p.description);
  });
}

/** How many of one scheme's points carry the same name at the same index in another. */
export function sameNameAndIndex(a: PoseScheme, b: PoseScheme): number {
  return a.points.filter((p) => p.index !== null && b.points.some((q) => q.index === p.index && q.name === p.name)).length;
}

/** Sources a scheme page cites: the naming source, its cross-checks, its evidence and its notes. */
export function schemeSources(s: PoseScheme): PoseSource[] {
  const ids = [s.sourceId, ...s.checkSources, ...s.usedBy.map((u) => u.sourceId), ...s.notes.map((x) => x.sourceId), ...s.excluded.map((e) => e.sourceId)];
  return [...new Set(ids)].map(sourceById);
}
