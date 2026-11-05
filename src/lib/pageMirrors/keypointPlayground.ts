import { POSE_CROSSWALK, POSE_KEYPOINTS_FETCHED_ON, POSE_SCHEMES } from "@/data/poseKeypoints";
import { CROSSWALK_RULE, POSE_BASE, schemePath, sideMismatches } from "@/data/poseKeypointPages";
import { mappingBetween, totalPairs, type KRow, type KScheme } from "@/lib/keypointMapping.mjs";
import { site } from "@/lib/site";
import { interactiveNote, link, moreToolsSection, table, type MirrorDoc } from "./core";

const PATH = "/tools/keypoint-playground";

/** /tools/keypoint-playground.md — mirrors src/app/tools/keypoint-playground/page.tsx,
 *  with the pairs-per-scheme table computed by the same mapping module. */
export function keypointPlaygroundMirror(): MirrorDoc {
  const SCHEMES: KScheme[] = POSE_SCHEMES.map((s) => ({
    slug: s.slug,
    shortName: s.shortName,
    indexed: s.indexed,
    points: s.points.map((p) => ({ index: p.index, name: p.name, key: p.key })),
  }));
  const XW: KRow[] = POSE_CROSSWALK;
  const href = Object.fromEntries(POSE_SCHEMES.map((s) => [s.slug, schemePath(s)]));
  const T = totalPairs(SCHEMES, XW);
  const schemePairs = (SCHEMES.length * (SCHEMES.length - 1)) / 2;
  const count = (a: string, b: string) => mappingBetween(SCHEMES, XW, a, b)!.pairs.length;
  const empty = SCHEMES.flatMap((a, i) =>
    SCHEMES.slice(i + 1)
      .filter((b) => count(a.slug, b.slug) === 0)
      .map((b) => `${a.shortName} and ${b.shortName}`),
  );
  const totalPoints = SCHEMES.reduce((n, s) => n + s.points.length, 0);
  const sideNotes = POSE_SCHEMES.flatMap((s) => {
    const m = sideMismatches(s);
    return m.length ? [{ slug: s.slug, shortName: s.shortName, first: m[0], count: m.length }] : [];
  });

  return {
    path: PATH,
    title: "Pose keypoint playground",
    description:
      "Click a joint and see its index in BlazePose 33, COCO 17, OpenPose, ML Kit and Apple Vision, then copy a TypeScript or Python index map. Name matches only.",
    updated: POSE_KEYPOINTS_FETCHED_ON,
    type: "tool",
    capsule: `Pick a keypoint scheme, click a joint, and see the index and name the same point carries in each of the ${SCHEMES.length} schemes this site reads from source (${SCHEMES.map((s) => s.shortName).join(", ")}), or “not in this scheme”. Then copy a TypeScript or Python dict that maps one scheme’s indices to another’s. Two points are paired only when their names match once lowercased with separators removed, which gives ${T.unordered} pairs across ${T.schemePairsWithAny} of the ${schemePairs} scheme pairs; everything else is listed as unmapped, not guessed.`,
    body: [
      interactiveNote(PATH, "the clickable body and the snippet builder"),
      "",
      "## What the mapping is built from",
      "",
      `Every index and name comes from this site’s ${link("pose keypoint reference", POSE_BASE)}, which reads each scheme from the model’s own source file or documentation (${totalPoints} points, read on ${POSE_KEYPOINTS_FETCHED_ON}). The pairing rule is that reference’s crosswalk, unchanged: ${CROSSWALK_RULE}`,
      "",
      `So a pair says the two sources use the same name. It does not say the two models put the point in the same place on the body, and it does not join points whose names differ only in style. OpenPose spells sides as L and R (LShoulder), so its points pair with its own two schemes and little else; ML Kit writes LEFT_MOUTH where MediaPipe writes MOUTH_LEFT, so those two stay apart.${empty.length > 0 ? ` ${empty.join("; ")} share no name at all, and the snippet says so.` : ""} If you decide two differently named points are the same joint for your model, that is your call to write down; this tool will not make it for you.`,
      "",
      "## Pairs per scheme",
      "",
      "How many points of the row’s scheme have a name match in the column’s. The table is symmetric because each crosswalk row holds at most one point per scheme.",
      "",
      ...table(
        ["Scheme", ...SCHEMES.map((s) => s.shortName)],
        SCHEMES.map((a) => [
          link(a.shortName, href[a.slug]),
          ...SCHEMES.map((b) => (a.slug === b.slug ? "–" : link(String(count(a.slug, b.slug)), `${PATH}?from=${a.slug}&to=${b.slug}`))),
        ]),
      ),
      "## Using the snippet",
      "",
      "- The dict maps the first scheme’s index to the second’s. Apple Vision joints have no numeric index, so on that side the key or value is the joint name string as Apple spells it.",
      "- Points with no name match are named in a comment under the dict and given no value, so a lookup for one of them fails loudly in your code instead of returning a plausible wrong joint.",
      "- Each snippet carries the source date and a link back to the exact view, so a reviewer can check where it came from. The address bar holds the same state (`?from=&to=&joint=`) for sharing.",
      ...(sideNotes.length
        ? [
            `- A name match does not settle which side a source means. ${sideNotes
              .map((n) => `In ${link(n.shortName, href[n.slug])}, the source’s own description of ${n.first.name} reads “${n.first.description}”${n.count > 1 ? ` (and ${n.count - 1} more like it)` : ""}.`)
              .join(" ")} Read the scheme page before converting a trained model’s output.`,
          ]
        : []),
      "",
      "## How this works, and what it sends",
      "",
      `The page is static. The ${SCHEMES.length} schemes and the ${XW.length}-row crosswalk are built into it at deploy time, and every lookup and snippet is computed in your browser by the same module this site’s tests check against the dataset: that every pair emitted is a crosswalk row and that mapping A to B and back returns every point it started from. Nothing is sent anywhere.`,
      "",
      "The body is a drawing. Dots are placed from the words in each point’s name and are not measurements or any model’s output. COCO-WholeBody’s face and hand points are listed under the figure rather than drawn, because names like face-12 do not say where the point sits. The dataset has names and indices but no skeleton connections, so no lines are drawn between points.",
      "",
      `The underlying data is published under CC BY 4.0 on ${link("open datasets", "/datasets")}, and choosing a model in the first place is covered in ${link("pose estimation models compared", "/motion/pose-estimation-models-compared")}.`,
      "",
      ...moreToolsSection(PATH),
      `A free tool from ${site.name}. The full index tables are on the ${link("pose keypoint maps", POSE_BASE)}; every topic in camera-based tracking is at ${link("AI motion tracking", "/motion")}.`,
    ],
  };
}
