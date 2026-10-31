"use client";

import { useEffect, useRef, useState } from "react";
import { canvasBlob, drawShareCard, type ShareCardSpec } from "@/lib/shareCard";

/**
 * A result card the reader can save, share or copy as text.
 *
 * Shared by /challenge and /tools/pose-benchmark. The PNG is drawn in the
 * browser (src/lib/shareCard.ts) and only ever leaves the device if the
 * reader saves it or picks a target in the system share sheet; the text is a
 * single line for pasting anywhere.
 */
export default function ShareCard({
  spec,
  text,
  filename,
}: {
  spec: ShareCardSpec;
  /** The copyable one-line result. */
  text: string;
  filename: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [src, setSrc] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const key = JSON.stringify(spec);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    drawShareCard(c, spec);
    setSrc(c.toDataURL("image/png"));
    setCopied(false);
    try {
      const probe = new File([new Blob()], filename, { type: "image/png" });
      setCanShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch {
      setCanShare(false);
    }
    // spec is compared by value through `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, filename]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const el = document.getElementById(`${filename}-text`) as HTMLInputElement | null;
      el?.select();
    }
  }

  async function share() {
    const c = canvasRef.current;
    if (!c) return;
    const blob = await canvasBlob(c);
    if (!blob) return;
    try {
      await navigator.share({ files: [new File([blob], filename, { type: "image/png" })], text });
    } catch {
      /* the reader closed the sheet */
    }
  }

  const btn =
    "rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm font-medium text-[var(--fg)] transition-colors hover:border-brand-400";

  return (
    <div data-share-card className="mt-6">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      {src && (
        // A data: URL drawn on this device; next/image has nothing to optimise.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Share card: ${spec.eyebrow}, ${spec.headline}. ${spec.lines.join(". ")}`}
          width={1200}
          height={630}
          className="h-auto w-full rounded-xl border border-[var(--border)]"
        />
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {src && (
          <a href={src} download={filename} className={btn}>
            Download card (PNG)
          </a>
        )}
        {canShare && (
          <button type="button" onClick={share} className={btn}>
            Share…
          </button>
        )}
        <button type="button" onClick={copy} className={btn}>
          {copied ? "Copied" : "Copy result"}
        </button>
      </div>
      <input
        id={`${filename}-text`}
        readOnly
        value={text}
        aria-label="Result as text"
        className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 font-mono text-xs text-[var(--fg)]"
      />
      <p className="mt-2 text-xs text-[var(--muted)]">
        The card is drawn in your browser and goes nowhere unless you save or post it yourself.
      </p>
    </div>
  );
}
