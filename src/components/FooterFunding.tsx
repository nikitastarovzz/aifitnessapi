"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The sitewide funding credit: one muted line in the footer.
 *
 * ops/GEO.md binds this. The line is itself the disclosure — it says who
 * funds the site in the same sentence that names the product, so a reader
 * who sees only the link still knows the relationship. qa's
 * KINESTEX-UNDISCLOSED holds that on every built page: a footer link to the
 * funder must sit inside [data-funding-line] with "funded by KinesteX" (or
 * the Portuguese "financiada pela KinesteX") in its text. FIRSTPARTY ignores
 * the footer, so this line can never stand in for the in-page disclosure a
 * page that features KinesteX owes.
 *
 * Deliberately small: no logo, no button, no claim about the product beyond
 * what it is. rel="sponsored" because a funder's link repeated on every page
 * is exactly what that value exists to label.
 *
 * Client component for the same reason as HtmlRoot: the root layout cannot
 * see the route, and /pt-br pages get the Portuguese rendering.
 */
export default function FooterFunding() {
  const p = usePathname() ?? "";
  const pt = p === "/pt-br" || p.startsWith("/pt-br/");
  const product = (
    <a href="https://kinestex.com" rel="sponsored" className="underline decoration-dotted underline-offset-2 hover:text-[var(--fg)]">
      KinesteX
    </a>
  );
  const about = (label: string) => (
    <Link href="/about#funding" prefetch={false} {...(pt ? { hrefLang: "en" } : {})} className="whitespace-nowrap hover:text-[var(--fg)]">
      {label}
    </Link>
  );
  return (
    <p data-funding-line className="text-xs text-[var(--muted)]">
      {pt ? (
        <>
          Referência independente, financiada pela {product} (rastreamento de movimento com IA para apps de fitness).{" "}
          {about("Como mantemos a independência →")}
        </>
      ) : (
        <>
          Independent reference, funded by {product} (AI motion tracking for fitness apps).{" "}
          {about("How we stay independent →")}
        </>
      )}
    </p>
  );
}
