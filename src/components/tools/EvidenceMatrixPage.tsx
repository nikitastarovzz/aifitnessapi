import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import ToolNextStep from "@/components/ToolNextStep";
import EvidenceMatrixTool from "@/components/tools/EvidenceMatrixTool";
import { resolveMatrix, type EvidenceMatrix } from "@/lib/evidenceMatrix";
import { matrixMethodLines } from "@/lib/audienceTools";
import { toolGraph } from "@/lib/schema";

/**
 * The server half of an evidence-matrix tool page: heading, capsule, the
 * interactive matrix (rendered in full on the server), and how it is built.
 * The cells' quotes are attached at build time, so a cell citing a missing
 * evidence row fails the build (src/lib/evidenceMatrixCore.mjs).
 */
export default function EvidenceMatrixPage({
  matrix,
  path,
  h1,
  crumb,
  capsule,
  title,
  description,
  alternativeHeadline,
  rowLabel,
  children,
}: {
  matrix: EvidenceMatrix;
  path: string;
  h1: string;
  crumb: string;
  capsule: string;
  title: string;
  description: string;
  alternativeHeadline: string;
  rowLabel: string;
  children?: React.ReactNode;
}) {
  const resolved = resolveMatrix(matrix);
  const jsonLd = toolGraph({
    path,
    name: title,
    alternativeHeadline,
    description,
    datePublished: matrix.checkedOn,
    dateModified: matrix.checkedOn,
    webPage: { lastReviewed: matrix.checkedOn },
  });
  const linkCls = "font-medium text-brand-600 hover:text-brand-500";

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: crumb, path },
          ]}
        />
        <ClusterHero label="Comparison Tool" seed={4} />
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">{h1}</h1>
        <p id="answer" className="speakable mt-4 max-w-4xl leading-relaxed text-[var(--muted)]">
          {capsule}
        </p>

        <section data-tool={matrix.id} aria-label={crumb}>
          <EvidenceMatrixTool matrix={resolved} rowLabel={rowLabel} />
        </section>

        {children}

        <section className="mt-14 max-w-4xl">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">How this matrix is built</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            {matrixMethodLines(matrix).map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)]">
            The full write-up, with the context these cells leave out:{" "}
            <Link href={matrix.roundup.href} className={linkCls}>
              {matrix.roundup.label}
            </Link>
            .
          </p>
        </section>

        <ToolNextStep path={path} />
      </div>
    </Container>
  );
}
