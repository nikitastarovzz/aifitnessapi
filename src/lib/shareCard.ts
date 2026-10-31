/**
 * Share cards drawn on the reader's device.
 *
 * A result worth posting gets a 1200×630 PNG, the size social sites crop link
 * previews to, drawn on a <canvas> in the browser. Nothing is rendered on a
 * server and nothing is uploaded: the card is a local image the reader saves
 * or hands to the system share sheet. That is the zero-cost rule in
 * ops/VIRAL-30-2026-10-31.md (no dynamic OG route, no storage), and it keeps
 * a camera result on the device it was measured on.
 *
 * The look follows src/lib/og-card.tsx, so a card and the page's own link
 * preview read as the same site.
 */

export const CARD_W = 1200;
export const CARD_H = 630;

export type ShareCardSpec = {
  /** Small uppercase line above the headline ("30-second rep challenge"). */
  eyebrow: string;
  /** The result, large ("23 squats"). */
  headline: string;
  /** Up to three supporting lines under the headline. */
  lines: string[];
  /** Bottom-left address, without the scheme ("aifitnessapi.com/challenge"). */
  url: string;
  /** Bottom-right note, usually the date. */
  stamp?: string;
};

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > max && line) {
      out.push(line);
      line = w;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

/** Draw the card onto `canvas`, resizing it to 1200×630. */
export function drawShareCard(canvas: HTMLCanvasElement, spec: ShareCardSpec): void {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const pad = 72;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  const g = ctx.createRadialGradient(CARD_W / 2, 0, 0, CARD_W / 2, 0, CARD_W * 0.6);
  g.addColorStop(0, "#064e3b");
  g.addColorStop(1, "rgba(10,10,10,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Brand row.
  const mark = ctx.createLinearGradient(pad, pad, pad + 44, pad + 44);
  mark.addColorStop(0, "#34d399");
  mark.addColorStop(1, "#059669");
  ctx.fillStyle = mark;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(pad, pad - 8, 44, 44, 12);
  else ctx.rect(pad, pad - 8, 44, 44);
  ctx.fill();
  ctx.fillStyle = "#34d399";
  ctx.font = `600 30px ${FONT}`;
  ctx.textBaseline = "middle";
  ctx.fillText("AIFitnessAPI", pad + 62, pad + 14);

  // Eyebrow, headline, lines — laid out from the top of the middle block.
  ctx.textBaseline = "alphabetic";
  let y = 250;
  ctx.fillStyle = "#6ee7b7";
  ctx.font = `600 26px ${FONT}`;
  ctx.fillText(spec.eyebrow.toUpperCase(), pad, y);

  let size = 96;
  ctx.font = `800 ${size}px ${FONT}`;
  while (ctx.measureText(spec.headline).width > CARD_W - pad * 2 && size > 48) {
    size -= 4;
    ctx.font = `800 ${size}px ${FONT}`;
  }
  y += size + 8;
  ctx.fillStyle = "#f5f5f5";
  ctx.fillText(spec.headline, pad, y);

  ctx.fillStyle = "#a3a3a3";
  ctx.font = `400 30px ${FONT}`;
  // The first line clears the headline's descenders.
  const lines = spec.lines.slice(0, 3).flatMap((l) => wrap(ctx, l, CARD_W - pad * 2)).slice(0, 3);
  lines.forEach((line, i) => {
    y += i === 0 ? 64 : 44;
    ctx.fillText(line, pad, y);
  });

  // Footer.
  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = "#d4d4d4";
  ctx.fillText(spec.url, pad, CARD_H - pad + 10);
  if (spec.stamp) {
    ctx.fillStyle = "#a3a3a3";
    const w = ctx.measureText(spec.stamp).width;
    ctx.fillText(spec.stamp, CARD_W - pad - w, CARD_H - pad + 10);
  }
}

export function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
}

/** Today's date on the reader's clock, as YYYY-MM-DD. */
export function localDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
