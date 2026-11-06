/** Types for statusBadges.mjs (README status and openness badges). */

export type BadgeText = { label: string; value: string; color: string };
export type StoneLike = { id: string; name: string; status: "dead" | "dying" | "deprecated"; end: string | null; endLabel: string };

export function lastDay(d: string): string;
export function isDay(d: string): boolean;
export function daysBetween(asOf: string, day: string): number;
export const STONE_COLORS: Record<"dead" | "dying" | "deprecated", string>;
export const OPENNESS_COLOR: string;
export function stoneBadge(stone: StoneLike, asOf: string): BadgeText;
export function opennessBadge(vendor: { name: string; documented: number; applicable: number }): BadgeText;
export function badgeAlt(b: { label: string; value: string }): string;
export const STONE_BADGE_BASE: string;
export const OPENNESS_BADGE_BASE: string;
export function stoneBadgePath(id: string): string;
export function opennessBadgePath(id: string): string;
export function badgeMarkdown(alt: string, svgPath: string, href: string, origin?: string): string;
export function stoneBadgeAlt(stone: { name: string }): string;
export function opennessBadgeAlt(vendor: { name: string }): string;
