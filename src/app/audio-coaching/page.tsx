import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Breadcrumbs from "@/components/Breadcrumbs";
import ClusterCta from "@/components/ClusterCta";
import ClusterDisclaimer from "@/components/ClusterDisclaimer";
import ClusterHero from "@/components/ClusterHero";
import HubFreshness from "@/components/HubFreshness";
import EntryBadge from "@/components/EntryBadge";
import HubJsonLd from "@/components/HubJsonLd";
import { absoluteUrl } from "@/lib/site";
import { orgRef } from "@/lib/schema";
import { heroSeed } from "@/lib/cluster";
import { getAudioCoaching, releasedAudioCoaching, AUDIO_PATH, AUDIO_CONFIG } from "@/data/audioCoaching";

const UPDATED = "2026-10-03";

/** Every FAQ answer in this cluster, counted from the same data the
 *  /questions index is built from so the two can never disagree. */
const QUESTION_COUNT = releasedAudioCoaching().reduce((n, e) => n + e.faqs.length, 0);

const TITLE = "Audio Cues & Ducking for Workout Apps";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "duckOthers, AVSpeechSynthesizer, interruptions, background audio, Android audio focus, TextToSpeech and watch speakers: workout cues over the user's music.",
  alternates: { canonical: AUDIO_PATH },
  openGraph: {
    type: "website",
    title: TITLE,
    description:
      "Spoken cues and tones that play over the user's music without stopping it, survive the lock screen and calls, and stay quiet when they should.",
    url: AUDIO_PATH,
  },
};

const GROUPS: { title: string; blurb: string; slugs: string[] }[] = [
  {
    title: "Configure the session (iOS)",
    blurb:
      "The category that survives the lock, the option that lowers the music instead of stopping it, and the speech synthesizer that has to be held on to.",
    slugs: [
      "avaudiosession-category-workout-app",
      "avaudiosession-duckothers-workout-cues",
      "avspeechsynthesizer-workout-cues",
    ],
  },
  {
    title: "When something else happens",
    blurb:
      "A phone call, an earbud falling out, the screen locking. The transitions where workout audio actually breaks.",
    slugs: [
      "audio-interruptions-during-workout-ios",
      "headphones-disconnect-route-change",
      "background-audio-workout-app-ios",
    ],
  },
  {
    title: "Android audio focus and speech",
    blurb:
      "Asking for focus the right way, the Android 15 rule that fails background cues silently, TextToSpeech, and the usage constant nobody reads.",
    slugs: [
      "android-audio-focus-may-duck",
      "audiofocus-request-failed-android-15",
      "texttospeech-workout-cues-android",
      "audioattributes-usage-coaching-cues",
    ],
  },
  {
    title: "On the wrist, and proving it",
    blurb: "Speaker or Bluetooth on Wear OS and Apple Watch, and a device test matrix built from documented events.",
    slugs: ["wear-os-watchos-workout-audio", "testing-workout-audio-cues"],
  },
];

const FAQS = [
  {
    q: "Why do so many workout apps stop the user's music when they speak a cue?",
    a: "Because the platform default does exactly that, and so does the obvious fix done halfway. Apple documents that the default iOS audio session silences other background audio when the app plays, and that the playback category, which keeps cues alive when the screen locks, is nonmixable by default. On Android, a cue that requests full AUDIOFOCUS_GAIN instead of transient ducking focus tells the music app it has lost focus, and on Android 12 and higher Google documents a forced fade-out that leaves it muted. Both platforms have a documented way to lower the music for a few seconds and give it back; the pages here are about using it.",
  },
  {
    q: "Is a spoken cue or a haptic better for telling someone a workout interval has ended?",
    a: "Use both, and design for the moment one of them fails. Spoken cues carry information a tap cannot, such as what comes next and how long it lasts, but the audio channel is shared with the user's music and can be taken away by a call, by Siri or by an earbud falling out. A haptic reaches the person even then, but only if the device is touching them. The accessibility section covers haptics as the second channel in detail, and these pages route a cue to a haptic whenever the documented signals say speech should not play.",
  },
  {
    q: "What does this section not cover, and why?",
    a: "Cross-platform frameworks and anything we could not read. The React Native, Expo, Flutter and Capacitor documentation sites were unreachable from our research environment, so these pages make no claims about audio plugins for those frameworks. We also publish no measured latency, ducking depth or battery figures, because we have not run those tests, and where Apple's or Google's pages are silent, for example on which volume stream each Android usage maps to, the page says so rather than guessing.",
  },
];

