import Link from "next/link";

/**
 * A cluster's own free download, beside the ask.
 *
 * Every file offered here is compiled from the cluster's published pages by
 * `scripts/build-kit.mjs`, which refuses to build if a fact in the file is
 * not next to its source in the prose. That is what makes it worth offering:
 * it is the section, condensed, not a lead magnet written to be a lead magnet.
 */
export default function ClusterDownload({
  title,
  blurb,
  href,
  filename,
}: {
  title: string;
  blurb: string;
  href: string;
  filename: string;
}) {
  return (
    <aside className="not-prose mt-14 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
        Free download — no email required
      </p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--fg)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{blurb}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={href}
          download
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
        >
          Download {filename}
        </a>
        <Link
          href="/signup"
          className="text-sm font-medium text-brand-600 hover:text-brand-500"
        >
          Or get the whole decision kit →
        </Link>
      </div>
    </aside>
  );
}
