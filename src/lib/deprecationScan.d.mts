import type { DsBundle, DsEntry, DsRule } from "./deprecationScannerText";

export type ScanContext = "code" | "npm-manifest" | "pypi-manifest" | "gradle" | "podfile" | "pubspec";
export type CompiledRule = { rule: DsRule; res: RegExp[]; requiresFile: RegExp | null; contexts: Set<string> | null };
export type Hit = { ruleId: string; entry: string; line: number; column: number; match: string; lineText: string };
export type Severity = { level: "error" | "warning"; passed: boolean };
export type DescribedHit = Hit & { rule: DsRule; entry: DsEntry; severity: Severity };

export const IGNORE_MARKER: string;
export const CONTEXTS: ScanContext[];
export function fileContext(name: string): ScanContext;
export function guessContext(text: string): ScanContext;
export function compileRules(bundle: DsBundle): CompiledRule[];
export function scanText(text: string, opts: { compiled: CompiledRule[]; filename?: string; context?: ScanContext }): Hit[];
export function severityOf(entry: Pick<DsEntry, "status" | "end" | "endLast">, today: string): Severity;
export function todayUtc(d?: Date): string;
export function describeHits(hits: Hit[], bundle: DsBundle, today?: string): DescribedHit[];
export function summarize(described: DescribedHit[]): { total: number; errors: number; warnings: number; entries: Record<string, number> };
export function hitMessage(d: DescribedHit): string;
export function escapeData(s: string): string;
export function escapeProperty(s: string): string;
export function annotation(d: DescribedHit, file: string, siteUrl: string): string;
