/**
 * Hand-authored mechanism diagrams for /architecture spokes.
 *
 * One diagram per slug, drawn from that page's own text: the same terms, the
 * same worked examples, the same numbers. Nothing here asserts a fact the page
 * does not — where a page is qualitative (volume shapes, priority order), the
 * drawing stays qualitative and carries no invented axis values.
 *
 * Server component. Pure inline SVG: no client JS, no images, no gradients, no
 * drop shadows, no text baked as paths. Colors are limited to the theme tokens
 * in globals.css (--fg, --muted, --border, --surface, --bg) plus the emitted
 * brand scale (--color-brand-400/500/600), so both themes work without a
 * second palette. Labels inherit the site font stack.
 */

type Tone = "fg" | "muted";

function Defs() {
  return (
    <defs>
      <marker
        id="ad-tip"
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="var(--muted)" />
      </marker>
      <marker
        id="ad-tip-brand"
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="var(--color-brand-600)" />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  w,
  h,
  lines,
  accent = false,
  dashed = false,
  size = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  accent?: boolean;
  dashed?: boolean;
  size?: number;
}) {
  const gap = size + 3;
  const first = y + h / 2 - ((lines.length - 1) * gap) / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={accent ? "var(--color-brand-500)" : "var(--bg)"}
        fillOpacity={accent ? 0.12 : 1}
        stroke={accent ? "var(--color-brand-500)" : "var(--border)"}
        strokeWidth="1.25"
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={first + i * gap}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size}
          fill="var(--fg)"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Tx({
  x,
  y,
  children,
  anchor = "start",
  size = 12,
  tone = "fg",
  bold = false,
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
  tone?: Tone;
  bold?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={bold ? 600 : 400}
      fill={tone === "muted" ? "var(--muted)" : "var(--fg)"}
    >
      {children}
    </text>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  brand = false,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  brand?: boolean;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={brand ? "var(--color-brand-600)" : "var(--muted)"}
      strokeWidth="1.25"
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd={brand ? "url(#ad-tip-brand)" : "url(#ad-tip)"}
    />
  );
}

function Path({
  d,
  brand = false,
  dashed = false,
  tip = true,
}: {
  d: string;
  brand?: boolean;
  dashed?: boolean;
  tip?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={brand ? "var(--color-brand-600)" : "var(--muted)"}
      strokeWidth="1.25"
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd={tip ? (brand ? "url(#ad-tip-brand)" : "url(#ad-tip)") : undefined}
    />
  );
}

/** A labelled band on a timeline: filled bar plus a caption inside it. */
function Band({
  x,
  y,
  w,
  h,
  label,
  accent = false,
  size = 11,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  accent?: boolean;
  size?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="4"
        fill={accent ? "var(--color-brand-500)" : "var(--muted)"}
        fillOpacity={accent ? 0.16 : 0.1}
        stroke={accent ? "var(--color-brand-500)" : "var(--border)"}
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size}
        fill="var(--fg)"
      >
        {label}
      </text>
    </g>
  );
}

