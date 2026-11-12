"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * "Did you mean …?" on the 404 (Postel's law, 2026-11-12).
 *
 * A mistyped or half-remembered address is still a clear request:
 * /pricing/fitbit-pricing means /pricing/fitbit-api-pricing. This reads the
 * missing path from the address bar, scores it against every page in the
 * small search index (/search-index-pages.json) by the words the two paths
 * share, and offers the closest one or two only when they are close. Nothing
 * renders until there is a suggestion worth showing, and nothing renders if
 * the index fails to load: the search box and section list below still work.
 */
type Rec = [string, string, string, string, string?];

const parts = (p: string) =>
  p
    .toLowerCase()
    .replace(/\.(html?|php|aspx?)$/, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1);

function score(want: string[], wantSection: string, path: string): number {
  const have = parts(path);
  if (have.length === 0) return 0;
  const set = new Set(have);
  let shared = 0;
  for (const w of want) {
    if (set.has(w)) shared += 1;
    else if (w.length >= 4 && have.some((h) => h.startsWith(w) || w.startsWith(h))) shared += 0.6;
  }
  // Same overlap, prefer the page in the section the reader typed, then the
  // shorter path (closer to what was asked, fewer extra words).
  const section = path.split("/")[1] === wantSection ? 0.5 : 0;
  return shared / Math.max(want.length, have.length) + section * (shared > 0 ? 1 : 0) - have.length * 0.001;
}

export default function NotFoundSuggest() {
  const [best, setBest] = useState<{ path: string; title: string }[]>([]);

  useEffect(() => {
    const here = window.location.pathname;
    const want = parts(here);
    if (want.length === 0) return;
    const wantSection = here.split("/")[1]?.toLowerCase() ?? "";
    let live = true;
    fetch("/search-index-pages.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((recs: Rec[]) => {
        if (!live) return;
        const ranked = recs
          .filter((r) => !r[0].includes("#"))
          .map((r) => ({ path: r[0], title: r[1], s: score(want, wantSection, r[0]) }))
          .filter((r) => r.s >= 0.5)
          .sort((a, b) => b.s - a.s);
        // A second suggestion only when it is nearly as close as the first;
        // otherwise it is a sibling that shares the section word and nothing
        // else, and one right answer beats a right one and a wrong one.
        const top = ranked.filter((r, i) => i === 0 || (i === 1 && r.s >= ranked[0].s * 0.9));
        setBest(top.map(({ path, title }) => ({ path, title })));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (best.length === 0) return null;
  return (
    <div role="status" className="mt-6 rounded-xl border border-brand-400/40 bg-brand-500/5 px-4 py-3">
      <p className="text-sm text-[var(--muted)]">Did you mean</p>
      <ul className="mt-1 space-y-1">
        {best.map((b) => (
          <li key={b.path}>
            <Link href={b.path} className="inline-flex min-h-[44px] items-center font-semibold text-brand-600 hover:text-brand-500 sm:min-h-[32px]">
              {b.title} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
