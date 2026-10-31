import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterHero from "@/components/ClusterHero";
import StepLab from "@/components/tools/StepLab";
import { DEFAULT_PARAMS, REPLAY_TRUE_STEPS } from "@/lib/stepDetector.mjs";
import { SOURCES_CHECKED_ON, STEP_LAB_SOURCES } from "@/lib/stepLab";
import { site } from "@/lib/site";
import { toolGraph } from "@/lib/schema";

/**
 * A step counter you can watch think.
 *
 * Everyone has seen two apps report different step counts for the same walk.
 * This page shows why with the simplest detector that works: the reader's own
 * accelerometer (or a labelled synthetic trace), a low-pass filter, a peak
 * threshold and a minimum interval, with sliders on the last two.
 *
 * Fact discipline: the browser-API statements come from MDN and the W3C
 * Device Orientation and Motion draft, read on SOURCES_CHECKED_ON (see
 * src/lib/stepLab.ts for what was fetched). What platform step counters do is
 * stated only as the linked /phone-sensors and /data pages already source it;
 * nothing here describes Apple's or Google's counting algorithm, because those
 * pages do not, and guessing it would be the fabrication this site exists to
 * avoid. The detector is ours and is labelled as ours.
 */

const PATH = "/tools/step-lab";
const UPDATED = "2026-10-31";
// Stays within 45 characters: the layout appends the site suffix.
const TITLE = "Step Lab: Watch a Step Counter Think";
const DESCRIPTION =
  "Walk with your phone and watch a step detector count: live accelerometer trace, each step marked, sliders that change the count. Runs in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Your phone's accelerometer, a visible step detector and two sliders: see why two apps count one walk differently. Motion data never leaves your device.",
    url: PATH,
    images: ["/opengraph-image"],
  },
};

const linkCls = "font-medium text-brand-600 hover:text-brand-500";
const src = (id: string) => STEP_LAB_SOURCES.find((s) => s.id === id)!;

function Cite({ id, children }: { id: string; children: React.ReactNode }) {
  const s = src(id);
  return (
    <a href={s.url} className={linkCls} rel="noopener">
      {children}
    </a>
  );
}

