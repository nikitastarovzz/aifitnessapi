import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerCapsule from "@/components/AnswerCapsule";
import Newsletter from "@/components/Newsletter";
import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";
import { digests, digestSummary, DIGEST_PATH } from "@/data/digest";

export const metadata: Metadata = {
  title: { absolute: "Monthly digest archive · AIFitnessAPI" },
  description:
    "Every issue of the AIFitnessAPI digest: what changed in the fitness and health API ecosystem each month, and which pages were published or re-verified.",
  alternates: { canonical: DIGEST_PATH },
  openGraph: {
    type: "website",
    title: "Monthly digest archive",
    description:
      "What changed in the fitness and health API ecosystem, month by month — generated from the changes tracker and the pages themselves.",
    url: DIGEST_PATH,
  },
};

export default function DigestIndex() {
  const all = digests();
  const url = absoluteUrl(DIGEST_PATH);
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: "Monthly digest archive",
    description: String(metadata.description),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: all.length,
      itemListElement: all.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.label,
        url: absoluteUrl(`${DIGEST_PATH}/${d.month}`),
      })),
    },
  };

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Digest", path: DIGEST_PATH }]} />
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)]">
          The monthly digest
        </h1>
        <AnswerCapsule>
          What changed in the fitness and health API ecosystem each month, and which pages we
          published or re-checked. Each issue is generated from the changes tracker and from
          the review dates on the pages themselves, which means the archive cannot describe an
          issue that never happened and cannot drift from the site it summarises. Subscribers
          get the same document by email.
        </AnswerCapsule>

        <ul className="mt-10 space-y-4">
          {all.map((d) => (
            <li key={d.month}>
              <Link
                href={`${DIGEST_PATH}/${d.month}`}
                className="flex flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
              >
                <span className="text-lg font-semibold text-[var(--fg)]">{d.label}</span>
                <span className="mt-1 text-sm text-[var(--muted)]">{digestSummary(d)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <Newsletter />
        </div>
      </div>
    </Container>
  );
}
