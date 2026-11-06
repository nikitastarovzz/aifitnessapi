/**
 * Inline SVG charts for the /research studies. Server-rendered, no script.
 * Colors come from the site's tokens (--fg, --muted, --border) and the brand
 * scale, plus fixed mid-tone fills that read on both the light and the dark
 * background; every bar is also labelled with its value in text, so no
 * reading depends on color alone.
 */

export const SERIES_COLORS = ["var(--color-brand-500)", "#f59e0b", "#94a3b8", "#38bdf8"];

export type BarRow = { label: string; value: number; display?: string; note?: string };

/** Horizontal bars, one per row, value printed at the bar's end. */
export function HBarChart({ rows, title, id }: { rows: BarRow[]; title: string; id: string }) {
  const W = 640;
  const labelW = 230;
  const rowH = 30;
  const top = 6;
  const H = top + rows.length * rowH + 6;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const barW = W - labelW - 150;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`}>
      <title id={`${id}-title`}>{title}</title>
      {rows.map((r, i) => {
        const y = top + i * rowH;
        const w = Math.max(2, (r.value / max) * barW);
        return (
          <g key={r.label}>
            <title>{`${r.label}: ${r.display ?? r.value}${r.note ? ` (${r.note})` : ""}`}</title>
            <text x={labelW - 8} y={y + 19} textAnchor="end" fontSize="13" fill="var(--fg)">
              {r.label.length > 32 ? `${r.label.slice(0, 31)}…` : r.label}
            </text>
            <rect x={labelW} y={y + 5} width={w} height={rowH - 12} rx="4" fill="var(--color-brand-500)" />
            <text x={labelW + w + 6} y={y + 19} fontSize="13" fontWeight="700" fill="var(--fg)">
              {r.display ?? r.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export type StackRow = { label: string; parts: number[] };

/** One stacked horizontal bar per row; the legend names each part. */
export function StackedBars({
  rows,
  legend,
  title,
  id,
}: {
  rows: StackRow[];
  legend: string[];
  title: string;
  id: string;
}) {
  const W = 640;
  const labelW = 200;
  const rowH = 32;
  const top = 6;
  const H = top + rows.length * rowH + 6;
  const max = Math.max(1, ...rows.map((r) => r.parts.reduce((a, b) => a + b, 0)));
  const barW = W - labelW - 40;
  return (
    <figure className="mt-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>{title}</title>
        {rows.map((r, i) => {
          const y = top + i * rowH;
          let x = labelW;
          const total = r.parts.reduce((a, b) => a + b, 0);
          return (
            <g key={r.label}>
              <title>{`${r.label}: ${r.parts.map((p, k) => `${legend[k]} ${p}`).join(", ")}`}</title>
              <text x={labelW - 8} y={y + 20} textAnchor="end" fontSize="13" fill="var(--fg)">
                {r.label}
              </text>
              {r.parts.map((p, k) => {
                if (p === 0) return null;
                const w = (p / max) * barW;
                const seg = (
                  <g key={k}>
                    <rect x={x} y={y + 5} width={Math.max(1, w - 2)} height={rowH - 12} rx="3" fill={SERIES_COLORS[k % SERIES_COLORS.length]} />
                    {w >= 18 && (
                      <text x={x + w / 2 - 1} y={y + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0a0a0a">
                        {p}
                      </text>
                    )}
                  </g>
                );
                x += w;
                return seg;
              })}
              <text x={x + 6} y={y + 20} fontSize="12" fill="var(--muted)">
                {total}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
        {legend.map((l, k) => (
          <span key={l} className="inline-flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SERIES_COLORS[k % SERIES_COLORS.length] }} />
            {l}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
