import Link from "next/link";
import { vendorMenu } from "@/lib/vendorMenu";
import { APIS_PATH } from "@/data/apis";

/**
 * Everything the site has about a vendor, on every page about that vendor
 * (data/vendorHubs.ts says which pages, and why the guide is the hub).
 *
 * Two placements. On a vendor's hub the menu leads the page ("top"), so the
 * page Google shows for "<vendor> api" is the one that links all the others.
 * Everywhere else it closes the article before the CTA ("end"), one menu for
 * however many vendors the page belongs to. Each renders nothing on a page
 * that is no vendor's.
 *
 * The data attributes are what qa reads (the VENDOR-HUB gates): which
 * vendors a menu covers, where it sits, and which page each entry names.
 */

/** A group longer than this folds behind its count, unless it holds this page. */
const FOLD_OVER = 6;

function joinNames(names: string[]): string {
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export default function VendorHubMenu({
  path,
  placement,
}: {
  path: string;
  placement: "top" | "end";
}) {
  const menu = vendorMenu(path, placement);
  if (!menu) return null;

  const names = joinNames(menu.names);
  const apis = menu.names.length > 1 ? "APIs" : "API";
  // A directory entry already has its own "Everything on this site about …"
  // list (every page that covers the product, held by APIS-NO-COVERAGE), so
  // the menu there takes a heading that does not claim the same thing.
  const heading = path.startsWith(`${APIS_PATH}/`)
    ? `${names} ${apis} pages by task`
    : `Everything on this site about the ${names} ${apis}`;
  const headingId = `vendor-menu-${placement}`;
  const hubNote = `This page is the hub for the ${names} ${apis} on this site: every other page about ${
    menu.names.length > 1 ? "them" : "it"
  } is linked here.`;

  return (
    <nav
      aria-labelledby={headingId}
      data-vendor-menu={menu.ids.join(" ")}
      data-vendor-placement={placement}
      className={`${placement === "top" ? "mt-8" : "mt-12"} rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5`}
    >
      <h2
        id={headingId}
        className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]"
      >
        {heading}
      </h2>
      {placement === "top" && <p className="mt-1 text-sm text-[var(--muted)]">{hubNote}</p>}

      <dl className="mt-3 divide-y divide-[var(--border)] text-sm">
        {menu.groups.map((g) => {
          // On a phone a group is one run of text (label, then its pages
          // separated by dots), so a short group costs a line or two rather
          // than a line per page; from the sm breakpoint up it is a list. A
          // folded group opens as a list everywhere, since opening it is a
          // request to read it.
          const folded = g.items.length > FOLD_OVER;
          const list = (
            <ul className={folded ? "mt-1.5 space-y-1" : "inline sm:block sm:space-y-1"}>
              {g.items.map((i, n) => (
                <li
                  key={i.path}
                  className={`break-words ${folded ? "leading-snug" : "inline leading-relaxed sm:block sm:leading-snug"}`}
                >
                  {!folded && n > 0 && (
                    <span aria-hidden className="px-1.5 text-[var(--muted)] sm:hidden">
                      ·
                    </span>
                  )}
                  {i.current ? (
                    <>
                      <span
                        data-vendor-page={i.path}
                        aria-current="page"
                        className="font-semibold text-[var(--fg)]"
                      >
                        {i.label}
                      </span>
                      <span className="ml-1.5 text-xs text-[var(--muted)]">this page</span>
                    </>
                  ) : (
                    <>
                      <Link
                        href={i.path}
                        data-vendor-page={i.path}
                        className="text-brand-600 hover:text-brand-500"
                      >
                        {i.label}
                      </Link>
                      {i.hub && (
                        <span className="ml-1.5 rounded-full border border-brand-400/40 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                          hub
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          );
          return (
            <div
              key={g.intent}
              className="py-2 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-4 sm:py-2.5"
            >
              <dt className="mr-2 inline text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:mr-0 sm:block sm:leading-5">
                {g.label}
              </dt>
              <dd className={folded ? "mt-1 sm:mt-0" : "inline sm:block"}>
                {folded ? (
                  <details open={g.items.some((i) => i.current)}>
                    <summary className="cursor-pointer select-none text-[var(--fg)] hover:text-brand-600">
                      {`${g.items.length} pages`}
                    </summary>
                    {list}
                  </details>
                ) : (
                  list
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </nav>
  );
}
