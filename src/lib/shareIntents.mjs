/**
 * Share links as plain intent URLs (ops/VIRAL-20-2026-11-06.md items 6–8).
 *
 * No SDK, no script from any network, no counter: each target is an ordinary
 * link to the network's own compose page with the address (and a line of
 * text) in its query string. Nothing is sent anywhere until the reader
 * presses Post on the network's own page.
 *
 * Used by the quiz result pages, the /my-stack share card and the share row
 * on the tools (components/ShareRow). Tested in scripts/wearable-quiz.test.mjs.
 */

export const SHARE_TARGETS = [
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "bluesky", label: "Bluesky" },
  { id: "reddit", label: "Reddit" },
];

const e = encodeURIComponent;

/** One intent link per target for `url`, with `text` where the target takes text. */
export function shareIntents({ url, text }) {
  const hrefs = {
    x: `https://x.com/intent/tweet?text=${e(text)}&url=${e(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${e(url)}`,
    // Bluesky's compose intent takes one text field, so the address goes in it.
    bluesky: `https://bsky.app/intent/compose?text=${e(`${text} ${url}`)}`,
    reddit: `https://www.reddit.com/submit?url=${e(url)}&title=${e(text)}`,
  };
  return SHARE_TARGETS.map((t) => ({ ...t, href: hrefs[t.id] }));
}

const PLACE = /^[a-z0-9-]+$/;
const TARGET_IDS = new Set(["copy", "image", ...SHARE_TARGETS.map((t) => t.id)]);

/**
 * The cta_click id for a share click: `share-<place>-<target>`. Both parts
 * are fixed strings chosen in code, so the event can never carry a reader's
 * answers or stack (ops/MEASUREMENT.md).
 */
export function shareCtaId(place, target) {
  if (!PLACE.test(place)) throw new Error(`shareCtaId: bad place ${place}`);
  if (!TARGET_IDS.has(target)) throw new Error(`shareCtaId: bad target ${target}`);
  return `share-${place}-${target}`;
}
