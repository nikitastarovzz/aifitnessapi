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

export type StackCardSpec = {
  /** Product names, already capped (src/lib/stackCard.mjs). */
  products: string[];
  /** How many more products the stack has than are drawn. */
  more: number;
  /** Up to three "in N days · who: title" lines. */
  deadlines: string[];
  url: string;
  stamp?: string;
};

/**
 * The /my-stack card (ops/VIRAL-20-2026-11-06.md item 7): the stack as chips,
 * then the next deadlines. Same frame and brand row as drawShareCard.
 */
export function drawStackCard(canvas: HTMLCanvasElement, spec: StackCardSpec): void {
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

  const mark = ctx.createLinearGradient(pad, 56, pad + 40, 96);
  mark.addColorStop(0, "#34d399");
  mark.addColorStop(1, "#059669");
  ctx.fillStyle = mark;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(pad, 56, 40, 40, 11);
  else ctx.rect(pad, 56, 40, 40);
  ctx.fill();
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#34d399";
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText("AIFitnessAPI", pad + 56, 77);
  ctx.fillStyle = "#6ee7b7";
  ctx.font = `600 24px ${FONT}`;
  const eyebrow = "MY HEALTH-DATA STACK";
  ctx.fillText(eyebrow, CARD_W - pad - ctx.measureText(eyebrow).width, 77);

  // Chips, wrapped, at most three rows; anything left is folded into "+N more".
  ctx.font = `600 30px ${FONT}`;
  const chipH = 52;
  const gap = 14;
  let x = pad;
  let y = 140;
  let row = 0;
  let hidden = spec.more;
  for (let i = 0; i < spec.products.length; i++) {
    const label = spec.products[i];
    const w = ctx.measureText(label).width + 40;
    if (x + w > CARD_W - pad) {
      row++;
      x = pad;
      y += chipH + gap;
    }
    if (row > 2) {
      hidden += spec.products.length - i;
      y -= chipH + gap;
      break;
    }
    ctx.fillStyle = "rgba(52,211,153,0.12)";
    ctx.strokeStyle = "rgba(52,211,153,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, chipH, chipH / 2);
    else ctx.rect(x, y, w, chipH);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f5f5f5";
    ctx.fillText(label, x + 20, y + chipH / 2 + 1);
    x += w + gap;
  }
  if (hidden > 0) {
    ctx.fillStyle = "#a3a3a3";
    ctx.font = `500 26px ${FONT}`;
    ctx.fillText(`+${hidden} more`, Math.min(x + 4, CARD_W - pad - 140), y + chipH / 2 + 1);
  }

  // Deadlines.
  y = Math.max(y + chipH + 56, 330);
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#6ee7b7";
  ctx.font = `600 24px ${FONT}`;
  ctx.fillText(spec.deadlines.length ? "DEADLINES AHEAD" : "NO DATED ITEM AHEAD IN THE TRACKER", pad, y);
  ctx.font = `400 28px ${FONT}`;
  ctx.fillStyle = "#e5e5e5";
  for (const line of spec.deadlines) {
    y += 44;
    if (y > CARD_H - pad - 40) break;
    let l = line;
    while (ctx.measureText(l).width > CARD_W - pad * 2 && l.length > 10) l = `${l.slice(0, -2).trimEnd()}…`;
    ctx.fillText(l, pad, y);
  }

  ctx.font = `500 26px ${FONT}`;
  ctx.fillStyle = "#d4d4d4";
  ctx.fillText(spec.url, pad, CARD_H - pad + 10);
  if (spec.stamp) {
    ctx.fillStyle = "#a3a3a3";
    const w = ctx.measureText(spec.stamp).width;
    ctx.fillText(spec.stamp, CARD_W - pad - w, CARD_H - pad + 10);
  }
}

/** Today's date on the reader's clock, as YYYY-MM-DD. */
export function localDate(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
