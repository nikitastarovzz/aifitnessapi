import { audioCoachingEntries } from "./audioCoaching.entries";
import type { ClusterEntry, ClusterConfig } from "@/lib/cluster";

/**
 * Cluster 22 — audio coaching: spoken cues, tones and ducking during a workout.
 *
 * WHY THIS CLUSTER EXISTS. The commonest complaint about a workout app's audio
 * is not that the coach sounds robotic. It is that the cue stopped the user's
 * music and never gave it back, went silent when the screen locked, talked
 * over a podcast, carried on out loud after the headphones came out, or
 * failed silently in the background on a newer Android release. Every one of
 * those is a documented platform behaviour with an exact API string attached
 * (duckOthers, notifyOthersOnDeactivation, AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK,
 * AUDIOFOCUS_REQUEST_FAILED, ACTION_AUDIO_BECOMING_NOISY), and developers
 * search for the string. Each page here is organised around one of them.
 *
 * BOUNDARY RULES, because four clusters are adjacent:
 * - /accessibility owns haptics as a second channel
 *   (/accessibility/haptics-when-audio-is-busy) and screen-reader
 *   announcements. This cluster links there and does not repeat it.
 * - /watch-apps owns the workout session itself (HKWorkoutSession, Health
 *   Services). The wrist page here covers audio output only.
 * - /build owns product scope (the HIIT and meditation app guides already say
 *   "duck, don't stop" as a requirement); this cluster is the implementation.
 * - /compliance owns store policy. App Store Review Guideline 2.5.4 is quoted
 *   once, verbatim, where it bears on background audio, and nothing more.
 *
 * EVIDENCE RULES (ops/GEO.md; checked by the cluster verifier before assembly):
 * - Every platform claim traces to Apple's or Google's own developer
 *   documentation, fetched 2026-10-03 into the session fact pack.
 * - No React Native, Expo, Flutter or Capacitor audio-plugin claims: those
 *   frameworks' documentation was unreachable from the research environment.
 * - No measured latency, duck depth, battery or reliability figures. The one
 *   number about ducking depth is Google's own ("a factor of 0.2f (or
 *   -14dB)"), quoted as Google's.
 * - Where the documentation is silent the page says so: whether an iOS app
 *   keeps executing between cues when nothing is playing, which volume stream
 *   each AudioAttributes usage maps to, and whether TextToSpeech manages audio
 *   focus are all stated as not verified rather than guessed.
 * - Keep the platforms' own verbs. Apple writes "should" and "important";
 *   Google writes "should" and "we recommend". Judgement is labelled as ours.
 */
export type { ClusterEntry } from "@/lib/cluster";
export { clampTitle, clampDescription } from "@/lib/cluster";

export const AUDIO_PATH = "/audio-coaching";
export const AUDIO_CONFIG: ClusterConfig = {
  basePath: AUDIO_PATH,
  hubLabel: "Audio Coaching",
};

/** Release gate — only these slugs are built + revealed. */
export const RELEASED_AUDIO = new Set<string>([
  "avaudiosession-category-workout-app",
  "avaudiosession-duckothers-workout-cues",
  "avspeechsynthesizer-workout-cues",
  "audio-interruptions-during-workout-ios",
  "background-audio-workout-app-ios",
  "headphones-disconnect-route-change",
  "android-audio-focus-may-duck",
  "audiofocus-request-failed-android-15",
  "texttospeech-workout-cues-android",
  "audioattributes-usage-coaching-cues",
  "wear-os-watchos-workout-audio",
  "testing-workout-audio-cues",
]);

export const allAudioCoaching: ClusterEntry[] = audioCoachingEntries;

export function releasedAudioCoaching(): ClusterEntry[] {
  return allAudioCoaching.filter((e) => RELEASED_AUDIO.has(e.slug));
}

export function getAudioCoaching(slug: string): ClusterEntry | undefined {
  return releasedAudioCoaching().find((e) => e.slug === slug);
}
