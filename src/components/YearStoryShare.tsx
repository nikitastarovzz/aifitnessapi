"use client";

import { useEffect, useState } from "react";

/**
 * Per-slide sharing for /2026: "Copy as image" draws the slide on a canvas in
 * the browser and puts the PNG on the clipboard (or downloads it where the
 * clipboard refuses images); "Copy stat" copies the plain-text line. Nothing
 * is uploaded and no image route exists: the card is drawn from the strings
 * the server already rendered into the page.
 *
 * Without JavaScript the buttons do not render at all, so a reader never sees
 * a control that cannot work; the slide's text is selectable either way.
 */

export type ShareCard = {
  id: string;
  title: string;
  kicker: string;
  value: string;
  label: string;
  caveat?: string;
  source: string;
  url: string;
  text: string;
};

const W = 1200;
const H = 630;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function draw(card: ShareCard): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(W * 0.8, 0, 40, W * 0.8, 0, W);
  g.addColorStop(0, "#064e3b");
  g.addColorStop(0.55, "#0a0a0a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const font = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = "#34d399";
  ctx.font = `600 28px ${font}`;
  ctx.fillText(`${card.title.toUpperCase()} · ${card.kicker.toUpperCase()}`, 72, 96);

  ctx.fillStyle = "#ffffff";
  let size = 168;
  ctx.font = `800 ${size}px ${font}`;
  while (ctx.measureText(card.value).width > W - 144 && size > 60) {
    size -= 8;
    ctx.font = `800 ${size}px ${font}`;
  }
  ctx.fillText(card.value, 72, 120 + size);

  ctx.fillStyle = "#e5e7eb";
  ctx.font = `500 40px ${font}`;
  let y = 120 + size + 64;
  for (const l of wrap(ctx, card.label, W - 144).slice(0, 3)) {
    ctx.fillText(l, 72, y);
    y += 50;
  }
  if (card.caveat) {
    ctx.fillStyle = "#9ca3af";
    ctx.font = `400 24px ${font}`;
    for (const l of wrap(ctx, `(${card.caveat})`, W - 144).slice(0, 2)) {
      ctx.fillText(l, 72, y + 4);
      y += 32;
    }
  }

  ctx.fillStyle = "#9ca3af";
  ctx.font = `400 24px ${font}`;
  ctx.fillText(`Source: ${card.source}`.slice(0, 90), 72, H - 64);
  ctx.fillStyle = "#34d399";
  ctx.font = `600 26px ${font}`;
  const u = card.url;
  ctx.fillText(u, W - 72 - ctx.measureText(u).width, H - 64);
  return c;
}

export default function YearStoryShare({ card }: { card: ShareCard }) {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2400);
  };

  const copyImage = async () => {
    const canvas = draw(card);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) return flash("Could not draw the image");
    try {
      if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) throw new Error("no image clipboard");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Image copied");
    } catch {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `fitness-apis-2026-${card.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      flash("Image downloaded");
    }
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(card.text);
      flash("Stat copied");
    } catch {
      flash("Copy failed: select the text above");
    }
  };

  const btn =
    "rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--fg)] transition-colors hover:border-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500";
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2" data-share={card.id}>
      <button type="button" className={btn} onClick={copyImage} data-track="year-copy-image">
        Copy as image
      </button>
      <button type="button" className={btn} onClick={copyText} data-track="year-copy-stat">
        Copy stat
      </button>
      <span role="status" aria-live="polite" className="text-xs text-[var(--muted)]">
        {msg}
      </span>
    </div>
  );
}
