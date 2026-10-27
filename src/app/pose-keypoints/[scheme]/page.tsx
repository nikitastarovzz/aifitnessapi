import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContentAge from "@/components/ContentAge";
import PageActions from "@/components/PageActions";
import { POSE_SCHEMES } from "@/data/poseKeypoints";
import { robotsFor } from "@/data/noindex";
import {
  MODEL_PAGES,
  SCHEME_ALTERNATIVES,
  POSE_BASE,
  POSE_FETCHED,
  crosswalkId,
  evidenceSentence,
  getScheme,
  listOf,
  mapped,
  pointId,
  pointLabel,
  schemeCapsule,
  schemeDescription,
  schemeFaqs,
  schemeH1,
  schemePath,
  schemeSources,
  schemeTitle,
  schemeUnit,
  shortNameOf,
  sideMismatches,
  sourceById,
} from "@/data/poseKeypointPages";
import { absoluteUrl } from "@/lib/site";
import { CAPSULE, FaqSection, JsonLd, LINK, TH, articleGraph, faqGraph, site } from "../../error-codes/_shared";

/**
 * One page per keypoint scheme: every point with its index and its name as
 * the source spells it, the models a fetched source ties to the scheme (with
 * that source's sentence), the source's own notes, and where each point sits
 * in the crosswalk. Generated from src/data/poseKeypoints.ts; nothing about
 * a model is written here by hand.
 */

export const dynamicParams = false;

type Params = { scheme: string };

