/**
 * Release activity for the SDKs that sit between an app and a health store.
 *
 * GENERATED — do not hand-edit. Refreshed in CI by
 * .github/workflows/sdk-releases.yml, which runs
 * scripts/fetch-sdk-releases.mjs against the GitHub Releases API.
 *
 * SEED STATE: this file ships empty on purpose. api.github.com is not
 * reachable from the authoring container, so the data cannot be gathered
 * here, and shipping placeholder releases would mean publishing versions
 * nobody verified. While SDK_REPOS is empty the page 404s and is absent from
 * the sitemap and footer — the same rule the empty clusters follow. The first
 * CI run fills it in and the page appears.
 */

export type SdkRelease = {
  tag: string;
  name: string | null;
  publishedAt: string | null;
  prerelease: boolean;
  url: string;
};

export type SdkRepo = {
  repo: string;
  label: string;
  /** Why a reader of this site should care about this repo. */
  why: string;
  /** Which health store the SDK bridges to. */
  covers: string;
  url: string;
  stars: number | null;
  archived: boolean;
  /** Last push to the default branch — activity, not release cadence. */
  pushedAt: string | null;
  releases: SdkRelease[];
};

/** The date CI last reached the GitHub API. Null until the first run. */
export const SDK_CHECKED_ON: string | null = null;

export const SDK_REPOS: SdkRepo[] = [];