export default function AudioCoachingPillar() {
  const released = releasedAudioCoaching();
  // A hub with nothing behind it is a thin page and a promise we have not
  // kept. Until the cluster has released pages, this route does not exist.
  if (released.length === 0) notFound();
  const url = absoluteUrl(AUDIO_PATH);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: metadata.description,
    datePublished: UPDATED,
    dateModified: UPDATED,
    author: orgRef(),
    publisher: orgRef(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer"] },
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f, i) => ({
      "@type": "Question",
      "@id": `${url}#faq-${i + 1}`,
      url: `${url}#faq-${i + 1}`,
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a, url: `${url}#faq-${i + 1}` },
    })),
  };

  return (
    <Container className="py-14">
      <HubJsonLd basePath={AUDIO_PATH} description={String(metadata.description)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-2xl">
        <Breadcrumbs trail={[{ name: "Home", path: "/" }, { name: "Audio Coaching", path: AUDIO_PATH }]} />

        <ClusterHero label="Audio Coaching" seed={heroSeed(AUDIO_PATH)} />

        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--fg)] sm:text-5xl">
          Audio Coaching
        </h1>

        <HubFreshness entries={released} basePath={AUDIO_PATH} />

        <div
          id="answer"
          className="speakable mt-6 rounded-2xl border border-brand-400/30 bg-brand-500/5 p-5 text-lg leading-relaxed text-[var(--fg)] sm:p-6"
        >
          A workout app&rsquo;s voice has to share the audio channel with the user&rsquo;s own music,
          and most audio bugs in fitness apps come from getting that sharing wrong: the cue stops the
          music and never gives it back, goes silent when the screen locks, talks over a podcast,
          carries on through the speaker after an earbud falls out, or fails without a sound in the
          background on a newer Android release. Each of those is a documented platform behaviour with
          an exact API name attached &mdash; duckOthers and notifyOthersOnDeactivation on iOS,
          AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK and AUDIOFOCUS_REQUEST_FAILED on Android &mdash; and
          these pages are organised around those names. Every claim comes from Apple&rsquo;s or
          Google&rsquo;s own developer documentation, read on 3 October 2026.
        </div>

        <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert prose-a:text-brand-600 hover:prose-a:text-brand-500">
          <p>
            This is engineering guidance for the audio layer only. Using haptics as the second
            channel when the audio is busy is covered in{" "}
            <Link href="/accessibility/haptics-when-audio-is-busy">accessibility</Link>, and running
            the workout session itself on a watch is covered in{" "}
            <Link href="/watch-apps">watch apps</Link>. The product-level requirement, duck the
            user&rsquo;s music instead of stopping it, is set out in the{" "}
            <Link href="/build/hiit-app">HIIT app guide</Link>; these pages are how to meet it.
          </p>
          <p>
            Three evidence rules hold throughout. The documentation sites for React Native, Expo,
            Flutter and Capacitor were unreachable from our research environment, so nothing here
            describes a cross-platform audio plugin. We publish no latency, ducking-depth or battery
            numbers of our own; the one ducking figure quoted is Google&rsquo;s, and attributed to
            it. And where the platform pages are silent &mdash; whether an iPhone app keeps running
            between cues when nothing is playing, which volume stream an Android usage maps to,
            whether TextToSpeech manages audio focus &mdash; the page says it could not verify the
            point rather than filling the gap. Store policy, including App Store guideline 2.5.4 on
            background services, belongs to <Link href="/compliance">compliance</Link>.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = group.slugs.map((s) => getAudioCoaching(s)).filter((e) => e !== undefined);
          if (items.length === 0) return null;
          return (
            <section key={group.title} className="mt-14">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">{group.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{group.blurb}</p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((e) => (
                  <li key={e!.slug}>
                    <Link
                      href={`${AUDIO_PATH}/${e!.slug}`}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-[var(--border)] p-5 transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-[var(--surface)]"
                    >
                      <span className="font-semibold text-[var(--fg)] [overflow-wrap:anywhere]">{e!.h1}</span>
                      <span className="mt-2 text-sm text-[var(--muted)] [overflow-wrap:anywhere]">{e!.metaDescription}</span>
                      <EntryBadge updated={e!.updated} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
            Frequently asked questions
          </h2>
          <dl className="mt-6 divide-y divide-[var(--border)]">
            {FAQS.map((f, i) => (
              <div key={f.q} id={`faq-${i + 1}`} className="scroll-mt-24 py-5">
                <dt className="font-semibold text-[var(--fg)]">{f.q}</dt>
                <dd className="mt-2 text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-[var(--muted)]">
            <Link href="/questions/audio-coaching" className="text-brand-600 hover:text-brand-500">
              All {QUESTION_COUNT} questions in {AUDIO_CONFIG.hubLabel}, answered
            </Link>
          </p>
        </section>

        <ClusterDisclaimer updated={UPDATED} />

        <ClusterCta
          pitch="Apple and Google both changed their audio rules in their latest releases: new interruption notifications in iOS 27, a background audio-focus rule for apps targeting Android 15. We track the changes that alter what a workout app's cues have to do."
          source="pillar-inline"
          id="cta-audio-coaching"
        />
      </div>
    </Container>
  );
}
