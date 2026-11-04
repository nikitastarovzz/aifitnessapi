import CopyButton from "@/components/CopyButton";
import { bibtexCitation, plainCitation } from "@/lib/cite";
import { formatDatePt, PT_UI } from "@/lib/translations";

/**
 * "Cite this page", at the foot of every cluster spoke. The citation text is
 * server-rendered — a reader or a crawler gets it without JavaScript — and
 * the buttons only copy what is already on the page.
 *
 * The date is the entry's `updated` stamp: the day the facts were last
 * checked, which is the honest date to cite. A translation cites its own URL
 * and title, and says that the date belongs to the English page, as the
 * verification line at the top of the page does.
 *
 * Markup contract qa reads (CITE-BOX): <section id="cite" data-cite-box>
 * carrying the canonical URL and the date as attributes, and the title,
 * publisher, URL and date in its text.
 */
export default function CiteBox({
  path,
  url,
  title,
  verified,
  locale,
}: {
  path: string;
  /** Absolute canonical URL. */
  url: string;
  title: string;
  /** ISO date the facts were last verified (the entry's `updated`). */
  verified: string;
  locale?: "pt-BR";
}) {
  const pt = locale === "pt-BR";
  const plain = plainCitation({
    title,
    url,
    verified,
    ...(pt ? { verifiedLabel: PT_UI.citeVerified, verifiedSuffix: PT_UI.citeVerifiedSuffix } : {}),
  });
  const bibtex = bibtexCitation({
    path,
    title,
    url,
    verified,
    ...(pt ? { note: `${PT_UI.citeVerified} ${verified}${PT_UI.citeVerifiedSuffix}`, language: "portuguese" } : {}),
  });
  const copied = pt ? PT_UI.citeCopied : "Copied";
  const failed = pt ? PT_UI.citeFailed : "Copy failed — select the text";
  const pre =
    "mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-xs text-[var(--fg)]";

  return (
    <section
      id="cite"
      data-cite-box
      data-cite-url={url}
      data-cite-verified={verified}
      aria-labelledby="cite-heading"
      className="mt-12 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
    >
      <h2 id="cite-heading" className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
        {pt ? PT_UI.cite : "Cite this page"}
      </h2>
      <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-[var(--muted)]">{pt ? PT_UI.citeTitle : "Title"}</dt>
        <dd className="text-[var(--fg)]">{title}</dd>
        <dt className="text-[var(--muted)]">{pt ? PT_UI.citePublisher : "Publisher"}</dt>
        <dd className="text-[var(--fg)]">AIFitnessAPI</dd>
        <dt className="text-[var(--muted)]">URL</dt>
        <dd className="break-all text-[var(--fg)]">{url}</dd>
        <dt className="text-[var(--muted)]">{pt ? PT_UI.citeVerified : "Last verified"}</dt>
        <dd className="text-[var(--fg)]">
          <time dateTime={verified}>{pt ? `${formatDatePt(verified)}${PT_UI.citeVerifiedSuffix}` : verified}</time>
        </dd>
      </dl>
      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {pt ? PT_UI.citePlain : "Plain text"}
            </span>
            <CopyButton text={plain} label={pt ? PT_UI.citeCopyPlain : "Copy text"} copied={copied} failed={failed} />
          </div>
          <pre className={pre} data-cite-plain>
            {plain}
          </pre>
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">BibTeX</span>
            <CopyButton text={bibtex} label={pt ? PT_UI.citeCopyBibtex : "Copy BibTeX"} copied={copied} failed={failed} />
          </div>
          <pre className={pre} data-cite-bibtex>
            {bibtex}
          </pre>
        </div>
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        {pt ? PT_UI.citeNote : "Cite the page, not the site — every page carries its own verification date."}
      </p>
    </section>
  );
}
