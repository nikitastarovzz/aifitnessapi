import { absoluteUrl } from "@/lib/site";
import { orgRef, WEBSITE_ID } from "@/lib/schema";

/**
 * The standalone-page equivalent of a cluster spoke's answer capsule: the lead
 * paragraph, marked up as the block a voice assistant reads and an LLM quotes.
 *
 * Cluster pages get this from the shared template. Tools, trackers and
 * reference pages were each hand-built and had no equivalent, which meant the
 * pages most likely to be someone's actual answer — the picker, the type
 * reference, the glossary — carried no speakable target at all. Visually it
 * is the same lead paragraph it replaces; the addition is the id, the
 * `speakable` hook and the WebPage node that points at it.
 */
export default function PageSummary({
  path,
  name,
  updated,
  className = "mt-4 max-w-2xl text-lg text-[var(--muted)]",
  children,
}: {
  path: string;
  name: string;
  /** ISO date this page's facts were last reviewed. Omitted rather than
   *  guessed: a review date we did not actually perform is a false claim. */
  updated?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const url = absoluteUrl(path);
  const node = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    isPartOf: { "@id": WEBSITE_ID },
    ...(updated ? { lastReviewed: updated, reviewedBy: orgRef() } : {}),
    publisher: orgRef(),
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
      />
      <p id="answer" className={`speakable ${className}`}>
        {children}
      </p>
    </>
  );
}
