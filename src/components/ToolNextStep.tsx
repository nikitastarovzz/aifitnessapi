import Link from "next/link";
import { routeLabel } from "@/lib/routeLabel";
import { TOOL_NEXT_STEPS, nextStepCtaId } from "@/data/toolNextSteps";

/**
 * The block a tool page ends with: two or three pages where the tool's
 * question becomes a choice of API (data/toolNextSteps.ts). Server-rendered
 * links with no handler of their own; the data-cta attribute is enough for the
 * delegated listener in CtaTracker to send cta_click, so it adds no client
 * JavaScript. Ids are listed in ops/MEASUREMENT.md.
 */
export default function ToolNextStep({ path }: { path: string }) {
  const targets = TOOL_NEXT_STEPS[path];
  if (!targets) throw new Error(`ToolNextStep: no next steps listed for ${path} in data/toolNextSteps.ts`);
  const links = targets.map((href) => {
    const label = routeLabel(href);
    // A bare path as link text is what the site never prints: fail the build.
    if (!label) throw new Error(`ToolNextStep: ${path} lists ${href}, which routeLabel does not know`);
    return { href, label };
  });

  return (
    <section aria-labelledby="tool-next-step" data-tool-next-step className="mt-14">
      <h2
        id="tool-next-step"
        className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]"
      >
        Next step
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">Turning this into a choice of API:</p>
      <ul className={`mt-3 grid gap-3 ${links.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              data-cta={nextStepCtaId(l.href)}
              data-cta-source="tool-next-step"
              className="flex h-full items-start rounded-xl border border-[var(--border)] p-4 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400 hover:bg-[var(--surface)]"
            >
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
