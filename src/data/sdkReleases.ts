/**
 * Release activity for the SDKs that sit between an app and a health store.
 *
 * GENERATED — do not hand-edit. Refreshed in CI by
 * .github/workflows/sdk-releases.yml, which runs
 * scripts/fetch-sdk-releases.mjs against the GitHub Releases API.
 *
 * The repo list is short on purpose: every entry was verified to exist before
 * it was added. This tracks the bridges, not the vendors — vendor release
 * notes are not machine-readable, and this site does not publish facts it
 * cannot fetch.
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

/** The date CI last reached the GitHub API. */
export const SDK_CHECKED_ON = "2026-08-27";

export const SDK_REPOS: SdkRepo[] = [
  {
    "repo": "agencyenterprise/react-native-health",
    "label": "react-native-health",
    "why": "The most-used bridge from React Native to Apple HealthKit. Its releases are where HealthKit type support arrives for RN apps.",
    "covers": "Apple HealthKit",
    "url": "https://github.com/agencyenterprise/react-native-health",
    "stars": 1159,
    "archived": false,
    "pushedAt": "2026-04-27",
    "releases": [
      {
        "tag": "v1.19.0",
        "name": null,
        "publishedAt": "2024-10-15",
        "prerelease": false,
        "url": "https://github.com/agencyenterprise/react-native-health/releases/tag/v1.19.0"
      },
      {
        "tag": "v1.18.0",
        "name": null,
        "publishedAt": "2023-08-18",
        "prerelease": false,
        "url": "https://github.com/agencyenterprise/react-native-health/releases/tag/v1.18.0"
      },
      {
        "tag": "v1.17.0",
        "name": null,
        "publishedAt": "2023-07-11",
        "prerelease": false,
        "url": "https://github.com/agencyenterprise/react-native-health/releases/tag/v1.17.0"
      },
      {
        "tag": "v1.16.0",
        "name": null,
        "publishedAt": "2023-07-03",
        "prerelease": false,
        "url": "https://github.com/agencyenterprise/react-native-health/releases/tag/v1.16.0"
      },
      {
        "tag": "v1.15.0",
        "name": null,
        "publishedAt": "2023-06-30",
        "prerelease": false,
        "url": "https://github.com/agencyenterprise/react-native-health/releases/tag/v1.15.0"
      }
    ]
  },
  {
    "repo": "matinzd/react-native-health-connect",
    "label": "react-native-health-connect",
    "why": "The React Native wrapper for Android Health Connect, supporting both the old and new RN architectures.",
    "covers": "Android Health Connect",
    "url": "https://github.com/matinzd/react-native-health-connect",
    "stars": 414,
    "archived": false,
    "pushedAt": "2026-08-26",
    "releases": [
      {
        "tag": "v4.1.3",
        "name": "Release 4.1.3",
        "publishedAt": "2026-08-06",
        "prerelease": false,
        "url": "https://github.com/matinzd/react-native-health-connect/releases/tag/v4.1.3"
      },
      {
        "tag": "v4.1.2",
        "name": "Release 4.1.2",
        "publishedAt": "2026-08-02",
        "prerelease": false,
        "url": "https://github.com/matinzd/react-native-health-connect/releases/tag/v4.1.2"
      },
      {
        "tag": "v4.1.1",
        "name": "Release 4.1.1",
        "publishedAt": "2026-08-01",
        "prerelease": false,
        "url": "https://github.com/matinzd/react-native-health-connect/releases/tag/v4.1.1"
      },
      {
        "tag": "v4.1.0",
        "name": "Release 4.1.0",
        "publishedAt": "2026-08-01",
        "prerelease": false,
        "url": "https://github.com/matinzd/react-native-health-connect/releases/tag/v4.1.0"
      },
      {
        "tag": "v4.0.0",
        "name": "Release 4.0.0",
        "publishedAt": "2026-08-01",
        "prerelease": false,
        "url": "https://github.com/matinzd/react-native-health-connect/releases/tag/v4.0.0"
      }
    ]
  },
  {
    "repo": "android/health-samples",
    "label": "android/health-samples",
    "why": "Google's own sample projects for Health Connect, Health Services and Wear OS. Changes here usually precede changes in the guidance.",
    "covers": "Android Health Connect, Health Services",
    "url": "https://github.com/android/health-samples",
    "stars": 344,
    "archived": false,
    "pushedAt": "2026-04-20",
    "releases": []
  }
];
