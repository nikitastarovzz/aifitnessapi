import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import KinestexNote from "@/components/KinestexNote";
import MoreTools from "@/components/tools/MoreTools";
import KeypointPlayground from "@/components/tools/KeypointPlayground";
import { POSE_CROSSWALK, POSE_KEYPOINTS_FETCHED_ON, POSE_SCHEMES } from "@/data/poseKeypoints";
import { CROSSWALK_RULE, POSE_BASE, schemePath, sideMismatches } from "@/data/poseKeypointPages";
import { mappingBetween, totalPairs, type KRow, type KScheme } from "@/lib/keypointMapping.mjs";
import { absoluteUrl, site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * One drawn body, every keypoint scheme in the generated dataset.
 *
 * The question this answers is the one every pose developer searches: "which
 * index is the left knee in model X, and what is it in model Y". The answer
 * is read from src/data/poseKeypoints.ts (scripts/fetch-pose-keypoints.mjs)
 * and nothing else; the mapping is the dataset's own name-identity
 * crosswalk, computed by src/lib/keypointMapping.mjs, which
 * scripts/keypoint-mapping.test.mjs checks pair by pair against the dataset.
 *
 * The figure is layout (src/lib/keypointLayout.mjs) and the page says so
 * wherever it is shown. The dataset records no skeleton connections, so no
 * edges are drawn.
 */

const PATH = "/tools/keypoint-playground";
const UPDATED = "2026-10-31";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Pose Keypoint Playground: Map Between Models";
const DESCRIPTION =
  "Click a joint and see its index in BlazePose 33, COCO 17, OpenPose, ML Kit and Apple Vision, then copy a TypeScript or Python index map. Name matches only.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "One drawn body, every pose keypoint scheme: pick a joint, see its index in each model, and copy an index map built only from matching names.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

// Only what the client needs: slug, short name and each point's index, name and key.
const SCHEMES: KScheme[] = POSE_SCHEMES.map((s) => ({
  slug: s.slug,
  shortName: s.shortName,
  indexed: s.indexed,
  points: s.points.map((p) => ({ index: p.index, name: p.name, key: p.key })),
}));
const XW: KRow[] = POSE_CROSSWALK;
const SCHEME_HREF = Object.fromEntries(POSE_SCHEMES.map((s) => [s.slug, schemePath(s)]));
const T = totalPairs(SCHEMES, XW);
const SCHEME_PAIRS = (SCHEMES.length * (SCHEMES.length - 1)) / 2;
const EMPTY = SCHEMES.flatMap((a, i) =>
  SCHEMES.slice(i + 1)
    .filter((b) => mappingBetween(SCHEMES, XW, a.slug, b.slug)!.pairs.length === 0)
    .map((b) => `${a.shortName} and ${b.shortName}`),
);
const TOTAL_POINTS = SCHEMES.reduce((n, s) => n + s.points.length, 0);
const NAMES = SCHEMES.map((s) => s.shortName);
// Computed from the sources' own descriptions (ML Kit's RIGHT_EYE is "the left eye").
const SIDE_NOTES = POSE_SCHEMES.flatMap((s) => {
  const m = sideMismatches(s);
  return m.length ? [{ slug: s.slug, shortName: s.shortName, first: m[0], count: m.length }] : [];
});

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

export default function KeypointPlaygroundPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "pose keypoint index converter between COCO, BlazePose, OpenPose, ML Kit and Apple Vision",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: POSE_KEYPOINTS_FETCHED_ON },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Keypoint playground", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={4} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Pose keypoint playground
        </h1>

        <p id="answer" className="speakable mt-4 max-w-3xl leading-relaxed text-[var(--muted)]">
          Pick a keypoint scheme, click a joint, and see the index and name the same point carries in each of
          the {SCHEMES.length} schemes this site reads from source ({NAMES.join(", ")}), or &ldquo;not in this
          scheme&rdquo;. Then copy a TypeScript or Python dict that maps one scheme&rsquo;s indices to
          another&rsquo;s. Two points are paired only when their names match once lowercased with separators
          removed, which gives {T.unordered} pairs across {T.schemePairsWithAny} of the {SCHEME_PAIRS} scheme
          pairs; everything else is listed as unmapped, not guessed.
        </p>

        <section data-tool="keypoint-playground" aria-label="Pose keypoint playground">
          <KeypointPlayground
            schemes={SCHEMES}
            crosswalk={XW}
            fetchedOn={POSE_KEYPOINTS_FETCHED_ON}
            rule={CROSSWALK_RULE}
            schemeHref={SCHEME_HREF}
            canonical={absoluteUrl(PATH)}
          />
        </section>

        <div className="max-w-3xl">
          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the mapping is built from</h2>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              Every index and name comes from this site&rsquo;s{" "}
              <Link href={POSE_BASE} className={linkCls}>
                pose keypoint reference
              </Link>
              , which reads each scheme from the model&rsquo;s own source file or documentation ({TOTAL_POINTS}{" "}
              points, read on {POSE_KEYPOINTS_FETCHED_ON}). The pairing rule is that reference&rsquo;s
              crosswalk, unchanged: {CROSSWALK_RULE}
            </p>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              So a pair says the two sources use the same name. It does not say the two models put the point in
              the same place on the body, and it does not join points whose names differ only in style. OpenPose
              spells sides as L and R (LShoulder), so its points pair with its own two schemes and little else;
              ML Kit writes LEFT_MOUTH where MediaPipe writes MOUTH_LEFT, so those two stay apart.
              {EMPTY.length > 0 ? ` ${EMPTY.join("; ")} share no name at all, and the snippet says so.` : ""} If
              you decide two differently named points are the same joint for your model, that is your call to
              write down; this tool will not make it for you.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Pairs per scheme</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              How many points of the row&rsquo;s scheme have a name match in the column&rsquo;s. The table is
              symmetric because each crosswalk row holds at most one point per scheme.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-xs" data-kp-matrix>
                <thead>
                  <tr className="border-b border-[var(--border)] text-left">
                    <th className="py-2 pr-2 font-semibold text-[var(--fg)]">Scheme</th>
                    {SCHEMES.map((s) => (
                      <th key={s.slug} className="py-2 pr-2 font-semibold text-[var(--fg)]">
                        {s.shortName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SCHEMES.map((a) => (
                    <tr key={a.slug} className="border-b border-[var(--border)]">
                      <th scope="row" className="py-2 pr-2 text-left font-semibold text-[var(--fg)]">
                        <Link href={SCHEME_HREF[a.slug]} className={linkCls}>
                          {a.shortName}
                        </Link>
                      </th>
                      {SCHEMES.map((b) => {
                        if (a.slug === b.slug)
                          return (
                            <td key={b.slug} className="py-2 pr-2 text-[var(--muted)]">
                              –
                            </td>
                          );
                        const n = mappingBetween(SCHEMES, XW, a.slug, b.slug)!.pairs.length;
                        return (
                          <td key={b.slug} className="py-2 pr-2">
                            <a
                              href={`${PATH}?from=${a.slug}&to=${b.slug}`}
                              className={n ? linkCls : "text-[var(--muted)]"}
                            >
                              {n}
                            </a>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Using the snippet</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
              <li>
                The dict maps the first scheme&rsquo;s index to the second&rsquo;s. Apple Vision joints have no
                numeric index, so on that side the key or value is the joint name string as Apple spells it.
              </li>
              <li>
                Points with no name match are named in a comment under the dict and given no value, so a lookup
                for one of them fails loudly in your code instead of returning a plausible wrong joint.
              </li>
              <li>
                Each snippet carries the source date and a link back to the exact view, so a reviewer can check
                where it came from. The address bar holds the same state (
                <code className="font-mono text-sm">?from=&amp;to=&amp;joint=</code>) for sharing.
              </li>
              {SIDE_NOTES.length > 0 && (
                <li>
                  A name match does not settle which side a source means.{" "}
                  {SIDE_NOTES.map((n, i) => (
                    <span key={n.slug}>
                      {i > 0 ? " " : ""}
                      In{" "}
                      <Link href={SCHEME_HREF[n.slug]} className={linkCls}>
                        {n.shortName}
                      </Link>
                      , the source&rsquo;s own description of {n.first.name} reads <q>{n.first.description}</q>
                      {n.count > 1 ? ` (and ${n.count - 1} more like it)` : ""}.
                    </span>
                  ))}{" "}
                  Read the scheme page before converting a trained model&rsquo;s output.
                </li>
              )}
            </ul>
          </section>

          <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
              <p>
                The page is static. The {SCHEMES.length} schemes and the {XW.length}-row crosswalk are built into
                it at deploy time, and every lookup and snippet is computed in your browser by the same module
                this site&rsquo;s tests check against the dataset: that every pair emitted is a crosswalk row and
                that mapping A to B and back returns every point it started from. Nothing is sent anywhere.
              </p>
              <p>
                The body is a drawing. Dots are placed from the words in each point&rsquo;s name and are not
                measurements or any model&rsquo;s output. COCO-WholeBody&rsquo;s face and hand points are listed
                under the figure rather than drawn, because names like face-12 do not say where the point sits.
                The dataset has names and indices but no skeleton connections, so no lines are drawn between
                points.
              </p>
              <p>
                The underlying data is published under CC BY 4.0 on{" "}
                <Link href="/datasets" className={linkCls}>
                  open datasets
                </Link>
                , and choosing a model in the first place is covered in{" "}
                <Link href="/motion/pose-estimation-models-compared" className={linkCls}>
                  pose estimation models compared
                </Link>
                .
              </p>
            </div>
          </details>

          <KinestexNote path={PATH} />

          <MoreTools path={PATH} />

          <p className="mt-8 text-sm text-[var(--muted)]">
            A free tool from {site.name}. The full index tables are on the{" "}
            <Link href={POSE_BASE} className={linkCls}>
              pose keypoint maps
            </Link>
            ; every topic in camera-based tracking is at{" "}
            <Link href="/motion" className={linkCls}>
              AI motion tracking
            </Link>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
