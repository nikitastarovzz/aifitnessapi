export type AwesomeApi = { id: string; label: string; category: string; devCost: string; approvalGate: string | null };
export type AwesomeEntry = { name: string; url: string; text: string };
export type AwesomeGroup = { id: string; title: string; entries: AwesomeEntry[] };
export type AwesomeSection = {
  key: string;
  id: string;
  title: string;
  intro: string;
  /** Printed when the section has no entries yet (the built-with list). */
  empty?: string;
  /** One call to action under the section (the built-with list's submit link). */
  action?: { label: string; url: string };
  groups: AwesomeGroup[];
};
export type AwesomeBuiltWith = {
  issue: number;
  issueUrl: string;
  name: string;
  url: string;
  repoUrl: string | null;
  apis: string[];
  description: string;
};
export type AwesomeModel = { title: string; siteUrl: string; sections: AwesomeSection[]; count: number };

export const AWESOME_TITLE: string;
export const AWESOME_FIRST_PARTY: string;
export function sentence(s: string | null | undefined): string;
export function githubSlug(s: string): string;
export function awesomeModel(input: {
  siteUrl: string;
  apis: AwesomeApi[];
  categoryOrder: string[];
  categoryLabels: Record<string, string>;
  devCostLabels: Record<string, string>;
  libraries: unknown[];
  libraryGroups: { id: string; label: string }[];
  librariesFetchedOn: string;
  mcpServers: unknown[];
  mcpGroups: { key: string; label: string }[];
  mcpFetchedOn: string;
  datasets: { slug: string; name: string; license: string }[];
  tools: { path: string; name: string; blurb: string }[];
  builtWith?: { projects: AwesomeBuiltWith[]; submitUrl: string };
}): AwesomeModel;
export function awesomeLead(model: AwesomeModel): string;
export function entryLine(e: AwesomeEntry): string;
export function contents(model: AwesomeModel): { depth: number; title: string; anchor: string }[];
export function awesomeBody(model: AwesomeModel): string[];
export function awesomeMarkdown(model: AwesomeModel): string;
