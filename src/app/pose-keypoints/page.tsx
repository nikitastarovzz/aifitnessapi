import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import { POSE_CROSSWALK, POSE_SCHEMES, POSE_SOURCES } from "@/data/poseKeypoints";
import {
  CROSSWALK_RULE,
  MODEL_PAGES,
  POSE_BASE,
  POSE_FETCHED,
  crosswalkId,
  getScheme,
  hubTotals,
  indexClash,
  listOf,
  pointId,
  pointLabel,
  sameNameAndIndex,
  schemeH1,
  schemePath,
  schemeUnit,
  unmapped,
} from "@/data/poseKeypointPages";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, count, faqGraph, site, type Faq } from "../error-codes/_shared";

/**
 * Hub for the generated pose keypoint reference: which schemes exist, which
 * models the sources tie to each, and the name-identity crosswalk.
 *
 * Generated from src/data/poseKeypoints.ts (scripts/fetch-pose-keypoints.mjs)
 * through src/data/poseKeypointPages.ts. Every number in the copy is computed
 * from the data; the crosswalk is rendered exactly as generated.
 */

const PATH = POSE_BASE;
const TITLE = "Pose Estimation Keypoint Maps: Indices and Crosswalk";
const FETCHED = POSE_FETCHED;
const T = hubTotals();
const CLASH = indexClash();
const DATASET = "pose-keypoint-maps-2026";

