import Link from "next/link";
import {
  LIBRARY_DATA_TYPES_DATASET,
  LIBRARY_DATA_TYPES_READ_ON,
  librariesReading,
  noneStatementAllowed,
  wrappersOf,
  type Store,
} from "@/data/libraryDataTypes";

/**
 * One line on a HealthKit identifier or Health Connect record page: which of
 * the tracked wrapper libraries map this type, each with the source line it
 * was read from (src/data/healthLibrarySupport.ts). The negative line is shown
 * only when every candidate library for the store was parsed.
 */
export default function WrappedBy({ store, id, name }: { store: Store; id: string; name: string }) {
  const readers = librariesReading(store);
  if (readers.length === 0) return null;
  const wrappers = wrappersOf(store, id);
  if (wrappers.length === 0 && !noneStatementAllowed(store)) return null;
  const method = (
    <>
      {" "}
      <span className="text-[var(--muted)]">
        (of the {readers.length} libraries whose source this site read on {LIBRARY_DATA_TYPES_READ_ON};{" "}
        <Link href={LIBRARY_DATA_TYPES_DATASET} className="text-brand-600 hover:text-brand-500">
          method
        </Link>
        )
      </span>
    </>
  );
  if (wrappers.length === 0) {
    return (
      <p className="mt-3 text-sm text-[var(--fg)]" data-wrapped-by="none">
        No tracked library wraps {name}: none of their type-mapping files names it.{method}
      </p>
    );
  }
  return (
    <p className="mt-3 text-sm text-[var(--fg)]" data-wrapped-by={wrappers.length}>
      <span className="font-semibold">Wrapped by:</span>{" "}
      {wrappers.map((w, i) => (
        <span key={w.slug}>
          {i > 0 && ", "}
          <Link href={`/libraries/${w.slug}#data-types`} className="font-mono font-medium text-brand-600 hover:text-brand-500">
            {w.name}
          </Link>{" "}
          <a href={w.item.url} className="text-xs text-[var(--muted)] hover:text-brand-500" rel="nofollow noreferrer" target="_blank">
            (line {w.item.line})
          </a>
        </span>
      ))}
      .{method}
    </p>
  );
}
