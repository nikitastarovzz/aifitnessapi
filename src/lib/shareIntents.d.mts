/** Types for src/lib/shareIntents.mjs. */
export type ShareTargetId = "x" | "linkedin" | "bluesky" | "reddit";
export const SHARE_TARGETS: { id: ShareTargetId; label: string }[];
export function shareIntents(o: { url: string; text: string }): { id: ShareTargetId; label: string; href: string }[];
export function shareCtaId(place: string, target: ShareTargetId | "copy" | "image"): string;
