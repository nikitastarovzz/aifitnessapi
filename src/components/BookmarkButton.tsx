"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

/**
 * Save-for-later, kept entirely in the reader's browser.
 *
 * This site has no accounts and no reason to want one, so a bookmark is a
 * `localStorage` entry and nothing else: no request leaves the page when you
 * star something, and the list cannot follow you to another device. Both the
 * button and /saved say so plainly rather than letting a reader assume a sync
 * that does not exist.
 *
 * Every storage access is wrapped. A browser with site data blocked throws on
 * the `localStorage` getter itself — not on read, on the property access — so
 * an unguarded call takes the whole page down. With storage unavailable the
 * button still toggles for the session and simply forgets on reload, and
 * /saved renders its empty state.
 *
 * The two surfaces live in one file because they are one feature and share
 * the storage shape; splitting them invites the key to be written twice.
 */

const KEY = "afa:bookmarks";
/** Fired on the window when the list changes, so a second copy of the button
 *  (or the /saved list) on the same page stays in step without a store. */
const EVENT = "afa:bookmarks-changed";

export type Bookmark = { path: string; title: string };

function read(): Bookmark[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is Bookmark =>
        !!b &&
        typeof b === "object" &&
        typeof (b as Bookmark).path === "string" &&
        typeof (b as Bookmark).title === "string",
    );
  } catch {
    return [];
  }
}

function write(list: Bookmark[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* private mode, quota, or site data blocked — this session still works. */
  }
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* CustomEvent is universally available; belt and braces for old shells. */
  }
}

/** Subscribe to changes from this tab (EVENT) and from other tabs (storage). */
function useBookmarks(): Bookmark[] | null {
  // `null` until the browser has been read, so the server HTML and the first
  // client render agree.
  const [list, setList] = useState<Bookmark[] | null>(null);

  useEffect(() => {
    const sync = () => setList(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return list;
}

export default function BookmarkButton({ path, title }: { path: string; title: string }) {
  const list = useBookmarks();
  const saved = list !== null && list.some((b) => b.path === path);

  const toggle = useCallback(() => {
    const current = read();
    const next = current.some((b) => b.path === path)
      ? current.filter((b) => b.path !== path)
      : [...current, { path, title }];
    write(next);
  }, [path, title]);

  return (
    <span className="not-prose inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        title={
          saved
            ? "Remove from your saved pages (stored in this browser)"
            : "Save this page in this browser"
        }
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
          saved
            ? "border-brand-400/50 bg-brand-500/10 text-brand-600"
            : "border-[var(--border)] text-[var(--muted)] hover:border-brand-400 hover:text-[var(--fg)]"
        }`}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.2-5.4-2.9-5.4 2.9 1-6.2L3.2 9.5l6.1-.9z" />
        </svg>
        {saved ? "Saved" : "Save"}
      </button>
      {saved && (
        <Link href="/saved" className="text-xs text-[var(--muted)] hover:text-brand-600">
          View saved
        </Link>
      )}
    </span>
  );
}

/**
 * The /saved page's body. Client-only because the whole list is client-only;
 * the route file around it stays a server component so it can set metadata.
 */
export function SavedList() {
  const list = useBookmarks();

  const remove = useCallback((path: string) => {
    write(read().filter((b) => b.path !== path));
  }, []);

  const clear = useCallback(() => {
    write([]);
  }, []);

  const note = (
    <p className="mt-8 text-sm text-[var(--muted)]">
      Saved pages live in this browser&rsquo;s storage. Nothing is sent to us,
      there is no account to sign in to, and the list will not appear on your
      other devices — clearing site data clears it. Browse everything in the{" "}
      <Link href="/site-index" className="text-brand-600 hover:text-brand-500">
        site index
      </Link>
      , or follow one of the{" "}
      <Link href="/paths" className="text-brand-600 hover:text-brand-500">
        reading paths
      </Link>
      .
    </p>
  );

  if (list === null || list.length === 0) {
    return (
      <div>
        <p className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--muted)]">
          Nothing saved yet. The star on any guide adds it here.
        </p>
        {note}
      </div>
    );
  }

  return (
    <div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted)]">
          {list.length} saved {list.length === 1 ? "page" : "pages"}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--fg)]"
        >
          Remove all
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {list.map((b) => (
          <li
            key={b.path}
            className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--border)] p-4 transition-colors hover:border-brand-400"
          >
            <span className="min-w-0">
              <Link href={b.path} className="font-medium text-[var(--fg)] hover:text-brand-600">
                {b.title}
              </Link>
              <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{b.path}</span>
            </span>
            <button
              type="button"
              onClick={() => remove(b.path)}
              aria-label={`Remove ${b.title} from saved pages`}
              className="shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors hover:border-brand-400 hover:text-[var(--fg)]"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {note}
    </div>
  );
}
