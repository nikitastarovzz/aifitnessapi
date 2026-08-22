"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero terminal: three looping scenes that act out the site's promise —
 * read a wearable API, survive a webhook, count reps from a pose stream.
 * Decorative (aria-hidden) pseudo-code, deliberately vendor-neutral so it
 * makes no factual claims. Server HTML renders scene 1 in full, so crawlers
 * and no-JS users see a complete terminal; typing is a JS-only enhancement
 * that reduced-motion users never get.
 */

type Line = { text: string; tone: "comment" | "code" | "response" };

const SCENES: Line[][] = [
  [
    { text: "// 1 · read a night of sleep — one shape, any wearable", tone: "comment" },
    { text: "const res = await fetch(`${api}/v1/sleep?date=2026-08-13`, {", tone: "code" },
    { text: "  headers: { authorization: `Bearer ${token}` },", tone: "code" },
    { text: "});", tone: "code" },
    { text: "// 200 OK", tone: "comment" },
    { text: '{ "score": 82, "time_asleep_h": 7.4, "hrv_avg_ms": 61 }', tone: "response" },
  ],
  [
    { text: "// 2 · a webhook lands — verify, dedupe, ack fast", tone: "comment" },
    { text: '{ "event": "workout.created", "id": "wk_8912",', tone: "response" },
    { text: '  "type": "strength", "duration_min": 38 }', tone: "response" },
    { text: "// signature ok · not seen before → 200, then process", tone: "comment" },
    { text: "await queue.push(payload);", tone: "code" },
  ],
  [
    { text: "// 3 · camera reps — pose stream in, form score out", tone: "comment" },
    { text: "onPose((keypoints) => counter.update(keypoints));", tone: "code" },
    { text: "// ~30 fps, on-device", tone: "comment" },
    { text: '{ "exercise": "squat", "rep": 12, "depth": "ok",', tone: "response" },
    { text: '  "form_score": 0.91 }', tone: "response" },
  ],
];

const TONE_CLASS: Record<Line["tone"], string> = {
  comment: "text-slate-500",
  code: "text-slate-200",
  response: "text-emerald-300",
};

// Two characters per tick at a slower interval: the same apparent typing
// speed for half the React renders. Each render re-renders the scene list,
// so the update count is the cost, not the interval.
const CHARS_PER_TICK = 2;
const CHAR_MS = 28;
const LINE_PAUSE_MS = 140;
const SCENE_PAUSE_MS = 2600;

export default function ApiTerminal({ className = "" }: { className?: string }) {
  // SSR state: scene 0 fully typed.
  const [scene, setScene] = useState(0);
  const [line, setLine] = useState(SCENES[0].length - 1);
  const [chars, setChars] = useState(SCENES[0][SCENES[0].length - 1].text.length);
  const [animating, setAnimating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const box = useRef<HTMLDivElement>(null);
  // Typing into a background tab or a scrolled-past hero is pure battery
  // burn, so the loop idles instead of running when nobody can see it.
  const visible = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onVis = () => { visible.current = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | null = null;
    if (box.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => { visible.current = e.isIntersecting && !document.hidden; },
        { threshold: 0 },
      );
      io.observe(box.current);
    }

    let s = 0;
    let l = 0;
    let c = 0;
    setAnimating(true);
    setScene(0);
    setLine(0);
    setChars(0);

    const tick = () => {
      if (!visible.current) {
        // Cheap heartbeat while off-screen; no state updates, no renders.
        timer.current = setTimeout(tick, 500);
        return;
      }
      const lines = SCENES[s];
      if (c < lines[l].text.length) {
        c = Math.min(c + CHARS_PER_TICK, lines[l].text.length);
        setChars(c);
        timer.current = setTimeout(tick, CHAR_MS);
      } else if (l < lines.length - 1) {
        l += 1;
        c = 0;
        setLine(l);
        setChars(0);
        timer.current = setTimeout(tick, LINE_PAUSE_MS);
      } else {
        s = (s + 1) % SCENES.length;
        l = 0;
        c = 0;
        timer.current = setTimeout(() => {
          setScene(s);
          setLine(0);
          setChars(0);
          timer.current = setTimeout(tick, LINE_PAUSE_MS);
        }, SCENE_PAUSE_MS);
      }
    };
    timer.current = setTimeout(tick, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  const lines = SCENES[scene];

  return (
    <div
      ref={box}
      aria-hidden
      data-terminal
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] text-left shadow-2xl shadow-emerald-500/10 ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-slate-500">
          builder@fitness-app — api
        </span>
      </div>
      <pre className="h-40 overflow-x-auto whitespace-pre px-4 py-3.5 font-mono text-[11px] leading-[1.55rem] sm:text-xs">
        {lines.map((ln, i) => {
          if (animating && i > line) return null;
          const text = animating && i === line ? ln.text.slice(0, chars) : ln.text;
          const isCaretLine = i === line;
          return (
            <div key={`${scene}-${i}`} className={TONE_CLASS[ln.tone]}>
              {text}
              {isCaretLine && (
                <span className="caret-blink ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] bg-emerald-400" />
              )}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
