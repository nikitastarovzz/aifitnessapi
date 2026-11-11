"use client";

import Link from "next/link";
import { useEffect } from "react";
import Container from "@/components/Container";

/**
 * The route error boundary. Without this file a render or data error inside
 * any page fell through to Next's unstyled default ("Application error: a
 * client-side exception has occurred"), with no header, no footer and no way
 * on. This keeps the site chrome (it renders inside the root layout) and
 * offers the two things a reader can still do: try again, or go somewhere
 * that works.
 *
 * `reset()` re-renders the segment; it is the right first move for a
 * transient failure (a fetch that timed out, a race in a client tool). The
 * digest is Next's server-side error id, shown so a report can be matched to
 * a log line without the reader pasting a stack trace.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the browser console for anyone debugging; nothing is sent
    // anywhere from here.
    console.error(error);
  }, [error]);

  return (
    <Container className="py-20">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-brand-600">Something broke</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--fg)]">
          This page hit an error
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          The rest of the site is fine. Trying again usually works; if it
          doesn&rsquo;t, the links below lead somewhere that does.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-[var(--muted)]">
            Error id: <code className="font-mono">{error.digest}</code>
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-brand-400"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-brand-400"
          >
            Search the site
          </Link>
        </div>
        <p className="mt-8 text-sm text-[var(--muted)]">
          Still stuck? Tell us on the{" "}
          <Link href="/corrections" className="underline hover:text-[var(--fg)]">
            corrections page
          </Link>{" "}
          and name the URL.
        </p>
      </div>
    </Container>
  );
}