const DESCRIPTION = `Every index of ${T.schemes} pose keypoint schemes (COCO 17, BlazePose 33, ML Kit, OpenPose, Apple Vision) read from source, with a name-only crosswalk.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const openpose = POSE_SCHEMES.filter((s) => s.family === "OpenPose");
const openposeRows = POSE_CROSSWALK.filter((r) => r.cells.every((c) => openpose.some((s) => s.slug === c.scheme)));
const mlkit = getScheme("ml-kit");
const blaze = getScheme("blazepose-33");
const mouthPairs = mlkit && blaze ? unmapped(mlkit).map((p) => ({ ml: p, mp: blaze.points.find((q) => q.index === p.index) })) : [];
const coco = getScheme("coco-17");
const sharingCoco = POSE_SCHEMES.filter((s) => s.slug !== "coco-17" && coco && coco.points.every((p) => s.points.some((q) => q.key === p.key)));

const FAQS: Faq[] = [
  {
    q: "What is a keypoint scheme in pose estimation?",
    a: `It is the fixed list of body points a pose model outputs and the order it outputs them in, so code reads a point by its position.${
      CLASH ? ` The same number means different points in different schemes: index ${CLASH.index} is ${CLASH.a} but ${CLASH.b}.` : ""
    } This reference reads ${T.schemes} schemes from their own source files on ${FETCHED} and lists all ${T.points} points exactly as those sources spell them.`,
  },
  {
    q: "Can pose keypoints be converted between COCO, MediaPipe and OpenPose?",
    a: `Only where the names agree, and this site joins nothing else: ${CROSSWALK_RULE} That gives ${T.rows} shared rows across the ${T.schemes} schemes and leaves ${T.unmappedPoints} of ${T.points} points unmapped. ${
      sharingCoco.length ? `Every COCO 17 name appears in ${listOf(sharingCoco.map((s) => s.shortName))}. ` : ""
    }OpenPose spells sides as L and R (RShoulder), so ${openposeRows.length} of its rows join only its own two models.`,
  },
  {
    q: "Do ML Kit and MediaPipe use the same 33 pose landmarks?",
    a: mlkit && blaze
      ? `Nearly. Both number their landmarks 0 to ${mlkit.points.length - 1}, and ${sameNameAndIndex(mlkit, blaze)} of ML Kit's ${mlkit.points.length} PoseLandmark constants carry exactly the name MediaPipe's PoseLandmark enum uses at the same index. The ${count(mouthPairs.length, "exception")} ${mouthPairs.length === 1 ? "is" : "are"} ${listOf(
          mouthPairs.map((x) => `${x.ml.name} (ML Kit ${x.ml.index}) against ${x.mp?.name ?? "nothing"} (MediaPipe ${x.mp?.index ?? "–"})`),
        )}: the words are in a different order, so this reference leaves them unmapped instead of assuming they are the same point.`
      : "Both schemes are listed on this page.",
  },
];

export default function PoseKeypointsHub() {
  const url = absoluteUrl(PATH);
  return (
    <Container className="py-14">
      <JsonLd
        data={articleGraph({
          path: PATH,
          title: TITLE,
          description: DESCRIPTION,
          modified: FETCHED,
          section: "AI Motion",
          pageType: "CollectionPage",
          parts: POSE_SCHEMES.map((s) => ({ name: schemeH1(s), path: schemePath(s) })),
        })}
      />
      <JsonLd data={faqGraph(PATH, FAQS)} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "AI Motion", path: "/motion" },
            { name: "Pose keypoint maps", path: PATH },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Pose estimation keypoint maps
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {count(T.schemes, "scheme")} · {count(T.points, "point")} · {count(T.rows, "crosswalk row")} · read from the
          sources on {FETCHED}
          <ContentAge date={FETCHED} />
        </p>

        <p id="answer" className={CAPSULE}>
          A keypoint scheme is the fixed list of body points a pose model outputs, in a fixed order
          {CLASH ? `: index ${CLASH.index} is ${CLASH.a} but ${CLASH.b}` : ""}. This reference reads {T.schemes} schemes
          from their own source files and lists all {T.points} points exactly as those sources spell them. Its
          crosswalk joins two points only when their names match once lowercased with separators removed, which gives{" "}
          {T.rows} shared rows and leaves {T.unmappedPoints} points unmapped rather than guessed.
        </p>

        <PageActions path={PATH} url={url} title={TITLE} updated={FETCHED} markdown={false} />

        <p className="mt-6 rounded-xl border border-[var(--border)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          Choosing a model comes first:{" "}
          <Link href="/motion/pose-estimation-models-compared" className={LINK}>
            pose estimation models compared
          </Link>{" "}
          and{" "}
          <Link href="/motion/pose-estimation-model-licenses" className={LINK}>
            what each licence allows
          </Link>
          . This page is for the step after, when code has to read point 13 and needs to know which joint that is.
        </p>

        <section id="schemes" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The {T.schemes} schemes</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Each row links to the full index table. “Used by” lists only models a fetched source ties to the scheme;
            the sentence that does so is quoted on the scheme’s page.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Scheme</th>
                  <th className={TH}>Points</th>
                  <th className={TH}>Named in</th>
                  <th className="py-2 font-semibold text-[var(--fg)]">Used by</th>
                </tr>
              </thead>
              <tbody>
                {POSE_SCHEMES.map((s) => (
                  <tr key={s.slug} className="border-b border-[var(--border)] align-top">
                    <td className="py-3 pr-4">
                      <Link href={schemePath(s)} className={LINK}>
                        {s.shortName}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">
                      {s.points.length} {schemeUnit(s)}
                      {s.indexed ? "" : " (no index)"}
                    </td>
                    <td className="py-3 pr-4 text-xs text-[var(--muted)]">{s.nameSource}</td>
                    <td className="py-3 text-xs text-[var(--muted)]">
                      {s.usedBy.map((u, i) => {
                        const page = MODEL_PAGES[u.modelId];
                        return (
                          <span key={u.modelId}>
                            {i > 0 ? "; " : ""}
                            {page ? (
                              <Link href={page.href} className={LINK}>
                                {u.model}
                              </Link>
                            ) : (
                              u.model
                            )}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="crosswalk" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Crosswalk: the same name across schemes</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{CROSSWALK_RULE}</p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A shared row says the names match. It does not say two models put the point in the same place on the
            body. Cells show the index (Apple’s joints have none, so their cells show the name) and the spelling the
            source uses.
          </p>
          <div className="mt-5 overflow-x-auto" data-pose-crosswalk>
            <table className="w-full min-w-[64rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className={TH}>Name</th>
                  {POSE_SCHEMES.map((s) => (
                    <th key={s.slug} data-scheme={s.slug} className={TH}>
                      <Link href={schemePath(s)} className={LINK}>
                        {s.shortName}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POSE_CROSSWALK.map((r) => (
                  <tr key={r.key} id={crosswalkId(r.key)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    <td className="py-2 pr-4 font-mono text-xs font-semibold text-[var(--fg)]">{r.label}</td>
                    {POSE_SCHEMES.map((s) => {
                      const c = r.cells.find((x) => x.scheme === s.slug);
                      if (!c) {
                        return (
                          <td key={s.slug} className="py-2 pr-4 text-xs text-[var(--muted)]">
                            –
                          </td>
                        );
                      }
                      const p = s.points.find((x) => x.name === c.name && x.index === c.index);
                      return (
                        <td key={s.slug} className="py-2 pr-4 text-xs">
                          <Link href={`${schemePath(s)}#${p ? pointId(p) : ""}`} className={LINK}>
                            {c.index ?? c.name}
                          </Link>
                          {c.index !== null && <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">{c.name}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="unmapped" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Points left unmapped ({T.unmappedPoints})</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A point is unmapped when no other scheme here spells its name the same way. That is a statement about
            names, not anatomy; it is the honest result of the rule above, not a judgement that the point has no
            counterpart.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {POSE_SCHEMES.map((s) => {
              const un = unmapped(s);
              return (
                <li key={s.slug}>
                  <Link href={schemePath(s)} className={LINK}>
                    {s.shortName}
                  </Link>
                  :{" "}
                  {un.length === 0
                    ? "none"
                    : un.length <= 12
                      ? un.map(pointLabel).join(", ")
                      : `${un.length} points, from ${pointLabel(un[0])} to ${pointLabel(un.at(-1)!)}`}
                </li>
              );
            })}
          </ul>
        </section>

        <section id="models" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">The models on this site</h2>
          <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[...new Map(Object.values(MODEL_PAGES).map((m) => [m.href, m])).values()].map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className="block rounded-xl border border-[var(--border)] p-4 font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
                >
                  {m.label} →
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Keypoints in two or three dimensions are a separate question, covered in{" "}
            <Link href="/motion/2d-vs-3d-pose-estimation" className={LINK}>
              2D vs 3D pose estimation
            </Link>
            .
          </p>
        </section>

        <section id="download" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Download the maps</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            One row per scheme and point, with the crosswalk key and the schemes it is shared with, under CC BY 4.0:{" "}
            <a href={`/datasets/${DATASET}.json`} className={LINK}>
              {DATASET}.json
            </a>{" "}
            and{" "}
            <a href={`/datasets/${DATASET}.csv`} className={LINK}>
              {DATASET}.csv
            </a>
            , listed with the other{" "}
            <Link href="/datasets" className={LINK}>
              open datasets
            </Link>
            .
          </p>
        </section>

        <FaqSection faqs={FAQS} />

        <section id="sources" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Sources ({POSE_SOURCES.length})</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Read by <code className="font-mono text-xs">scripts/fetch-pose-keypoints.mjs</code>, which refuses to
            publish when a count differs from the last verified read or two sources disagree about the same scheme.
            GitHub files are read on the branch shown; the hash is SHA-256 of the bytes served.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {POSE_SOURCES.map((src) => (
              <li key={src.id} className="break-words">
                <a href={src.page} rel="nofollow" className={LINK}>
                  {src.title}
                </a>
                {src.branch ? ` · ${src.repo}, branch ${src.branch}` : ""} · read {src.fetchedOn}
                {src.sourceUpdated ? ` · page last updated ${src.sourceUpdated}` : ""}
                <span className="font-mono text-[11px]"> · sha256 {src.sha256.slice(0, 12)}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-sm text-[var(--muted)]">
          Compiled by {site.name} from each model’s own published source. The sources remain the authority.
        </p>
      </div>
    </Container>
  );
}
