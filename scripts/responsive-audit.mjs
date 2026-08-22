import { chromium } from "playwright";

/**
 * Layout regression guard: every distinct page template, rendered at thirteen
 * viewports from a 320px phone to a 4K desktop, in light and dark, asserting
 * that nothing widens the document. A page that scrolls sideways is broken on
 * a phone, and it is the kind of break nobody notices from a laptop.
 *
 * Also asserts the phone navigation actually works (opens, links, closes on
 * navigation) and that the desktop inline nav is still there.
 *
 * Run: BASE_URL=http://localhost:3000 node scripts/responsive-audit.mjs
 */
const B = process.env.BASE_URL ?? "http://localhost:3000";
const VIEWPORTS = [
  ["320x568 iPhone SE", 320, 568], ["360x740 Android", 360, 740],
  ["375x667 iPhone 8", 375, 667], ["390x844 iPhone 14", 390, 844],
  ["414x896 iPhone XR", 414, 896], ["844x390 landscape", 844, 390],
  ["768x1024 iPad", 768, 1024], ["1024x768 tablet", 1024, 768],
  ["1280x800 laptop", 1280, 800], ["1440x900 laptop", 1440, 900],
  ["1920x1080 desktop", 1920, 1080], ["2560x1440 wide", 2560, 1440],
  ["3840x2160 4K", 3840, 2160],
];
// One page of every distinct template on the site.
const PAGES = ["/", "/devices", "/devices/ftms-fitness-machine-service", "/matrix",
  "/picker", "/cost-planner", "/day-boundaries", "/changes", "/ai-fitness-app",
  "/no-code-fitness-app", "/state-of-fitness-apis-2026", "/fitbit-api-shutdown",
  "/google-fit-shutdown", "/cookbook", "/cookbook/refresh-rotation",
  "/compare/oura-vs-whoop", "/integrate/healthkit", "/signup", "/glossary",
  "/site-index", "/blog", "/about", "/methodology", "/privacy",
  "/apis", "/apis/fitbit", "/apis/mediapipe", "/alerts", "/digest", "/digest/2026-08",
  "/search", "/compare-apis", "/datasets", "/badges", "/embed/matrix", "/embed/deadlines",
  "/accessibility", "/accessibility/voiceover-live-workout-metrics",
  "/not-a-real-page"];

const exe = process.env.PLAYWRIGHT_CHROMIUM;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const problems = [];
let checks = 0;

for (const scheme of ["light", "dark"]) {
  for (const [label, w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h }, deviceScaleFactor: w < 768 ? 3 : 1,
      isMobile: w < 768, hasTouch: w < 768, colorScheme: scheme,
    });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      // dark mode adds nothing to layout geometry; sample it on a few pages
      if (scheme === "dark" && !["/", "/matrix", "/devices/ftms-fitness-machine-service", "/signup"].includes(p)) continue;
      await page.goto(B + p, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(90);
      checks++;
      const r = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const contained = (el) => {
          let n = el.parentElement;
          while (n && n !== document.documentElement) {
            const o = getComputedStyle(n).overflowX;
            if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return true;
            n = n.parentElement;
          }
          return false;
        };
        const bad = [];
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.right <= vw + 1 || b.left < -1000) continue;
          if (contained(el)) continue;
          bad.push(`<${el.tagName.toLowerCase()} class="${String(el.className).slice(0,48)}"> w=${Math.round(b.width)} right=${Math.round(b.right)}`);
          if (bad.length > 2) break;
        }
        return { vw, docW: document.documentElement.scrollWidth, bad };
      });
      if (r.docW > r.vw + 1) problems.push(`OVERFLOW ${scheme} ${label} ${p} doc=${r.docW} vw=${r.vw}\n     ${r.bad.join("\n     ")}`);
    }
    await ctx.close();
  }
}

// Mobile menu must actually work on touch.
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "networkidle" });
  const btn = page.getByRole("button", { name: /open menu/i });
  if (!(await btn.count())) problems.push("MOBILE-NAV button missing at 375px");
  else {
    await btn.tap();
    await page.waitForTimeout(200);
    const links = await page.locator("#mobile-nav-panel a").count();
    if (links < 5) problems.push(`MOBILE-NAV panel opened with only ${links} links`);
    const expanded = await page.getByRole("button", { name: /close menu/i }).count();
    if (!expanded) problems.push("MOBILE-NAV did not switch to close state");
    // navigate and confirm it closes
    await page.locator("#mobile-nav-panel a").first().click();
    await page.waitForTimeout(600);
    if (await page.locator("#mobile-nav-panel").count()) problems.push("MOBILE-NAV stayed open after navigation");
    const doc = await page.evaluate(() => document.documentElement.scrollWidth);
    if (doc > 376) problems.push(`MOBILE-NAV navigation left overflow doc=${doc}`);
  }
  await ctx.close();
}

// Desktop must still show the inline nav.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(B + "/", { waitUntil: "domcontentloaded" });
  const inline = await page.locator('header nav a[href="/fitness-apis"]').isVisible();
  const hamburger = await page.getByRole("button", { name: /open menu/i }).isVisible().catch(() => false);
  if (!inline) problems.push("DESKTOP inline nav links not visible at 1280");
  if (hamburger) problems.push("DESKTOP hamburger visible at 1280 (should be md:hidden)");
  await ctx.close();
}

await browser.close();
console.log(`checked ${checks} page/viewport combinations across light + dark`);
console.log(problems.length ? "\n" + problems.join("\n") : "\nNO LAYOUT PROBLEMS FOUND");
process.exit(problems.length ? 1 : 0);