export function generateStaticParams(): Params[] {
  return POSE_SCHEMES.map((s) => ({ scheme: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { scheme } = await params;
  const s = getScheme(scheme);
  if (!s) return {};
  const path = schemePath(s);
  const title = schemeTitle(s);
  const description = schemeDescription(s);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    ...robotsFor(path),
    openGraph: { type: "article", title, description, url: path, modifiedTime: POSE_FETCHED },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Inline `code` spans in a source's sentence rendered as code. */
function SourceText({ text }: { text: string }) {
  const parts = text.split("`");
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <code key={i} className="font-mono text-[13px] text-[var(--fg)]">
            {p}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export default async function PoseSchemePage({ params }: { params: Promise<Params> }) {
  const { scheme } = await params;
  const s = getScheme(scheme);
  if (!s) notFound();

  const path = schemePath(s);
  const url = absoluteUrl(path);
  const title = schemeTitle(s);
  const h1 = schemeH1(s);
  const description = schemeDescription(s);
  const unit = schemeUnit(s);
  const faqs = schemeFaqs(s);
  const main = sourceById(s.sourceId);
  const sources = schemeSources(s);
  const hasAlt = s.points.some((p) => p.altNames.length > 0);
  const hasDescription = s.points.some((p) => p.description);
  const hasGroup = s.points.some((p) => p.group);
  const hasSwap = s.points.some((p) => p.swap);
  const others = POSE_SCHEMES.filter((x) => x.slug !== s.slug);

  return (
    <Container className="py-14">
      <JsonLd data={articleGraph({ path, title: h1, description, modified: POSE_FETCHED, section: "AI Motion" })} />
      <JsonLd data={faqGraph(path, faqs)} />

      <div className="mx-auto max-w-5xl" data-pose-scheme={s.slug}>
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "AI Motion", path: "/motion" },
            { name: "Pose keypoint maps", path: POSE_BASE },
            { name: s.shortName, path },
          ]}
        />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{h1}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {s.points.length} {unit} · from {main.title}
          {main.branch ? ` (branch ${main.branch})` : ""}
          {main.sourceUpdated ? `, page last updated ${main.sourceUpdated}` : ""} · read {main.fetchedOn}
          <ContentAge date={main.fetchedOn} />
        </p>

        <p id="answer" className={CAPSULE}>
          {schemeCapsule(s)}
        </p>

        <PageActions path={path} url={url} title={h1} updated={POSE_FETCHED} markdown={false} />

        <section id="used-by" className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Models that output it</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            {s.usedBy.map((u) => {
              const page = MODEL_PAGES[u.modelId];
              const src = sourceById(u.sourceId);
              return (
                <li key={u.modelId} className="rounded-xl border border-[var(--border)] p-4">
                  <span className="font-semibold text-[var(--fg)]">{u.model}</span>
                  {page && (
                    <>
                      {" "}
                      ·{" "}
                      <Link href={page.href} className={LINK}>
                        {page.label}
                      </Link>
                    </>
                  )}
                  <span className="mt-1 block">
                    Evidence: {evidenceSentence(u)} (
                    <a href={src.page} rel="nofollow" className={LINK}>
                      source
                    </a>
                    ).
                  </span>
                </li>
              );
            })}
          </ul>
          {SCHEME_ALTERNATIVES[s.slug] && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Moving off OpenPose? See{" "}
              <Link href={SCHEME_ALTERNATIVES[s.slug].href} className={LINK}>
                {SCHEME_ALTERNATIVES[s.slug].label}
              </Link>
              .
            </p>
          )}
        </section>

        <section id="points" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            All {s.points.length} {unit}
          </h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Names are copied exactly from {s.nameSource}.{" "}
            {s.indexed
              ? "The index is the position the source assigns."
              : "Apple gives these constants no numeric index, so the rows follow the order of Apple’s documentation."}{" "}
            The last column says whether another scheme on this site spells the same name, by the{" "}
            <Link href={`${POSE_BASE}#crosswalk`} className={LINK}>
              crosswalk rule
            </Link>
            .
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  {s.indexed && <th className={TH}>Index</th>}
                  <th className={TH}>Name</th>
                  {hasAlt && <th className={TH}>Also spelled</th>}
                  {hasGroup && <th className={TH}>Apple’s group</th>}
                  {hasDescription && <th className={TH}>The source’s description</th>}
                  {hasSwap && <th className={TH}>MMPose swap</th>}
                  <th className="py-2 font-semibold text-[var(--fg)]">Same name in</th>
                </tr>
              </thead>
              <tbody>
                {s.points.map((p) => (
                  <tr key={p.key} id={pointId(p)} className="scroll-mt-24 border-b border-[var(--border)] align-top">
                    {s.indexed && <td className="py-2 pr-4 font-mono text-xs text-[var(--muted)]">{p.index}</td>}
                    <td className="py-2 pr-4">
                      {p.docUrl ? (
                        <a href={p.docUrl} rel="nofollow" className="font-mono text-xs font-semibold text-[var(--fg)] hover:text-brand-600">
                          {p.name}
                        </a>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-[var(--fg)]">{p.name}</span>
                      )}
                    </td>
                    {hasAlt && (
                      <td className="py-2 pr-4 font-mono text-xs text-[var(--muted)]">
                        {p.altNames.map((a) => `${a.name} (${sourceById(a.sourceId).title})`).join("; ")}
                      </td>
                    )}
                    {hasGroup && <td className="py-2 pr-4 text-xs text-[var(--muted)]">{p.group}</td>}
                    {hasDescription && <td className="py-2 pr-4 text-xs text-[var(--muted)]">{p.description}</td>}
                    {hasSwap && <td className="py-2 pr-4 font-mono text-xs text-[var(--muted)]">{p.swap ?? ""}</td>}
                    <td className="py-2 text-xs text-[var(--muted)]">
                      {p.sharedWith.length ? (
                        <Link href={`${POSE_BASE}#${crosswalkId(p.key)}`} className={LINK}>
                          {p.sharedWith.map(shortNameOf).join(", ")}
                        </Link>
                      ) : (
                        "Unmapped"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sideMismatches(s).length > 0 && (
            <p className="mt-4 rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-sm text-[var(--fg)]">
              The source’s description of {listOf(sideMismatches(s).map((p) => p.name))} names the opposite side
              from the constant’s own name. The descriptions are copied as printed; the name and index are what the
              source defines.
            </p>
          )}
          {s.excluded.length > 0 && (
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Not counted: the same map also lists {listOf(s.excluded.map(pointLabel))}. The source excludes it from
              the body-part count:{" "}
              {s.excluded.map((e) => (
                <span key={e.name}>“{e.reason}”</span>
              ))}
            </p>
          )}
        </section>

        {s.notes.length > 0 && (
          <section id="notes" className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the sources say about the output</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">Copied from the sources, whitespace collapsed.</p>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
              {s.notes.map((n) => (
                <li key={n.text} className="border-l-4 border-brand-400/60 pl-4">
                  <span className="text-[var(--fg)]">
                    <SourceText text={n.text} />
                  </span>{" "}
                  <span className="text-xs">({sourceById(n.sourceId).title})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="checks" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How this list was checked</h2>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
            {s.crossChecks.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>
              {mapped(s).length} of {s.points.length} names are shared with another scheme; the rest are listed as
              unmapped.
            </li>
          </ul>
          {s.datasetInfo && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              MMPose’s meta info cites the dataset as {s.datasetInfo.title ? `“${s.datasetInfo.title}”` : s.datasetInfo.dataset}
              {s.datasetInfo.year ? ` (${s.datasetInfo.year})` : ""}
              {s.datasetInfo.homepage ? (
                <>
                  {" "}
                  with the homepage{" "}
                  <a href={s.datasetInfo.homepage} rel="nofollow" className={LINK}>
                    {s.datasetInfo.homepage.replace(/^https?:\/\//, "")}
                  </a>
                </>
              ) : null}
              .
            </p>
          )}
          {s.platforms && (
            <p className="mt-4 text-sm text-[var(--muted)]">
              Apple lists the joint-name type as available from{" "}
              {listOf(s.platforms.map((p) => `${p.name} ${p.introducedAt ?? "(no version given)"}`))}.
            </p>
          )}
        </section>

        <section id="other-schemes" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Other schemes</h2>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={schemePath(o)}
                  className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
                >
                  {o.shortName} ({o.points.length})
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={POSE_BASE}
                className="inline-block rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
              >
                All schemes and the crosswalk
              </Link>
            </li>
          </ul>
        </section>

        <FaqSection faqs={faqs} />

        <section id="sources" className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Sources</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {sources.map((src) => (
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
          <p className="mt-6 text-sm text-[var(--muted)]">
            Generated by <code className="font-mono text-xs">scripts/fetch-pose-keypoints.mjs</code> and compiled by{" "}
            {site.name}. The sources remain the authority.
          </p>
        </section>
      </div>
    </Container>
  );
}