export default function StepLabPage() {
  const jsonLd = toolGraph({
    path: PATH,
    name: TITLE,
    alternativeHeadline: "why two step counters disagree",
    description: DESCRIPTION,
    datePublished: UPDATED,
    dateModified: UPDATED,
    webPage: { lastReviewed: UPDATED },
  });

  return (
    <Container className="py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          trail={[
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Step lab", path: PATH },
          ]}
        />
        <ClusterHero label="Free Tool" seed={5} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Step lab: a step counter you can watch think
        </h1>

        <p id="answer" className="speakable mt-4 leading-relaxed text-[var(--muted)]">
          Two step counters can disagree about the same walk because a step is not something an
          accelerometer reports: each counter decides what counts as one, with its own smoothing, its own
          threshold and its own rule for how soon the next step may come. This page runs a deliberately
          simple detector on your phone&rsquo;s accelerometer in the browser, marks every step it counts on
          the live trace, and gives you sliders for the threshold and the minimum interval so you can
          watch the count change for a walk that has already happened. Motion data never leaves your
          device. Without a motion sensor, it replays a synthetic, labelled walk.
        </p>

        <section data-tool="step-lab" aria-label="Step detector on your phone's accelerometer">
          <StepLab />
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the detector does</h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            This detector is ours, written for this page, and it is not a copy of any phone&rsquo;s. It
            exists to make visible the choices every step counter makes somewhere. For each sample:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              <strong className="text-[var(--fg)]">Magnitude.</strong> It takes the length of the
              acceleration vector, √(x² + y² + z²), so it does not matter which way the phone is held.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Low-pass filter.</strong> An exponential filter with a
              {" "}{DEFAULT_PARAMS.cutoffHz} Hz cutoff smooths away hand tremor and vibration faster than a
              walking rhythm. This is the green line.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Baseline.</strong> A much slower average (a{" "}
              {DEFAULT_PARAMS.baselineSeconds} s time constant) tracks the resting level, gravity included,
              so the threshold is measured from wherever the signal sits.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Peak and threshold.</strong> A local maximum of the
              filtered signal is a candidate step if it rises at least the threshold above the baseline
              (default {DEFAULT_PARAMS.threshold.toFixed(1)} m/s²). The dashed line is baseline plus
              threshold: a peak has to cross it.
            </li>
            <li>
              <strong className="text-[var(--fg)]">Minimum interval.</strong> A candidate sooner than the
              minimum interval (default {DEFAULT_PARAMS.minIntervalMs} ms) after the last counted step is
              ignored, so one footfall that rings twice counts once.
            </li>
          </ol>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            Every one of those numbers is a judgement. Raise the threshold and soft steps (a shuffle, a
            step on carpet, a phone in a loose bag) disappear; lower it and bumps that are not steps get
            counted. Lengthen the interval and a double impact merges into one step, until it passes your
            step period and every other step vanishes. The synthetic replay has {REPLAY_TRUE_STEPS}{" "}
            steps built in, three of them soft and one with a double impact, so you can see each failure
            on a trace whose true count is known.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Why your phone&rsquo;s own count is different
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            The step counts your phone keeps do not come from a page like this. On Android, Google&rsquo;s
            motion sensors guide says the step counter and step detector sensors{" "}
            <q>are either hardware-based or software-based</q>, and that the step counter has more latency,
            up to 10 seconds, but more accuracy than the step detector; both are covered, with
            Google&rsquo;s wording, in{" "}
            <Link href="/phone-sensors/android-step-counter-sensor" className={linkCls}>
              TYPE_STEP_COUNTER vs TYPE_STEP_DETECTOR
            </Link>
            . On iOS, Apple describes what CMPedometer returns as system-generated live walking data:
            the step counts arrive already counted, as{" "}
            <Link href="/phone-sensors/cmpedometer" className={linkCls}>
              CMPedometer
            </Link>{" "}
            covers. Those pages quote what Apple and Google document about the APIs: what they return,
            when, and with what permission. They do not describe how the platforms turn motion into
            steps, and this page does not guess.
          </p>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            What follows from that is the practical point of{" "}
            <Link href="/data/step-counting-api" className={linkCls}>
              the step counting API page
            </Link>
            : a step count is an algorithmic estimate from motion sensors, not a literal record of
            footfalls, so treat it as close rather than exact, prefer the platform&rsquo;s aggregated
            total over summing sources yourself, and do not quote an accuracy percentage. Two apps that
            read different sources, a phone and a watch, or one counter that waits seconds to report and
            another that reports at once, will disagree for reasons this lab makes visible. A
            &ldquo;today&rdquo; total can also disagree for a reason that has nothing to do with motion:
            where the day starts, which is the bug in{" "}
            <Link href="/day-boundaries" className={linkCls}>
              why &ldquo;today&rsquo;s steps&rdquo; is a bug
            </Link>
            . Every phone motion API is indexed at{" "}
            <Link href="/phone-sensors" className={linkCls}>
              phone motion sensors
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">What the browser gives this page</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--muted)]">
            <li>
              The <code className="font-mono text-sm">devicemotion</code> event, which{" "}
              <Cite id="mdn-event">MDN</Cite> describes as{" "}
              <q>fired at a regular interval</q>; its <code className="font-mono text-sm">interval</code>{" "}
              property is the time between samples in milliseconds, which the page shows when the browser
              reports it.
            </li>
            <li>
              Acceleration in metres per second squared. The page reads{" "}
              <code className="font-mono text-sm">accelerationIncludingGravity</code>, which{" "}
              <Cite id="mdn-aig">MDN</Cite> says <q>represents the raw data measured by an accelerometer</q>{" "}
              and <q>may be the only value available on devices that aren&apos;t able to remove gravity</q>
              , and falls back to <code className="font-mono text-sm">acceleration</code> when that is
              missing. The baseline makes either work.
            </li>
            <li>
              On iOS Safari, a permission prompt. The page calls{" "}
              <code className="font-mono text-sm">DeviceMotionEvent.requestPermission()</code> inside the
              Start tap because, per <Cite id="mdn-perm">MDN</Cite>, it needs transient activation, meaning{" "}
              <q>it must be triggered by a UI event such as a button click</q>, and it resolves to <code className="font-mono text-sm">&quot;granted&quot;</code> or{" "}
              <code className="font-mono text-sm">&quot;denied&quot;</code>. Browsers without the method
              need no prompt.
            </li>
            <li>
              Rounded values, on purpose. The <Cite id="w3c">W3C Device Orientation and Motion draft</Cite>{" "}
              tells browsers to limit each acceleration value&rsquo;s precision to no more than 0.1 m/s² and
              to expose the interfaces only in secure contexts, as fingerprinting defences. This detector&rsquo;s default
              threshold is {DEFAULT_PARAMS.threshold.toFixed(1)} m/s², so the rounding does not hide a step from it.
            </li>
          </ul>
          <p className="mt-4 leading-relaxed text-[var(--muted)]">
            On a desktop, or a browser that never delivers a sample, Start reports that nothing arrived
            within three seconds and the synthetic replay is the way to see the detector work.
          </p>
        </section>

        <details className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--fg)]">How this works, and what it sends</summary>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
            <p>
              Motion data never leaves your device. Samples go from the browser&rsquo;s{" "}
              <code className="font-mono">devicemotion</code>{" "}event into an array in this tab&rsquo;s
              memory and onto the canvas; they are not stored, sent or logged, and this page has no server
              code behind it. Reloading discards the recording. The share card is drawn on a canvas in your
              browser and saved by your browser; nothing is uploaded to make it.
            </p>
            <p>
              The replay is synthetic: a generated trace of {REPLAY_TRUE_STEPS} steps at 1.8 per second
              with seeded noise, three soft steps, one double impact and a burst of 9 Hz hand jitter. It is
              not a recording of anyone walking and says nothing about how accurate any real counter is.
              The detector and the trace generator are one module, tested in{" "}
              <code className="font-mono">scripts/step-detector.test.mjs</code>{" "}against a regular walk,
              jitter and a hop.
            </p>
            <p>
              The browser-API statements were read on {SOURCES_CHECKED_ON}. MDN&rsquo;s site and the W3C
              hosts could not be reached from where this page was written, so the text was read from the
              sources they publish: MDN&rsquo;s content repository and the W3C draft&rsquo;s source file.
              Sources:{" "}
              {STEP_LAB_SOURCES.map((s, i) => (
                <span key={s.id}>
                  {i > 0 ? "; " : ""}
                  <a href={s.url} className={linkCls} rel="noopener">
                    {s.title}
                  </a>
                </span>
              ))}
              .
            </p>
          </div>
        </details>

        <p className="mt-8 text-sm text-[var(--muted)]">
          A free tool from {site.name}. Every phone motion API is at{" "}
          <Link href="/phone-sensors" className={linkCls}>
            phone motion sensors
          </Link>
          . More at{" "}
          <Link href="/tools" className={linkCls}>
            free tools for health-app builders
          </Link>
          .
        </p>
      </div>
    </Container>
  );
}
