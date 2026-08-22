import { chromium } from "playwright";

/**
 * Performance budget guard.
 *
 * Exists because of a real regression: the first version of the motion system
 * used infinite CSS animations, and every page on the site burned 6-9% of a
 * CPU core forever — including while scrolled far past the animated element,
 * and on battery. Nothing caught it, because it costs nothing a page-load
 * metric measures. Lighthouse-style scores look fine; the phone gets warm.
 *
 * So the budget asserts steady state, not just load: after ambient animation
 * has finished, an idle page must cost approximately nothing, and an animated
 * hero must stop when it scrolls out of view.
 *
 * Run: BASE_URL=http://localhost:3000 node scripts/perf-audit.mjs
 */
const B = process.env.BASE_URL ?? "http://localhost:3000";
const exe = process.env.PLAYWRIGHT_CHROMIUM;

// Generous enough for a shared CI runner, tight enough to catch a
// continuously-animating page (which measured 300-470ms per 5s).
const BUDGET = {
  idleMsPer5s: 150,      // steady-state main-thread work
  offscreenMsPer5s: 150, // animated hero, scrolled away
  jsKB: 230,             // compressed JS per page
  cls: 0.05,
  lcpMs: 2500,
};
const SETTLE_MS = 40_000; // longest ambient animation is ~32s

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const fails = [];
const note = (s) => console.log("  " + s);

async function session(path, { scrollAway = false, settle = SETTLE_MS } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Performance.enable");
  await cdp.send("Network.enable");
  let js = 0;
  const kinds = new Map();
  cdp.on("Network.responseReceived", (e) => kinds.set(e.requestId, e.type));
  cdp.on("Network.loadingFinished", (e) => {
    if ((kinds.get(e.requestId) || "") === "Script") js += e.encodedDataLength || 0;
  });
  await page.goto(B + path, { waitUntil: "load" });
  const vitals = await page.evaluate(() => new Promise((res) => {
    let lcp = 0, cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) lcp = Math.max(lcp, e.startTime); })
      .observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; })
      .observe({ type: "layout-shift", buffered: true });
    setTimeout(() => res({ lcp: Math.round(lcp), cls: +cls.toFixed(4) }), 1500);
  }));
  if (scrollAway) await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(settle);
  const a = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
  await page.waitForTimeout(5000);
  const z = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((x) => [x.name, x.value]));
  const idleMs = Math.round((z.TaskDuration - a.TaskDuration) * 1000);
  await ctx.close();
  return { idleMs, jsKB: Math.round(js / 1024), ...vitals };
}

// A content page: the 250+ pages that receive search traffic. Nothing on one
// should still be running once its hero animation has played out.
{
  const r = await session("/devices/ftms-fitness-machine-service");
  console.log("content page (steady state):");
  note(`idle ${r.idleMs}ms/5s | js ${r.jsKB}KB | LCP ${r.lcp}ms | CLS ${r.cls}`);
  if (r.idleMs > BUDGET.idleMsPer5s) fails.push(`content page idles at ${r.idleMs}ms/5s (budget ${BUDGET.idleMsPer5s}) — something is animating forever`);
  if (r.jsKB > BUDGET.jsKB) fails.push(`content page ships ${r.jsKB}KB of JS (budget ${BUDGET.jsKB})`);
  if (r.cls > BUDGET.cls) fails.push(`content page CLS ${r.cls} (budget ${BUDGET.cls})`);
  if (r.lcp > BUDGET.lcpMs) fails.push(`content page LCP ${r.lcp}ms (budget ${BUDGET.lcpMs})`);
}

// The homepage hero animates by design, so the assertion is that it stops
// costing anything once it is no longer on screen AND its ambient animations
// have played out. The full settle matters: measuring at five seconds sits
// inside the ambient window and tells you nothing about steady state.
{
  const r = await session("/", { scrollAway: true });
  console.log("homepage (steady state, scrolled past the hero):");
  note(`idle ${r.idleMs}ms/5s | js ${r.jsKB}KB | LCP ${r.lcp}ms | CLS ${r.cls}`);
  if (r.idleMs > BUDGET.offscreenMsPer5s) fails.push(`homepage burns ${r.idleMs}ms/5s while scrolled away (budget ${BUDGET.offscreenMsPer5s}) — the hero is not pausing off-screen`);
  if (r.jsKB > BUDGET.jsKB) fails.push(`homepage ships ${r.jsKB}KB of JS (budget ${BUDGET.jsKB})`);
  if (r.cls > BUDGET.cls) fails.push(`homepage CLS ${r.cls} (budget ${BUDGET.cls})`);
}

await browser.close();
console.log(fails.length ? "\nBUDGET EXCEEDED:\n  " + fails.join("\n  ") : "\nPERFORMANCE BUDGET OK");
process.exit(fails.length ? 1 : 0);
