import Link from "next/link";
import type { Seg, Section } from "@/lib/plannerPages";

/** The static sections of a planning-tool page (src/lib/plannerPages.ts). */

const linkCls = "font-medium text-brand-600 hover:text-brand-500";

function Segs({ segs }: { segs: Seg[] }) {
  return (
    <>
      {segs.map((s, i) =>
        typeof s === "string" ? (
          <span key={i}>{s}</span>
        ) : s.href.startsWith("/") ? (
          <Link key={i} href={s.href} className={linkCls}>
            {s.text}
          </Link>
        ) : (
          <a key={i} href={s.href} rel="noopener" className={linkCls}>
            {s.text}
          </a>
        ),
      )}
    </>
  );
}

export default function PlannerProse({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((sec) => (
        <section key={sec.heading} className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{sec.heading}</h2>
          {sec.blocks.map((b, i) =>
            b.kind === "p" ? (
              <p key={i} className="mt-4 leading-relaxed text-[var(--muted)]">
                <Segs segs={b.segs} />
              </p>
            ) : (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Segs segs={it} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}
    </>
  );
}