const DIAGRAMS: Record<string, React.JSX.Element> = {
  /* ——— incremental-sync ——————————————————————————————————————— */
  "incremental-sync": (
    <svg
      viewBox="0 0 640 314"
      role="img"
      aria-label="Two sync runs: the persisted anchor or changes token advances, each run returns changed and deleted samples including a retro-edited night, both runs mark the same civil date dirty, and a separate authoritative read recomputes that day's total."
      className="h-auto w-full max-w-full"
    >
      <title>Anchor and token flow across two sync runs into a dirty-day queue</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Sync run 1 — Tuesday 09:00
      </Tx>
      <Box x={0} y={22} w={132} h={46} lines={["persisted cursor", "anchor / token"]} />
      <Arrow x1={136} y1={45} x2={166} y2={45} />
      <Box x={170} y={22} w={196} h={46} lines={["anchored query / getChanges", "→ samples + deletions"]} />
      <Arrow x1={370} y1={45} x2={400} y2={45} />
      <Box x={404} y={22} w={236} h={46} lines={["mark dirty: Tuesday", "(civil date, not a UTC bucket)"]} />

      <Path d="M 66 68 L 66 104" dashed />
      <Tx x={74} y={92} size={11} tone="muted">
        cursor advances — a position in the change log, not a timestamp
      </Tx>

      <Tx x={0} y={124} size={11} tone="muted" bold>
        Sync run 2 — Wednesday
      </Tx>
      <Box x={0} y={134} w={132} h={46} lines={["persisted cursor", "(advanced)"]} />
      <Arrow x1={136} y1={157} x2={166} y2={157} />
      <Box
        x={170}
        y={134}
        w={196}
        h={46}
        lines={["same night revised: 6 h 55 m", "same startDate, new version"]}
      />
      <Arrow x1={370} y1={157} x2={400} y2={157} />
      <Box x={404} y={134} w={236} h={46} lines={["Tuesday dirty again"]} />

      <Path d="M 522 68 L 522 96 L 320 96 L 320 208" brand />
      <Path d="M 522 180 L 522 208" brand />
      <Box
        x={70}
        y={210}
        w={500}
        h={40}
        accent
        lines={["recompute (user, metric, local_date) from raw — statistics read, not the delta feed"]}
      />
      <Arrow x1={320} y1={252} x2={320} y2={272} brand />
      <Box x={130} y={274} w={380} h={32} lines={["rollup write: DO UPDATE (replace), never increment"]} />
    </svg>
  ),

  /* ——— historical-backfill ——————————————————————————————————— */
  "historical-backfill": (
    <svg
      viewBox="0 0 640 232"
      role="img"
      aria-label="A backfill timeline ordered newest-first: narrow recent chunks widening as they go back, a checkpoint committed after each chunk, and a history wall before which data is unknown rather than absent."
      className="h-auto w-full max-w-full"
    >
      <title>Recent-first, widening backfill chunks with a checkpoint each and a history wall</title>
      <Defs />
      <Tx x={0} y={14} size={11} tone="muted" bold>
        Order the work newest-first
      </Tx>
      <Path d="M 600 30 L 96 30" />
      <Tx x={596} y={24} size={11} tone="muted" anchor="end">
        priority 1 runs first
      </Tx>

      <Band x={70} y={44} w={92} h={40} label="wider window" />
      <Band x={166} y={44} w={148} h={40} label="a year at a time" />
      <Band x={318} y={44} w={128} h={40} label="last 90 days" />
      <Band x={450} y={44} w={96} h={40} label="last 30 days" accent />
      <Band x={550} y={44} w={80} h={40} label="last 7 days" accent />

      <line x1={70} y1={98} x2={630} y2={98} stroke="var(--border)" strokeWidth="1.25" />
      <Tx x={630} y={116} size={11} tone="muted" anchor="end">
        today
      </Tx>
      {[162, 314, 446, 546].map((x) => (
        <g key={x}>
          <circle cx={x} cy={98} r="3.5" fill="var(--bg)" stroke="var(--color-brand-500)" strokeWidth="1.5" />
        </g>
      ))}
      <Tx x={78} y={116} size={11} tone="muted">
        checkpoint committed after every chunk — a crash costs one window
      </Tx>

      <line x1={70} y1={36} x2={70} y2={140} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />
      <Tx x={0} y={158} size={11} tone="muted">
        authorized_earliest — the wall this grant may read back to
      </Tx>
      <Tx x={0} y={174} size={11} tone="muted">
        before it: treat as unknown, not as an absence of data
      </Tx>

      <Box
        x={0}
        y={186}
        w={640}
        h={40}
        lines={["one row per chunk: (window_start, window_end, priority, status, page_cursor, attempts)"]}
      />
    </svg>
  ),

  /* ——— background-sync ———————————————————————————————————————— */
  "background-sync": (
    <svg
      viewBox="0 0 640 316"
      role="img"
      aria-label="Three legs of background sync: an opportunistic wake that persists locally and always acknowledges, foreground reconciliation on every app open, and a server that reads two separate timestamps to decide whether a day is unknown rather than zero."
      className="h-auto w-full max-w-full"
    >
      <title>Opportunistic wake, foreground reconciliation, and a server that models unknown days</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Leg 1 — the wake is a hint, not a delivery guarantee
      </Tx>
      <Box x={0} y={22} w={126} h={46} size={11} lines={["observer wake", "at most once per period"]} />
      <Arrow x1={130} y1={45} x2={152} y2={45} />
      <Box x={156} y={22} w={140} h={46} size={11} lines={["anchored query from", "the persisted anchor"]} />
      <Arrow x1={300} y1={45} x2={322} y2={45} />
      <Box x={326} y={22} w={140} h={46} size={11} lines={["write raw + dirty days", "to local storage"]} />
      <Arrow x1={470} y1={45} x2={492} y2={45} />
      <Box x={496} y={22} w={144} h={46} size={11} accent lines={["call the completion", "handler on every path"]} />
      <Path d="M 568 68 L 568 84 L 63 84 L 63 70" />
      <Tx x={320} y={100} size={11} tone="muted" anchor="middle">
        three unacknowledged deliveries and HealthKit stops sending background updates
      </Tx>

      <Tx x={0} y={126} size={11} tone="muted" bold>
        Leg 2 — foreground reconciliation (Health Connect has no push at all)
      </Tx>
      <Box x={0} y={136} w={168} h={44} size={11} lines={["app opens / foreground", "lifecycle event"]} />
      <Arrow x1={172} y1={158} x2={196} y2={158} />
      <Box x={200} y={136} w={196} h={44} size={11} lines={["read up to the current cursor", "unconditionally"]} />
      <Arrow x1={400} y1={158} x2={424} y2={158} />
      <Box x={428} y={136} w={212} h={44} size={11} lines={["recompute the days those", "samples touched"]} />

      <Tx x={0} y={206} size={11} tone="muted" bold>
        Leg 3 — the server decides what it does not know
      </Tx>
      <Box
        x={0}
        y={216}
        w={252}
        h={54}
        size={11}
        lines={["sync_state per user, provider, metric:", "last_client_checkin_at", "last_sample_at"]}
      />
      <Arrow x1={256} y1={232} x2={300} y2={232} />
      <Arrow x1={256} y1={256} x2={300} y2={256} />
      <Box
        x={304}
        y={212}
        w={336}
        h={36}
        size={11}
        lines={["a device checked in, no samples → measured"]}
      />
      <Box
        x={304}
        y={252}
        w={336}
        h={44}
        size={11}
        accent
        lines={["silence past the expected interval → unknown,", "suppressed from streaks, goals and weekly emails"]}
      />
    </svg>
  ),

  /* ——— webhook-ingestion ———————————————————————————————————— */
  "webhook-ingestion": (
    <svg
      viewBox="0 0 640 320"
      role="img"
      aria-label="A webhook pipeline where the endpoint verifies raw bytes, deduplicates the delivery and acknowledges in milliseconds, a resolver collapses repeated notifications into one window fetch job, and the effect is a versioned replace, with a dead-letter queue and a reconciliation sweep alongside."
      className="h-auto w-full max-w-full"
    >
      <title>Two idempotency layers: delivery dedupe on the POST, versioned replace on the effect</title>
      <Defs />
      <Box x={0} y={16} w={132} h={48} size={11} lines={["provider POST", "a change pointer"]} />
      <Arrow x1={136} y1={40} x2={158} y2={40} />
      <Box x={162} y={16} w={150} h={48} size={11} lines={["verify the signature", "over the raw bytes"]} />
      <Arrow x1={316} y1={40} x2={338} y2={40} />
      <Box
        x={342}
        y={16}
        w={168}
        h={48}
        size={11}
        accent
        lines={["INSERT (provider, delivery_id)", "ON CONFLICT DO NOTHING"]}
      />
      <Arrow x1={514} y1={40} x2={536} y2={40} />
      <Box x={540} y={16} w={100} h={48} size={11} lines={["2xx, in", "milliseconds"]} />
      <Path d="M 590 64 L 590 82 L 66 82 L 66 66" dashed />
      <Tx x={328} y={98} size={11} tone="muted" anchor="middle">
        a slow handler times out, the provider retries, and the retry is your duplicate
      </Tx>

      <Arrow x1={426} y1={104} x2={426} y2={124} brand />
      <Box
        x={150}
        y={126}
        w={340}
        h={44}
        lines={["resolver: one fetch job per (user, provider, metric, window)"]}
      />
      <Tx x={498} y={152} size={11} tone="muted">
        eleven pings
      </Tx>
      <Tx x={498} y={166} size={11} tone="muted">
        for one day → one job
      </Tx>
      <Arrow x1={320} y1={172} x2={320} y2={192} brand />
      <Box x={150} y={194} w={340} h={40} lines={["fetch worker re-reads that window"]} />
      <Arrow x1={320} y1={236} x2={320} y2={256} brand />
      <Box
        x={40}
        y={258}
        w={560}
        h={50}
        accent
        size={11}
        lines={[
          "versioned replace on (user_id, provider, metric, local_date, source_id)",
          "value = excluded.value where excluded.version > stored version — never a sum",
        ]}
      />

      <Path d="M 150 214 L 96 214 L 96 250" dashed />
      <Tx x={0} y={266} size={11} tone="muted">
        DLQ carries
      </Tx>
      <Tx x={0} y={280} size={11} tone="muted">
        the window,
      </Tx>
      <Tx x={0} y={294} size={11} tone="muted">
        not just the body
      </Tx>
      <Path d="M 490 214 L 560 214 L 560 250" dashed />
      <Tx x={640} y={266} size={11} tone="muted" anchor="end">
        a sweep re-pulls
      </Tx>
      <Tx x={640} y={280} size={11} tone="muted" anchor="end">
        a rolling window
      </Tx>
      <Tx x={640} y={294} size={11} tone="muted" anchor="end">
        whether or not
      </Tx>
      <Tx x={640} y={308} size={11} tone="muted" anchor="end">
        a webhook arrived
      </Tx>
    </svg>
  ),

  /* ——— identity-and-account-linking ————————————————————————— */
  "identity-and-account-linking": (
    <svg
      viewBox="0 0 640 312"
      role="img"
      aria-label="Three entities kept apart: two product users, each with a connection row carrying state, both pointing at one provider grant, which owns the data sources that samples are attributed to."
      className="h-auto w-full max-w-full"
    >
      <title>User, connection, provider account and data source as separate tables</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Two accounts in your product can share one provider login
      </Tx>
      <Box x={40} y={22} w={200} h={40} lines={["app_user A"]} />
      <Box x={400} y={22} w={200} h={40} lines={["app_user B"]} />
      <Arrow x1={140} y1={64} x2={140} y2={82} />
      <Arrow x1={500} y1={64} x2={500} y2={82} />
      <Box
        x={20}
        y={84}
        w={240}
        h={54}
        size={11}
        lines={["connection", "state · state_reason · last_call_ok_at", "last_sample_at · history_floor"]}
      />
      <Box
        x={380}
        y={84}
        w={240}
        h={54}
        size={11}
        lines={["connection", "state · state_reason · last_call_ok_at", "last_sample_at · history_floor"]}
      />
      <Path d="M 140 138 L 140 160 L 320 160 L 320 176" brand />
      <Path d="M 500 138 L 500 160 L 320 160" brand tip={false} />
      <Box
        x={150}
        y={178}
        w={340}
        h={48}
        size={11}
        accent
        lines={["provider_account — one grant", "(provider + external_user_id, or install_id)"]}
      />
      <Arrow x1={250} y1={228} x2={210} y2={244} />
      <Arrow x1={390} y1={228} x2={430} y2={244} />
      <Box x={60} y={246} w={280} h={44} size={11} lines={["data_source — source_key", "(bundle id / packageName / device)"]} />
      <Box x={356} y={246} w={280} h={44} size={11} lines={["data_source — source_key", "(a second watch, scale or app)"]} />
      <Tx x={0} y={302} size={11} tone="muted">
        samples carry connection_id and data_source_id — a merge repoints the connection and no sample moves
      </Tx>
    </svg>
  ),

  /* ——— deduplicate-health-data ——————————————————————————————— */
  "deduplicate-health-data": (
    <svg
      viewBox="0 0 640 292"
      role="img"
      aria-label="The page's worked example: watch and phone step samples overlapping, the day cut at every sample boundary, the highest-priority source winning each sub-interval with its value attributed pro rata, giving 6,000 where the naive sum gives 7,500."
      className="h-auto w-full max-w-full"
    >
      <title>Cutting the day at every boundary and taking the highest-priority source per sub-interval</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Priority for this user and metric: Watch 1, Phone 2
      </Tx>

      {[70, 150, 230, 390, 470].map((x) => (
        <line key={x} x1={x} y1={26} x2={x} y2={196} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
      ))}
      <Tx x={0} y={50} size={11} tone="muted">
        Watch
      </Tx>
      <Band x={70} y={34} w={160} h={30} label="W1  1,400" accent />
      <Band x={230} y={34} w={160} h={30} label="W2  1,100" accent />
      <Tx x={0} y={88} size={11} tone="muted">
        Phone
      </Tx>
      <Band x={150} y={72} w={320} h={30} label="P1  2,000" />
      <Band x={520} y={72} w={100} h={30} label="P2  3,000" />

      <line x1={70} y1={120} x2={478} y2={120} stroke="var(--border)" strokeWidth="1.25" />
      <line x1={512} y1={120} x2={630} y2={120} stroke="var(--border)" strokeWidth="1.25" />
      <path d="M 484 128 L 494 112 M 496 128 L 506 112" stroke="var(--border)" strokeWidth="1.25" fill="none" />
      {[
        [70, "09:00"],
        [150, "09:15"],
        [230, "09:30"],
        [390, "10:00"],
        [470, "10:15"],
        [520, "14:00"],
        [620, "15:00"],
      ].map(([x, label]) => (
        <g key={label as string}>
          <line x1={x as number} y1={116} x2={x as number} y2={124} stroke="var(--muted)" strokeWidth="1" />
          <text x={x as number} y={138} textAnchor="middle" fontSize="10" fill="var(--muted)">
            {label as string}
          </text>
        </g>
      ))}

      <Tx x={0} y={166} size={11} tone="muted">
        winner
      </Tx>
      <Band x={70} y={150} w={80} h={28} label="W1 700" size={10} />
      <Band x={150} y={150} w={80} h={28} label="W1 700" size={10} />
      <Band x={230} y={150} w={160} h={28} label="W2 1,100" size={10} />
      <Band x={390} y={150} w={80} h={28} label="P1 500" size={10} />
      <Band x={520} y={150} w={100} h={28} label="P2 3,000" size={10} />
      <Tx x={0} y={196} size={10} tone="muted">
        each contribution is the sample&rsquo;s value times the sub-interval&rsquo;s share of its own duration
      </Tx>

      <Box x={0} y={210} w={300} h={40} size={11} lines={["naive sum: 7,500 — counts the overlap twice"]} />
      <Box x={340} y={210} w={300} h={40} size={11} accent lines={["resolved: 6,000"]} />
      <Tx x={0} y={272} size={11} tone="muted">
        picking one winning device for the whole day would give 2,500 and delete an afternoon walk
      </Tx>
      <Tx x={0} y={288} size={11} tone="muted">
        the phone&rsquo;s 10:00–10:15 tail survives, because the watch had stopped recording
      </Tx>
    </svg>
  ),

  /* ——— normalize-wearable-data ——————————————————————————————— */
  "normalize-wearable-data": (
    <svg
      viewBox="0 0 640 336"
      role="img"
      aria-label="Four stacked layers of divergence from units up to measurement definition, and the HRV case where HealthKit's SDNN and Health Connect's RMSSD share a metric family but must stay separate measurements because they do not convert."
      className="h-auto w-full max-w-full"
    >
      <title>Four layers of divergence, and why SDNN and RMSSD cannot share a column</title>
      <Defs />
      {[
        ["1. Units — kcal vs kJ, metres vs feet", "a lookup table; the bug is loud"],
        ["2. Field names — StepsRecord vs steps", "one adapter per provider; also loud"],
        ["3. Semantics — where a sleep session starts, what a day is", "no mechanical fix: decide it and write it down"],
        ["4. Measurement definition — SDNN vs RMSSD", "no fix at all: they do not convert"],
      ].map(([left, right], i) => (
        <g key={left}>
          <rect
            x={0}
            y={16 + i * 42}
            width={640}
            height={34}
            rx="8"
            fill={i === 3 ? "var(--color-brand-500)" : "var(--bg)"}
            fillOpacity={i === 3 ? 0.12 : 1}
            stroke={i === 3 ? "var(--color-brand-500)" : "var(--border)"}
            strokeWidth="1.25"
          />
          <text x={14} y={37 + i * 42} fontSize="12" fill="var(--fg)">
            {left}
          </text>
          <text x={626} y={37 + i * 42} fontSize="11" textAnchor="end" fill="var(--muted)">
            {right}
          </text>
        </g>
      ))}

      <Box
        x={0}
        y={198}
        w={290}
        h={48}
        size={11}
        lines={["HealthKit heartRateVariabilitySDNN", "stores SDNN, in ms"]}
      />
      <Box
        x={350}
        y={198}
        w={290}
        h={48}
        size={11}
        lines={["Health Connect HeartRateVariabilityRmssdRecord", "stores RMSSD, in ms"]}
      />
      <line x1={296} y1={222} x2={344} y2={222} stroke="var(--muted)" strokeWidth="1.25" strokeDasharray="4 4" />
      <path d="M 312 210 L 328 234 M 328 210 L 312 234" stroke="var(--color-brand-600)" strokeWidth="1.5" fill="none" />
      <Tx x={320} y={192} size={11} tone="muted" anchor="middle">
        no constant converts one into the other
      </Tx>

      <Arrow x1={145} y1={248} x2={145} y2={268} />
      <Arrow x1={495} y1={248} x2={495} y2={268} />
      <Box x={0} y={270} w={290} h={38} size={11} lines={["measurement = hrv_sdnn"]} />
      <Box x={350} y={270} w={290} h={38} size={11} lines={["measurement = hrv_rmssd"]} />
      <Tx x={320} y={326} size={11} tone="muted" anchor="middle">
        metric_family &ldquo;hrv&rdquo; groups them in the UI; every sum, average and baseline keys on measurement
      </Tx>
    </svg>
  ),

  /* ——— timezones-and-day-boundaries ————————————————————————— */
  "timezones-and-day-boundaries": (
    <svg
      viewBox="0 0 640 258"
      role="img"
      aria-label="One UTC timeline for a Los Angeles to London flight, sliced by two local midnights: a normal 24-hour civil day followed by a 16-hour one, with the offset changing on landing and eight hours of local time that never happen."
      className="h-auto w-full max-w-full"
    >
      <title>One UTC timeline cut by two local midnights: a 24-hour day and a 16-hour day</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        UTC offset in effect
      </Tx>
      <Band x={40} y={20} w={420} h={26} label="−07:00" />
      <Band x={460} y={20} w={160} h={26} label="+01:00" />

      <line x1={40} y1={72} x2={620} y2={72} stroke="var(--border)" strokeWidth="1.25" />
      {[
        [40, "06-10T07:00Z"],
        [376, "06-11T07:00Z"],
        [620, "06-11T23:00Z"],
      ].map(([x, label]) => (
        <g key={label as string}>
          <line x1={x as number} y1={66} x2={x as number} y2={78} stroke="var(--muted)" strokeWidth="1" />
          <text x={x as number} y={64} textAnchor="middle" fontSize="10" fill="var(--muted)">
            {label as string}
          </text>
        </g>
      ))}
      <circle cx={320} cy={72} r="4" fill="var(--bg)" stroke="var(--muted)" strokeWidth="1.5" />
      <circle cx={460} cy={72} r="4" fill="var(--bg)" stroke="var(--color-brand-600)" strokeWidth="1.5" />
      <Tx x={320} y={96} size={10} tone="muted" anchor="middle">
        departs 20:00 local
      </Tx>
      <Tx x={470} y={96} size={10} tone="muted">
        lands 14:00 local
      </Tx>

      <line x1={40} y1={46} x2={40} y2={140} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />
      <line x1={376} y1={46} x2={376} y2={140} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />
      <line x1={620} y1={46} x2={620} y2={140} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />
      <Tx x={330} y={124} size={10} tone="muted" anchor="middle">
        local midnight
      </Tx>

      <Band x={40} y={142} w={336} h={34} label="civil date 2026-06-10 — 24 hours" accent />
      <Band x={376} y={142} w={244} h={34} label="2026-06-11 — 16 hours" accent />

      <Path d="M 460 176 L 460 196" />
      <Tx x={0} y={202} size={11} tone="muted">
        on landing the clock jumps 06:00 → 14:00: eight hours of local time that never happen
      </Tx>
      <Box
        x={0}
        y={212}
        w={640}
        h={44}
        size={11}
        lines={[
          "store all three: the instant, the offset in effect at that instant, and the civil date computed from them",
          "the goal for 2026-06-11 has to be hit in sixteen hours, and any per-hour rate must divide by the real span",
        ]}
      />
    </svg>
  ),

  /* ——— missing-data-and-gaps ————————————————————————————————— */
  "missing-data-and-gaps": (
    <svg
      viewBox="0 0 640 298"
      role="img"
      aria-label="A daily series containing a two-day gap, showing the three states a cell can be in: measured with a value, measured zero because a source covered the day, and unknown with a reason code, with interpolation across the gap drawn as rejected."
      className="h-auto w-full max-w-full"
    >
      <title>One series, one gap, and the three states a user-metric-day cell can hold</title>
      <Defs />
      <line x1={30} y1={160} x2={620} y2={160} stroke="var(--border)" strokeWidth="1.25" />
      {[
        [40, 74, "measured"],
        [112, 96, "measured"],
        [184, 118, "measured"],
        [256, 0, "unknown"],
        [328, 0, "unknown"],
        [400, 104, "measured"],
        [472, 0, "zero"],
        [544, 68, "measured"],
      ].map(([x, h, kind], i) => {
        const bx = x as number;
        const bh = h as number;
        if (kind === "unknown") {
          return (
            <g key={i}>
              <rect
                x={bx}
                y={64}
                width={56}
                height={96}
                rx="6"
                fill="none"
                stroke="var(--border)"
                strokeWidth="1.25"
                strokeDasharray="4 4"
              />
              <text x={bx + 28} y={116} textAnchor="middle" fontSize="10" fill="var(--muted)">
                unknown
              </text>
            </g>
          );
        }
        if (kind === "zero") {
          return (
            <g key={i}>
              <rect x={bx} y={154} width={56} height={6} rx="2" fill="var(--muted)" fillOpacity="0.5" />
              <text x={bx + 28} y={146} textAnchor="middle" fontSize="10" fill="var(--muted)">
                0
              </text>
            </g>
          );
        }
        return (
          <rect
            key={i}
            x={bx}
            y={160 - bh}
            width={56}
            height={bh}
            rx="4"
            fill="var(--color-brand-500)"
            fillOpacity="0.28"
            stroke="var(--color-brand-500)"
            strokeWidth="1.25"
          />
        );
      })}
      <line x1={212} y1={42} x2={428} y2={56} stroke="var(--muted)" strokeWidth="1.25" strokeDasharray="4 4" />
      <path d="M 310 38 L 326 58 M 326 38 L 310 58" stroke="var(--color-brand-600)" strokeWidth="1.5" fill="none" />
      <Tx x={320} y={28} size={11} tone="muted" anchor="middle">
        interpolation: render-time at most, never stored
      </Tx>
      <Tx x={0} y={180} size={10} tone="muted">
        days →
      </Tx>

      <Box
        x={0}
        y={192}
        w={640}
        h={30}
        size={11}
        lines={["measured, non-zero — we saw data and it totalled something"]}
      />
      <Box
        x={0}
        y={226}
        w={640}
        h={30}
        size={11}
        lines={["measured zero — at least one source covered the day and the total was zero"]}
      />
      <Box
        x={0}
        y={260}
        w={640}
        h={30}
        size={11}
        accent
        lines={["unknown — no evidence: value NULL, a reason code, and never a 0"]}
      />
    </svg>
  ),

  /* ——— time-series-storage ——————————————————————————————————— */
  "time-series-storage": (
    <svg
      viewBox="0 0 640 300"
      role="img"
      aria-label="Late arrivals, retro-edits and platform condensing all land in an immutable raw sample table, push the affected cells onto a dirty-day queue whose primary key collapses a storm into one recompute, and a worker recomputes each daily cell as a pure function of the raw rows."
      className="h-auto w-full max-w-full"
    >
      <title>Immutable raw samples, a dirty-day queue, and recomputed rather than incremented rollups</title>
      <Defs />
      <Box x={0} y={16} w={196} h={30} size={11} lines={["a late arrival flushes"]} />
      <Box x={0} y={54} w={196} h={30} size={11} lines={["the user edits last Tuesday"]} />
      <Box x={0} y={92} w={196} h={44} size={11} lines={["the platform condenses a workout:", "originals deleted, new ids written"]} />
      <Arrow x1={200} y1={31} x2={244} y2={64} />
      <Arrow x1={200} y1={69} x2={244} y2={72} />
      <Arrow x1={200} y1={114} x2={244} y2={82} />

      <Box
        x={248}
        y={40}
        w={392}
        h={64}
        size={11}
        accent
        lines={[
          "health_sample — append plus tombstone, never updated in place",
          "natural key (user, source, metric, start, end) + the provider identifier,",
          "because a deletion arrives as a bare id",
        ]}
      />
      <Arrow x1={444} y1={106} x2={444} y2={128} brand />
      <Box
        x={248}
        y={130}
        w={392}
        h={46}
        size={11}
        lines={["dirty_day (user, metric, local_date) — the primary key", "collapses a storm of retro-edits into one recompute"]}
      />
      <Arrow x1={444} y1={178} x2={444} y2={200} brand />
      <Box x={248} y={202} w={392} h={34} size={11} lines={["recompute worker, newest-first"]} />
      <Arrow x1={444} y1={238} x2={444} y2={258} brand />
      <Box
        x={248}
        y={260}
        w={392}
        h={32}
        size={11}
        lines={["metric_daily — a pure function of the raw rows for that cell"]}
      />

      <Box x={0} y={216} w={196} h={44} size={11} dashed lines={["an incremented counter", "cannot be proven correct"]} />
      <path d="M 204 228 L 220 248 M 220 228 L 204 248" stroke="var(--color-brand-600)" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  /* ——— offline-first-conflict-resolution ————————————————————— */
  "offline-first-conflict-resolution": (
    <svg
      viewBox="0 0 640 292"
      role="img"
      aria-label="The page's worked two-device session: the phone logs a set and later corrects its weight, the watch logs two more sets, both flush at different times, and folding the disjoint events gives three sets regardless of arrival order."
      className="h-auto w-full max-w-full"
    >
      <title>Two offline devices emitting disjoint events, folded into one session</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        One bench session, phone plus watch, no signal
      </Tx>
      <Tx x={0} y={54} size={11} tone="muted">
        phone
      </Tx>
      <Tx x={0} y={124} size={11} tone="muted">
        watch
      </Tx>
      <line x1={46} y1={62} x2={470} y2={62} stroke="var(--border)" strokeWidth="1" />
      <line x1={46} y1={132} x2={470} y2={132} stroke="var(--border)" strokeWidth="1" />

      <Box x={54} y={28} w={150} h={44} size={11} lines={["18:02  e1  set_logged", "A — 60.0 kg × 8"]} />
      <Box x={294} y={28} w={168} h={44} size={11} accent lines={["18:09  e3  field_set", "A.weight_kg = 62.5  base=e1"]} />
      <Path d="M 300 50 L 212 50" />
      <Box x={174} y={106} w={150} h={44} size={11} lines={["18:05  e2  set_logged", "B — 60.0 kg × 8"]} />
      <Box x={330} y={106} w={150} h={44} size={11} lines={["18:11  e4  set_logged", "C — 62.5 kg × 6"]} />

      <Path d="M 466 50 L 512 50 L 512 88" />
      <Path d="M 484 128 L 512 128 L 512 96" />
      <Tx x={476} y={44} size={10} tone="muted">
        flush 18:12
      </Tx>
      <Tx x={476} y={148} size={10} tone="muted">
        flush 19:40
      </Tx>
      <Box x={472} y={158} w={168} h={44} size={11} lines={["server received_at order:", "e1, e3, e2, e4"]} />

      <Arrow x1={320} y1={176} x2={320} y2={198} brand />
      <Box
        x={0}
        y={200}
        w={440}
        h={48}
        size={11}
        accent
        lines={["folded session: A 62.5 kg × 8 · B 60 kg × 8 · C 62.5 kg × 6", "the events are disjoint, so arrival order is irrelevant"]}
      />
      <Tx x={0} y={268} size={11} tone="muted">
        against mutable rows the watch&rsquo;s later flush replaces the phone&rsquo;s view of the session and set A disappears
      </Tx>
      <Tx x={0} y={284} size={11} tone="muted">
        a real conflict is only: same target, same field, neither event descending from the other
      </Tx>
    </svg>
  ),

  /* ——— metric-versioning-and-recompute ——————————————————————— */
  "metric-versioning-and-recompute": (
    <svg
      viewBox="0 0 640 284"
      role="img"
      aria-label="A derived metric drawn as a function of four drifting inputs, stored alongside the formula version, source policy and inputs digest, with two separate recompute triggers: dirty inputs handled automatically and a formula change handled deliberately."
      className="h-auto w-full max-w-full"
    >
      <title>A derived value as a function of four drifting inputs, stamped with its version</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Every argument to the function keeps moving
      </Tx>
      {[
        "raw samples — late, edited, condensed",
        "formula version — you changed f()",
        "day boundary — the civil date rule",
        "source-resolution policy — sometimes changed by the user, not you",
      ].map((label, i) => (
        <g key={label}>
          <Box x={0} y={22 + i * 42} w={300} h={34} size={11} lines={[label]} />
          <Arrow x1={304} y1={39 + i * 42} x2={352} y2={110} />
        </g>
      ))}
      <Box x={356} y={90} w={110} h={44} size={12} accent lines={["f()"]} />
      <Arrow x1={470} y1={112} x2={498} y2={112} brand />
      <Box
        x={430}
        y={144}
        w={210}
        h={76}
        size={11}
        lines={["daily_metric row:", "value (NULL = unknown)", "formula_id + version", "source_policy · inputs_digest"]}
      />
      <Path d="M 502 112 L 535 112 L 535 142" brand tip={false} />

      <Box
        x={0}
        y={196}
        w={400}
        h={38}
        size={11}
        lines={["dirty inputs → a few cells for one user → automatic, no human"]}
      />
      <Box
        x={0}
        y={240}
        w={400}
        h={38}
        size={11}
        lines={["formula change → every user, all history → announced, reversible"]}
      />
      <Tx x={0} y={190} size={11} tone="muted" bold>
        Two triggers, two policies
      </Tx>
    </svg>
  ),

  /* ——— data-quality-monitoring ——————————————————————————————— */
  "data-quality-monitoring": (
    <svg
      viewBox="0 0 640 298"
      role="img"
      aria-label="Total ingest volume keeps its normal weekly shape while one provider's lane flatlines, which is why every freshness and volume check is defined per provider and per metric rather than globally."
      className="h-auto w-full max-w-full"
    >
      <title>A provider going dark, invisible in the total and obvious per provider</title>
      <Defs />
      <Tx x={0} y={12} size={11} tone="muted" bold>
        Total ingest volume — still inside the normal weekly swing
      </Tx>
      <rect x={0} y={20} width={640} height={70} rx="8" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.25" />
      <path
        d="M 16 62 L 76 46 L 136 52 L 196 40 L 256 68 L 316 74 L 376 48 L 436 44 L 496 58 L 556 72 L 616 66"
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.75"
      />
      <line x1={376} y1={24} x2={376} y2={86} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />

      <Tx x={0} y={112} size={11} tone="muted" bold>
        The same window, split per provider
      </Tx>
      {[0, 1, 2, 3].map((i) => {
        const y = 120 + i * 42;
        const dark = i === 2;
        return (
          <g key={i}>
            <rect x={0} y={y} width={640} height={34} rx="8" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.25" />
            <text x={12} y={y + 21} fontSize="11" fill="var(--muted)">
              {dark ? "provider C" : `provider ${["A", "B", "C", "D"][i]}`}
            </text>
            <path
              d={
                dark
                  ? "M 90 22 L 150 14 L 210 20 L 270 12 L 330 24 L 376 18 L 376 30 L 620 30"
                  : "M 90 20 L 150 12 L 210 18 L 270 10 L 330 22 L 390 14 L 450 12 L 510 20 L 570 24 L 620 16"
              }
              transform={`translate(0 ${y})`}
              fill="none"
              stroke={dark ? "var(--color-brand-600)" : "var(--muted)"}
              strokeWidth="1.75"
            />
            {dark && (
              <text x={626} y={y + 21} fontSize="10" textAnchor="end" fill="var(--fg)">
                went dark
              </text>
            )}
          </g>
        );
      })}
      <line x1={376} y1={120} x2={376} y2={274} stroke="var(--color-brand-600)" strokeWidth="1" strokeDasharray="5 4" />
      <Tx x={0} y={288} size={11} tone="muted">
        freshness is the fraction of that provider&rsquo;s active users whose newest sample is older than N hours — never one global threshold
      </Tx>
    </svg>
  ),

  /* ——— data-deletion-and-export ——————————————————————————————— */
  "data-deletion-and-export": (
    <svg
      viewBox="0 0 640 300"
      role="img"
      aria-label="Deletion ordered as five steps beginning with a positive tombstone that fails closed and revocation of the upstream grant, so an incoming webhook is acknowledged and dropped instead of recreating the user, with backups expired rather than purged."
      className="h-auto w-full max-w-full"
    >
      <title>Tombstone first, revoke upstream second, then purge every store and attest</title>
      <Defs />
      {[
        ["1", "write the tombstone — a positive marker; reads, exports and ingest fail closed"],
        ["2", "revoke upstream: the OAuth grant and the webhook subscription, per provider"],
        ["3", "drain or filter the queues at consume time, including the dead-letter queue"],
        ["4", "purge each store from the checked-in registry, checkpointed and resumable"],
        ["5", "attest — one row per store per request, with a timestamp and a row count"],
      ].map(([n, label], i) => (
        <g key={n}>
          <Box x={72} y={16 + i * 46} w={568} h={36} size={11} accent={i < 2} lines={[label]} />
          <circle cx={52} cy={34 + i * 46} r="12" fill="var(--bg)" stroke="var(--border)" strokeWidth="1.25" />
          <text x={52} y={34 + i * 46} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="var(--fg)">
            {n}
          </text>
          {i < 4 && <Arrow x1={52} y1={48 + i * 46} x2={52} y2={68 + i * 46} />}
        </g>
      ))}
      <Path d="M 0 258 L 0 34 L 68 34" dashed />
      <Tx x={0} y={274} size={11} tone="muted">
        a webhook arriving for a tombstoned user is acknowledged and dropped — leave the grant live and ingest recreates the user
      </Tx>
      <Tx x={0} y={292} size={11} tone="muted">
        backups are the exception: bounded retention, re-apply the deletion on restore, and say so where a reviewer can read it
      </Tx>
    </svg>
  ),

  /* ——— caching-fitness-api-responses ————————————————————————— */
  "caching-fitness-api-responses": (
    <svg
      viewBox="0 0 640 288"
      role="img"
      aria-label="Health responses sorted by what makes them wrong: immutable catalogue data on a long shared TTL, settled days invalidated by change events, and the current day never authoritative, plus the midnight trap where an entry written before local midnight serves yesterday's total under today's label."
      className="h-auto w-full max-w-full"
    >
      <title>Three mutability classes, and why a cache key must be a civil date</title>
      <Defs />
      <Box
        x={0}
        y={12}
        w={640}
        h={46}
        size={11}
        lines={[
          "effectively immutable — exercise catalogue, media, provider capability metadata",
          "long TTL, shared tier, versioned key; the only invalidation is a deploy",
        ]}
      />
      <Box
        x={0}
        y={66}
        w={640}
        h={46}
        size={11}
        lines={[
          "mutable but change-signalled — settled days, workout detail, profile-derived aggregates",
          "whatever marks a day dirty also evicts the entry; TTL is the backstop, not the mechanism",
        ]}
      />
      <Box
        x={0}
        y={120}
        w={640}
        h={46}
        size={11}
        accent
        lines={[
          "never authoritative from cache — today's totals, streak state, anything a goal or notification reads",
          "recompute, or cache for seconds and label it with an explicit as-of time",
        ]}
      />

      <Tx x={0} y={190} size={11} tone="muted" bold>
        The midnight trap
      </Tx>
      <line x1={40} y1={224} x2={620} y2={224} stroke="var(--border)" strokeWidth="1.25" />
      <line x1={360} y1={204} x2={360} y2={244} stroke="var(--color-brand-600)" strokeWidth="1.25" strokeDasharray="5 4" />
      <Tx x={360} y={200} size={10} tone="muted" anchor="middle">
        the user&rsquo;s local midnight
      </Tx>
      <Band x={300} y={210} w={120} h={28} label="entry written 23:56" />
      <Tx x={40} y={258} size={11} tone="muted">
        an entry keyed &ldquo;today&rdquo; does not decay — past midnight it is yesterday&rsquo;s number wearing today&rsquo;s label
      </Tx>
      <Tx x={40} y={276} size={11} tone="muted">
        key on the civil date, and cap a current-day entry at the time remaining to the next local midnight
      </Tx>
    </svg>
  ),
};

const CAPTIONS: Record<string, string> = {
  "incremental-sync":
    "The cursor detects which days are now wrong; a separate authoritative read computes what those days total.",
  "historical-backfill":
    "A first sync is a checkpointed job ordered newest-first, not a loop, and it stops at a wall you record rather than infer.",
  "background-sync":
    "A wake is opportunistic, foreground reconciliation is the leg you can reason about, and the server models silence as unknown.",
  "webhook-ingestion":
    "Dedupe the delivery, acknowledge in milliseconds, then make the effect a versioned replace of a bounded window.",
  "identity-and-account-linking":
    "The person, the grant and the source that produced each sample are three tables, so a merge moves a link rather than data.",
  "deduplicate-health-data":
    "Interval-wise resolution: cut the day at every boundary, take the highest-priority covering source, attribute pro rata.",
  "normalize-wearable-data":
    "Units and field names are mappings; semantics and the measurement definition are decisions that have to be recorded.",
  "timezones-and-day-boundaries":
    "A daily total is a calendar question: the day is defined by the offset in effect at each sample's own timestamp.",
  "missing-data-and-gaps":
    "Zero is a measurement, unknown is a fact about your pipeline, and only a covered day licenses the zero.",
  "time-series-storage":
    "Raw stays immutable, the queue collapses repeated invalidations, and every user-facing number is recomputable.",
  "offline-first-conflict-resolution":
    "Field-scoped events with client-generated ids fold to the same session whichever order the flushes arrive in.",
  "metric-versioning-and-recompute":
    "A derived metric is a function plus its version; store what produced the number so the change can be explained.",
  "data-quality-monitoring":
    "Split every check by provider and metric: one source disappearing is smaller than the weekly swing in the total.",
  "data-deletion-and-export":
    "Deletion is an ordered, attested job whose first two steps are the tombstone and the upstream revocation.",
  "caching-fitness-api-responses":
    "Sort responses by what makes them wrong, and never key a user's day on the word today.",
};

export default function ArchDiagram({ slug }: { slug: string }) {
  const diagram = DIAGRAMS[slug];
  if (!diagram) return null;
  const caption = CAPTIONS[slug];

  return (
    <figure
      data-arch-diagram=""
      className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      {diagram}
      {caption && (
        <figcaption className="mt-3 text-xs leading-relaxed text-[var(--muted)]">{caption}</figcaption>
      )}
    </figure>
  );
}
