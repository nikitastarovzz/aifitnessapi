/**
 * Decorative hero banner shown above the H1 on cluster spokes, pillars, and blog
 * posts. Pure inline SVG — no images, no external assets, no client JS — so it
 * stays crisp at any size, respects the CSS-variable theme, and adds visual
 * interest without stock photography. The `seed` (0–8, one per cluster) varies
 * the motif so clusters look distinct; `label` is the eyebrow (cluster name).
 */

// Tiny deterministic PRNG so node positions are stable per seed (no Math.random,
// which is banned in some build contexts and would reshuffle every render).
function rng(seed: number) {
  let s = (seed + 1) * 1013904223;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function ClusterHero({
  label,
  seed = 0,
  title,
}: {
  label: string;
  seed?: number;
  title?: string;
}) {
  const rand = rng(seed);
  // A light "connected nodes" graph motif — evokes APIs / data flow. Nodes sit on
  // a jittered grid so they spread evenly across the wide banner; the seed shifts
  // the jitter and which nodes are hubs, so each cluster gets a distinct network.
  const W = 320;
  const H = 90;
  const cols = 6;
  const rows = 2;
  const nodes: { x: number; y: number; r: number }[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const isHub = rand() > 0.72;
      nodes.push({
        x: ((c + 0.5) / cols) * W + (rand() - 0.5) * 34,
        y: ((r + 0.5) / rows) * H + (rand() - 0.5) * 26,
        r: isHub ? 3.4 + rand() * 1.4 : 1.3 + rand() * 1.2,
      });
    }
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 78) edges.push([i, j]);
    }
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Brand gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 130% at 12% 0%, rgba(16,185,129,0.22), transparent 58%), radial-gradient(120% 130% at 95% 110%, rgba(52,211,153,0.12), transparent 55%)",
        }}
      />
      {/* Node-graph motif */}
      <svg
        aria-hidden
        viewBox="0 0 320 90"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full text-brand-500"
      >
        <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="0.5">
          {edges.map(([a, b], i) => (
            <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} />
          ))}
        </g>
        <g fill="currentColor">
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fillOpacity={n.r > 3 ? 0.5 : 0.28} />
          ))}
        </g>
      </svg>

      <div className="relative px-6 py-9 sm:px-9 sm:py-12">
        <span className="inline-flex items-center rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300">
          {label}
        </span>
        {title && (
          <p className="mt-4 max-w-xl text-sm font-medium text-[var(--muted)]">{title}</p>
        )}
      </div>
    </div>
  );
}
