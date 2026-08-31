/**
 * A disclosed link to KinesteX, on the pages where it is genuinely the
 * subject.
 *
 * ops/GEO.md binds this file. Two rules it exists to satisfy:
 *
 *  - NEVER CROWN OUR OWN PRODUCT. The copy below points at documentation and
 *    says what the product is; it does not claim it is the best option, and
 *    on the comparison pages it deliberately points back at the neutral
 *    comparison rather than around it.
 *  - DISCLOSE. Every instance renders the funder relationship inline. A
 *    reader who sees only this box still knows who pays for the site.
 *
 * Placement is an explicit map, not a keyword rule, for the same reason
 * ReferenceCallout uses one: matching on "KinesteX" appearing anywhere would
 * attach this to pages that mention it once in a list, which is how a
 * disclosed editorial link turns into a site-wide ad. Every path below
 * already discusses the product in its own prose — the link is where the
 * reader was already being sent, made clickable.
 *
 * Anchor text is varied on purpose. Fifteen identical exact-match anchors is
 * the pattern search engines treat as manipulation; fifteen natural phrases
 * describing the same destination is just writing.
 */

type Note = { anchor: string; lead: string };

const MAP: Record<string, Note> = {
  // ── Pages where KinesteX is the subject (already firstParty-disclosed) ──
  "/compare/kinestex-vs-sency": {
    anchor: "KinesteX's own SDK documentation",
    lead: "This comparison is written by the company that makes one of the two products. Check the claims yourself:",
  },
  "/compare/kinestex-vs-mediapipe": {
    anchor: "the KinesteX SDK docs",
    lead: "One side of this comparison funds this site. Read its documentation directly rather than taking our summary of it:",
  },
  "/compare/kinestex-vs-quickpose": {
    anchor: "KinesteX",
    lead: "We make one of these two products, so verify our description of it against the source:",
  },
  "/alternatives/kinestex-alternatives": {
    anchor: "what KinesteX actually does",
    lead: "This page lists alternatives to our own product. If you have not yet ruled it in or out, start with",
  },
  "/guides/evaluate-motion-sdks": {
    anchor: "KinesteX",
    lead: "Run this protocol against every vendor including ours. The product this site is funded by is",
  },
  "/engagement/camera-coaching-engagement": {
    anchor: "KinesteX's camera-coaching SDK",
    lead: "Disclosure applies throughout this page. The first-party product it describes is",
  },

  // ── Pages where it is one option among several ──
  "/fitness-apis/ai-workout-tracking-apis": {
    anchor: "KinesteX",
    lead: "One of the vendors listed above,",
  },
  "/fitness-apis/fitness-api-vs-build-your-own": {
    anchor: "a commercial motion SDK such as KinesteX",
    lead: "If the build column loses on your numbers, the buy column starts with",
  },
  "/engagement/engagement-sdks-compared": {
    anchor: "KinesteX",
    lead: "Among the SDKs compared here, the one that funds this site is",
  },

  // ── Implementation guides, where the reader wants a next step ──
  "/guides/ai-workout-tracking-react-native": {
    anchor: "the KinesteX React Native SDK",
    lead: "If you would rather integrate a hosted camera experience than wire a pose model yourself, see",
  },
  "/guides/ai-workout-tracking-flutter": {
    anchor: "KinesteX's Flutter SDK",
    lead: "The managed alternative to the pipeline above is",
  },
  "/guides/ai-workout-tracking-android-kotlin": {
    anchor: "the KinesteX Android SDK",
    lead: "For the buy path rather than the build path, there is",
  },
  "/guides/add-form-feedback": {
    anchor: "KinesteX",
    lead: "Form feedback is the hardest part to build well. A vendor that ships it, and the one behind this site, is",
  },
};

/** Paths this component covers, for the qa gate. */
export const KINESTEX_NOTE_PATHS = Object.keys(MAP);

export default function KinestexNote({ path }: { path: string }) {
  const note = MAP[path];
  if (!note) return null;

  return (
    <aside
      data-kinestex-note
      className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm"
    >
      <p className="text-[var(--muted)]">
        {note.lead}{" "}
        <a
          href="https://kinestex.com"
          className="font-semibold text-brand-600 hover:text-brand-500"
        >
          {note.anchor}
        </a>
        .
      </p>
      <p className="mt-2 text-xs text-[var(--muted)]">
        <strong className="font-semibold text-[var(--fg)]">Disclosure:</strong> KinesteX makes the
        product linked above and funds this site. That is why the link is labelled rather than
        dropped into the prose, and why nothing here ranks KinesteX first on our own say-so.
      </p>
    </aside>
  );
}
