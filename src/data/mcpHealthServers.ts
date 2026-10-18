/**
 * MCP servers for health and fitness data, from the official MCP Registry.
 *
 * GENERATED — do not hand-edit. Produced by scripts/fetch-mcp-health-servers.mjs
 * from every page of the registry's v0.1 listing (version=latest) and, for the
 * npm and PyPI packages the in-scope entries name, the npm registry and PyPI;
 * refreshed by .github/workflows/mcp-health-servers.yml.
 *
 * A server is here because a term in MCP_SERVER_TERMS matched its registry
 * name, title or description on a word boundary; `matches` keeps the field
 * and the exact text. `publisherIsVendor` is true only when the registry
 * namespace is the reverse-DNS form of a vendor domain this site already
 * cites, and `publisherEvidence` says which. Repositories were not read:
 * `repositoryUrl` is exactly what the entry lists. Package facts are null
 * for package types other than npm and PyPI.
 */

export type McpPackageFacts = {
  registry: "npm" | "pypi";
  /** The package's page on npmjs.com or pypi.org. */
  url: string;
  /** False when the registry answered 404 for the identifier the entry lists. */
  found: boolean;
  /** Null when the package exists but its registry names no latest version. */
  latestVersion?: string | null;
  /** YYYY-MM-DD the latest version was published. */
  lastPublished?: string | null;
  license?: string | null;
  licenseEvidence?: string | null;
  deprecated?: string | null;
};

export type McpPackage = {
  registryType: string;
  registryBaseUrl: string | null;
  identifier: string;
  /** The package version the registry entry pins. */
  version: string | null;
  /** stdio, streamable-http or sse, as the entry states it. */
  transport: string | null;
  runtimeHint: string | null;
  /** Environment variable names the entry declares (never values). */
  environmentVariables: string[];
  /** The subset the entry marks isSecret. */
  secretEnvironmentVariables: string[];
  facts: McpPackageFacts | null;
};

export type McpRemote = {
  type: string;
  /** The URL as listed; may contain {template} variables. */
  url: string;
  /** Header names the entry declares (never values). */
  headers: string[];
  /** The subset the entry marks isSecret. */
  secretHeaders: string[];
  /** {name} placeholders the URL carries (never values). */
  urlVariables: string[];
  /** The subset the entry marks isSecret — a secret that travels inside the URL. */
  secretUrlVariables: string[];
};

export type McpMatch = {
  /** A key of MCP_SERVER_GROUPS (never "several"). */
  source: string;
  term: string;
  field: "name" | "title" | "description";
  /** The exact text the term matched in that field (the name is read with separators as spaces). */
  text: string;
  /** For an ambiguous vendor name, the health or fitness word that qualified it, and where. */
  context: { field: "name" | "title" | "description"; text: string } | null;
};

export type McpHealthServer = {
  /** Row anchor on /health-mcp-servers: #server-<slug>. */
  slug: string;
  /** Registry name, namespace/server. */
  name: string;
  namespace: string;
  title: string | null;
  /** The registry description, verbatim. */
  description: string;
  version: string;
  /** Which rule chose this version when a name appeared more than once. */
  versionRule: "registry isLatest" | "only version listed" | "highest version";
  status: "active" | "deprecated" | "deleted" | null;
  statusMessage: string | null;
  /** The registry's publishedAt / updatedAt for this version's record, as YYYY-MM-DD. */
  publishedOn: string | null;
  updatedOn: string | null;
  packages: McpPackage[];
  remotes: McpRemote[];
  repositoryUrl: string | null;
  repositorySource: string | null;
  repositorySubfolder: string | null;
  websiteUrl: string | null;
  /** The registry API record this row was read from. */
  registryEntryUrl: string;
  matches: McpMatch[];
  /** Every source key a match named, "general" included. */
  sources: string[];
  /** The one group the row is rendered under: a vendor key, "several" or "general". */
  group: string;
  publisherIsVendor: boolean;
  publisherEvidence: string | null;
};

/** The date the registry was read for this file (UTC). */
export const MCP_SERVERS_FETCHED_ON = "2026-10-17";

/** The generator's floor for the in-scope count; it refuses to write fewer. */
export const MCP_SERVERS_EXPECTED_MIN = 158;

/** What the run read and kept. */
export const MCP_REGISTRY_SCAN = {
  "pages": 452,
  "entries": 45161,
  "uniqueNames": 45161,
  "duplicateNames": 0,
  "matched": 187,
  "excluded": 11,
  "contextDropped": 12,
  "inScope": 176,
  "npmLookups": 44,
  "pypiLookups": 35
};

/** This site's own server (mcp/package.json), looked up in the same run: registry entries naming it, and npm. */
export const MCP_SITE_SERVER_CHECK = {
  "package": "@aifitnessapi/mcp",
  "registryNames": [],
  "onNpm": false,
  "npmVersion": null
};

export const MCP_SERVERS_SOURCES = {
  "registryApi": "https://registry.modelcontextprotocol.io/v0.1/servers",
  "registryOpenApi": "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/docs/reference/api/openapi.yaml",
  "registryReadme": "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/README.md",
  "registryAuthentication": "https://raw.githubusercontent.com/modelcontextprotocol/registry/main/docs/modelcontextprotocol-io/authentication.mdx",
  "npm": "https://registry.npmjs.org",
  "pypi": "https://pypi.org/pypi"
};

/** Groups in page order. A group's order is not a ranking of its servers. */
export const MCP_SERVER_GROUPS: { key: string; label: string; kind: string }[] = [
  {
    "key": "apple-health",
    "label": "Apple Health (HealthKit)",
    "kind": "platform"
  },
  {
    "key": "health-connect",
    "label": "Health Connect",
    "kind": "platform"
  },
  {
    "key": "google-health",
    "label": "Google Health API",
    "kind": "platform"
  },
  {
    "key": "fitbit",
    "label": "Fitbit",
    "kind": "platform"
  },
  {
    "key": "google-fit",
    "label": "Google Fit",
    "kind": "platform"
  },
  {
    "key": "samsung-health",
    "label": "Samsung Health",
    "kind": "platform"
  },
  {
    "key": "garmin",
    "label": "Garmin",
    "kind": "device"
  },
  {
    "key": "oura",
    "label": "Oura",
    "kind": "device"
  },
  {
    "key": "whoop",
    "label": "WHOOP",
    "kind": "device"
  },
  {
    "key": "polar",
    "label": "Polar",
    "kind": "device"
  },
  {
    "key": "withings",
    "label": "Withings",
    "kind": "device"
  },
  {
    "key": "suunto",
    "label": "Suunto",
    "kind": "device"
  },
  {
    "key": "coros",
    "label": "COROS",
    "kind": "device"
  },
  {
    "key": "wahoo",
    "label": "Wahoo",
    "kind": "device"
  },
  {
    "key": "dexcom",
    "label": "Dexcom",
    "kind": "device"
  },
  {
    "key": "peloton",
    "label": "Peloton",
    "kind": "device"
  },
  {
    "key": "strava",
    "label": "Strava",
    "kind": "app"
  },
  {
    "key": "myfitnesspal",
    "label": "MyFitnessPal",
    "kind": "app"
  },
  {
    "key": "cronometer",
    "label": "Cronometer",
    "kind": "app"
  },
  {
    "key": "terra",
    "label": "Terra",
    "kind": "aggregator"
  },
  {
    "key": "junction",
    "label": "Junction (formerly Vital)",
    "kind": "aggregator"
  },
  {
    "key": "several",
    "label": "Several sources",
    "kind": "several"
  },
  {
    "key": "general",
    "label": "Wearable, fitness and health data in general",
    "kind": "general"
  }
];

/**
 * The terms the filter used, as regular-expression sources, with each source's
 * vendor domains (the only namespaces that can make a server official).
 */
export const MCP_SERVER_TERMS: { source: string; terms: { label: string; pattern: string }[]; needsContext: boolean; domains: string[] }[] = [
  {
    "source": "apple-health",
    "terms": [
      {
        "label": "Apple Health",
        "pattern": "\\bApple[ -]?Health\\b"
      },
      {
        "label": "HealthKit",
        "pattern": "\\bHealth ?Kit\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "apple.com"
    ]
  },
  {
    "source": "health-connect",
    "terms": [
      {
        "label": "Health Connect",
        "pattern": "\\bHealth[ -]?Connect\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "android.com",
      "google.com"
    ]
  },
  {
    "source": "google-health",
    "terms": [
      {
        "label": "Google Health",
        "pattern": "\\bGoogle Health\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "google.com"
    ]
  },
  {
    "source": "fitbit",
    "terms": [
      {
        "label": "Fitbit",
        "pattern": "\\bFitbit\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "fitbit.com",
      "google.com"
    ]
  },
  {
    "source": "google-fit",
    "terms": [
      {
        "label": "Google Fit",
        "pattern": "\\bGoogle[ -]?Fit\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "google.com"
    ]
  },
  {
    "source": "samsung-health",
    "terms": [
      {
        "label": "Samsung Health",
        "pattern": "\\bSamsung[ -]?Health\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "garmin",
    "terms": [
      {
        "label": "Garmin",
        "pattern": "\\bGarmin\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "garmin.com"
    ]
  },
  {
    "source": "oura",
    "terms": [
      {
        "label": "Oura",
        "pattern": "\\bOura\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "ouraring.com"
    ]
  },
  {
    "source": "whoop",
    "terms": [
      {
        "label": "WHOOP",
        "pattern": "\\bWhoop\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "whoop.com"
    ]
  },
  {
    "source": "polar",
    "terms": [
      {
        "label": "Polar",
        "pattern": "\\bPolar\\b"
      }
    ],
    "needsContext": true,
    "domains": [
      "polar.com",
      "polaraccesslink.com"
    ]
  },
  {
    "source": "withings",
    "terms": [
      {
        "label": "Withings",
        "pattern": "\\bWithings\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "suunto",
    "terms": [
      {
        "label": "Suunto",
        "pattern": "\\bSuunto\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "coros",
    "terms": [
      {
        "label": "COROS",
        "pattern": "\\bCoros\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "wahoo",
    "terms": [
      {
        "label": "Wahoo",
        "pattern": "\\bWahoo\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "dexcom",
    "terms": [
      {
        "label": "Dexcom",
        "pattern": "\\bDexcom\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "peloton",
    "terms": [
      {
        "label": "Peloton",
        "pattern": "\\bPeloton\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "strava",
    "terms": [
      {
        "label": "Strava",
        "pattern": "\\bStrava\\b"
      }
    ],
    "needsContext": false,
    "domains": [
      "strava.com"
    ]
  },
  {
    "source": "myfitnesspal",
    "terms": [
      {
        "label": "MyFitnessPal",
        "pattern": "\\bMy[ -]?Fitness[ -]?Pal\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "cronometer",
    "terms": [
      {
        "label": "Cronometer",
        "pattern": "\\bCronometer\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  },
  {
    "source": "terra",
    "terms": [
      {
        "label": "Terra",
        "pattern": "\\bTerra\\b"
      }
    ],
    "needsContext": true,
    "domains": [
      "tryterra.co"
    ]
  },
  {
    "source": "junction",
    "terms": [
      {
        "label": "Junction",
        "pattern": "\\bJunction\\b"
      },
      {
        "label": "Vital",
        "pattern": "\\b(?:tryvital|Vital)\\b(?![ -]?(?:signs?|records?|statistics|stats)\\b)"
      }
    ],
    "needsContext": true,
    "domains": [
      "junction.com"
    ]
  },
  {
    "source": "general",
    "terms": [
      {
        "label": "wearable",
        "pattern": "\\bwearables?\\b"
      },
      {
        "label": "fitness",
        "pattern": "\\bfitness\\b"
      },
      {
        "label": "workout",
        "pattern": "\\bworkouts?\\b"
      },
      {
        "label": "sleep tracking",
        "pattern": "\\bsleep[ -]?track(?:ing|ers?)\\b"
      },
      {
        "label": "HRV",
        "pattern": "\\bHRV\\b|\\bheart[ -]rate variability\\b"
      },
      {
        "label": "health data",
        "pattern": "\\bhealth data\\b"
      }
    ],
    "needsContext": false,
    "domains": []
  }
];

/** Entries a term matched in a sense that is not health or fitness data. */
export const MCP_SERVERS_EXCLUDED: { name: string; reason: string; matched: string[] }[] = [
  {
    "name": "ai.sfomo/events",
    "reason": "Searches upcoming San Francisco Bay Area events; “fitness” is one of its event categories, not data it reads.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "com.formulasignal/record",
    "reason": "Tracks the formulas of pre-workout supplements; “workout” is part of a product category, not workout data.",
    "matched": [
      "workout"
    ]
  },
  {
    "name": "com.gitbuyer/mcp",
    "reason": "Searches and sells code repositories; “fitness” describes how well a repository fits.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "com.idevice/wearables",
    "reason": "A buyer's guide to wearables and phones (prices, when to buy); it reads no data from a wearable.",
    "matched": [
      "wearable"
    ]
  },
  {
    "name": "com.trycommonplace/seller",
    "reason": "Helps sell large household items; “fitness gear” is one example of an item.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "com.wphealthkit/mcp-server",
    "reason": "A WordPress security-audit tool titled “WP HealthKit”; it is unrelated to Apple's HealthKit.",
    "matched": [
      "HealthKit"
    ]
  },
  {
    "name": "io.github.MetriLLM/metrillm",
    "reason": "Benchmarks local language models; “fitness” is its verdict on whether hardware suits a model.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "io.github.TweedBeetle/dependency-fitness-mcp",
    "reason": "Checks npm dependencies; “fitness” describes the state of a package.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "io.github.dexcom-inc/argocd-mcp",
    "reason": "Manages ArgoCD deployments. “Dexcom” is only in the publishing GitHub account's name; it reads no glucose or health data.",
    "matched": [
      "Dexcom"
    ]
  },
  {
    "name": "io.github.rotifer-protocol/mcp-server",
    "reason": "Ranks AI agent components by an “Arena fitness” score.",
    "matched": [
      "fitness"
    ]
  },
  {
    "name": "io.github.thehomer87/badge-mcp-server",
    "reason": "Screens AI agents and reads their “fitness scores” on a talent leaderboard.",
    "matched": [
      "fitness"
    ]
  }
];

/** Ambiguous vendor names (Polar, Terra, Junction, Vital) found with no health or fitness word in the entry. */
export const MCP_SERVERS_CONTEXT_DROPPED: { name: string; term: string; field: string; text: string }[] = [
  {
    "name": "ai.mcpjunction/directory",
    "term": "Junction",
    "field": "title",
    "text": "Junction"
  },
  {
    "name": "ai.terra-lab/terralab",
    "term": "Terra",
    "field": "name",
    "text": "terra"
  },
  {
    "name": "app.chartsy/chartsy",
    "term": "Polar",
    "field": "description",
    "text": "Polar"
  },
  {
    "name": "app.wishpool/digital-goods-mcp",
    "term": "Polar",
    "field": "title",
    "text": "Polar"
  },
  {
    "name": "com.polaranalytics/polar",
    "term": "Polar",
    "field": "name",
    "text": "polar"
  },
  {
    "name": "io.github.apatzer/vital-care-finder",
    "term": "Vital",
    "field": "name",
    "text": "vital"
  },
  {
    "name": "io.github.charlie-morrison/indie-founder-mcp",
    "term": "Polar",
    "field": "description",
    "text": "Polar"
  },
  {
    "name": "io.github.chrischall/tripadvisor-mcp",
    "term": "Terra",
    "field": "description",
    "text": "Terra"
  },
  {
    "name": "io.github.dfieser/thermocouple-its90",
    "term": "Junction",
    "field": "description",
    "text": "junction"
  },
  {
    "name": "io.usefulapi/polar-sh",
    "term": "Polar",
    "field": "name",
    "text": "polar"
  },
  {
    "name": "uk.co.sellermcp/terra-natural-seller-mcp",
    "term": "Terra",
    "field": "name",
    "text": "terra"
  },
  {
    "name": "xyz.558686.gpt55/token-gateway",
    "term": "Terra",
    "field": "description",
    "text": "Terra"
  }
];

export const MCP_HEALTH_SERVERS: McpHealthServer[] = [
  {
    "slug": "ai-com-mcp-strava",
    "name": "ai.com.mcp/strava",
    "namespace": "ai.com.mcp",
    "title": "HAPI Strava MCP Server",
    "description": "Strava MCP tools for AI: athletes, activities, segments, clubs, routes. Powered by HAPI MCP server.",
    "version": "3.0.0+0.7.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-19",
    "updatedOn": "2026-02-19",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://strava.run.mcp.com.ai/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/la-rebelion/hapimcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://run.mcp.com.ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.com.mcp%2Fstrava/versions/3.0.0%2B0.7.1",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-iamcoach-coach",
    "name": "ai.iamcoach/coach",
    "namespace": "ai.iamcoach",
    "title": "Coach MCP",
    "description": "Your endurance training data in your AI assistant: activities, recovery, plan, workout edits.",
    "version": "1.5.14",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-19",
    "updatedOn": "2026-09-19",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.iamcoach.ai",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.iamcoach.ai/mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.iamcoach%2Fcoach/versions/1.5.14",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-povver-mcp-server",
    "name": "ai.povver/mcp-server",
    "namespace": "ai.povver",
    "title": "Povver — Strength Training",
    "description": "Your strength-training data for any AI assistant: workouts, progress, muscle volume, routines.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-21",
    "updatedOn": "2026-09-21",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.povver.ai/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/bvatech/povver-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://mcp.povver.ai/?utm_source=mcp_registry&utm_medium=referral&utm_campaign=mcp_directory",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.povver%2Fmcp-server/versions/1.0.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-rippd-rippd",
    "name": "ai.rippd/rippd",
    "namespace": "ai.rippd",
    "title": "Rippd",
    "description": "Your Rippd training and nutrition data in your AI: food, workouts, weigh-ins, targets, coach notes.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://rippd.ai/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://rippd.ai/connectors",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.rippd%2Frippd/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-smithery-eliu243-oura-mcp-server",
    "name": "ai.smithery/eliu243-oura-mcp-server",
    "namespace": "ai.smithery",
    "title": null,
    "description": "Connect your Oura Ring account and enable access to your wellness data in apps and automations. In…",
    "version": "1.16.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-10-02",
    "updatedOn": "2025-10-02",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://server.smithery.ai/@eliu243/oura-mcp-server/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/eliu243/oura-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Feliu243-oura-mcp-server/versions/1.16.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-smithery-eliu243-oura-mcp-server-2",
    "name": "ai.smithery/eliu243-oura-mcp-server-2",
    "namespace": "ai.smithery",
    "title": null,
    "description": "Connect your Oura Ring account to enable secure, authenticated access in your workflows. Generate…",
    "version": "1.16.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-10-02",
    "updatedOn": "2025-10-02",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://server.smithery.ai/@eliu243/oura-mcp-server-2/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/eliu243/oura-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Feliu243-oura-mcp-server-2/versions/1.16.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-smithery-eliu243-oura-mcp-server-eliu",
    "name": "ai.smithery/eliu243-oura-mcp-server-eliu",
    "namespace": "ai.smithery",
    "title": null,
    "description": "Connect your Oura Ring account securely in minutes. Enable authorized access to your sleep, activi…",
    "version": "1.16.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-10-02",
    "updatedOn": "2025-10-02",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://server.smithery.ai/@eliu243/oura-mcp-server-eliu/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/eliu243/oura-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Feliu243-oura-mcp-server-eliu/versions/1.16.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-smithery-fitaf-ai-fitaf-ai-mcp",
    "name": "ai.smithery/fitaf-ai-fitaf-ai-mcp",
    "namespace": "ai.smithery",
    "title": null,
    "description": "Manage workouts, nutrition, goals, and progress across the FitAF platform. Connect wearables, sync…",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-09-12",
    "updatedOn": "2025-09-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://server.smithery.ai/@fitaf-ai/fitaf-ai-mcp/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-ai-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-smithery-fitaf-ai-fitaf-mcp",
    "name": "ai.smithery/fitaf-ai-fitaf-mcp",
    "namespace": "ai.smithery",
    "title": null,
    "description": "Track workouts, nutrition, body metrics, habits, and SMART goals with insights and trends. Connect…",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-09-12",
    "updatedOn": "2025-09-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://server.smithery.ai/@fitaf-ai/fitaf-mcp/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.smithery%2Ffitaf-ai-fitaf-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "ai-wellnessproject-wellness-project",
    "name": "ai.wellnessproject/wellness-project",
    "namespace": "ai.wellnessproject",
    "title": "Wellness Project",
    "description": "Connect your health, fitness, nutrition, sleep, and wearable data to your AI assistant.",
    "version": "1.2.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-07",
    "updatedOn": "2026-09-07",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://wellnessproject.ai/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/turnnoblindeye/wellness-project-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellnessproject.ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/ai.wellnessproject%2Fwellness-project/versions/1.2.1",
    "matches": [
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearable",
        "context": null
      },
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-apick-business",
    "name": "app.apick/business",
    "namespace": "app.apick",
    "title": "APICK Business",
    "description": "Korean business, parcel and simple-auth employment, income, pension, license and health data",
    "version": "1.5.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-05",
    "updatedOn": "2026-10-05",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://apick.app/mcp/business",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/lead788/apick-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://apick.app/dev_guide/mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.apick%2Fbusiness/versions/1.5.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-athletediary-athlete-diary",
    "name": "app.athletediary/athlete-diary",
    "namespace": "app.athletediary",
    "title": "Athlete Diary",
    "description": "Your workout log in chat: history, progress, records, muscle volume, body weight, programs.",
    "version": "1.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://athletediary.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://athletediary.app/connect",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.athletediary%2Fathlete-diary/versions/1.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-evertrain-evertrain",
    "name": "app.evertrain/evertrain",
    "namespace": "app.evertrain",
    "title": "Evertrain",
    "description": "Manage your Evertrain training — programs, workouts, exercises, history, and coaching notes.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-22",
    "updatedOn": "2026-08-22",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.evertrain.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.evertrain%2Fevertrain/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-framezone-framezone",
    "name": "app.framezone/framezone",
    "namespace": "app.framezone",
    "title": "Framezone",
    "description": "Your life dashboard for AI: tasks, habits, goals, budgets, workouts, nutrition, journal, notes.",
    "version": "2.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-24",
    "updatedOn": "2026-09-24",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://framezone.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://framezone.app/mcp-for-life-management",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.framezone%2Fframezone/versions/2.3.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-health-os-health-os",
    "name": "app.health-os/health-os",
    "namespace": "app.health-os",
    "title": "Health OS",
    "description": "N-of-1 health experiments in your AI assistant: Oura/RescueTime data, protocols, workouts.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-22",
    "updatedOn": "2026-09-22",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://os.health-os.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://health-os.app/en/ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.health-os%2Fhealth-os/versions/1.0.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "description",
        "text": "Oura",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "oura",
      "general"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-movemate-movemate",
    "name": "app.movemate/movemate",
    "namespace": "app.movemate",
    "title": "MoveMate: Gym Workout Tracker",
    "description": "Gym workout tracker: review your training, PRs and progression, and schedule workouts in the app.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.movemate.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://movemate.app/ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.movemate%2Fmovemate/versions/1.3.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "title",
        "text": "Workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-onlinefitness-coach",
    "name": "app.onlinefitness/coach",
    "namespace": "app.onlinefitness",
    "title": "OnlineFitness.app",
    "description": "Manage fitness coaching clients, workouts, programs, chats and funnels from your assistant.",
    "version": "0.37.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-04",
    "updatedOn": "2026-09-04",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://onlinefitness.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://onlinefitness.app/ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.onlinefitness%2Fcoach/versions/0.37.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-pumpx-pumpx",
    "name": "app.pumpx/pumpx",
    "namespace": "app.pumpx",
    "title": "PumpX",
    "description": "Read-only access to your PumpX workout log: sessions, lift history, PRs, routines, measurements.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-28",
    "updatedOn": "2026-08-28",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.pumpx.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://pumpx.app/claude/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.pumpx%2Fpumpx/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-railway-up-wod-api-production-wod-coach",
    "name": "app.railway.up.wod-api-production/wod-coach",
    "namespace": "app.railway.up.wod-api-production",
    "title": "WOD Coach: AI Personal Trainer",
    "description": "Fitness MCP: AI personal trainer, workouts, injury exercise swaps, race pacing. Pay-per-call x402.",
    "version": "2.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-13",
    "updatedOn": "2026-10-13",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://wod-api-production.up.railway.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://wod-api-production.up.railway.app/llms.txt",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.railway.up.wod-api-production%2Fwod-coach/versions/2.1.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "Fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-somvia-health",
    "name": "app.somvia/health",
    "namespace": "app.somvia",
    "title": "Somvia",
    "description": "Apple Health training load, recovery, HRV and workout detail for Claude, ChatGPT and any MCP client.",
    "version": "0.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-15",
    "updatedOn": "2026-09-15",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://somvia.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://somvia.app/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.somvia%2Fhealth/versions/0.3.0",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "description",
        "text": "Apple Health",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-tectonicplates-tectonic-plates",
    "name": "app.tectonicplates/tectonic-plates",
    "namespace": "app.tectonicplates",
    "title": "tectonic plates",
    "description": "Write whole barbell programmes, not just workouts: weeks, progressions, ramps, and plate maths.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-14",
    "updatedOn": "2026-09-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://tectonicplates.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/stephaniewilkinson/tectonic",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://tectonicplates.app/docs",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.tectonicplates%2Ftectonic-plates/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-wemoveat-moveat",
    "name": "app.wemoveat/moveat",
    "namespace": "app.wemoveat",
    "title": "Moveat",
    "description": "Coaching app for fitness coaches: read client check-ins, weight trends, diets and programs.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-23",
    "updatedOn": "2026-09-23",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://wemoveat.app/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://wemoveat.app",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.wemoveat%2Fmoveat/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "app-ymove-exercise-api",
    "name": "app.ymove/exercise-api",
    "namespace": "app.ymove",
    "title": "Your Move Exercise Video API",
    "description": "1,413+ HD exercise videos with muscles and instructions, plus workout and program generation.",
    "version": "1.1.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-09",
    "updatedOn": "2026-10-09",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "ymove-exercise-mcp",
        "version": "1.1.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "YMOVE_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "YMOVE_API_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/ymove-exercise-mcp",
          "found": true,
          "latestVersion": "1.1.3",
          "lastPublished": "2026-10-09",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://exercise-api.ymove.app/mcp",
        "headers": [
          "X-API-Key"
        ],
        "secretHeaders": [
          "X-API-Key"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/ymove-app/exercise-api-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://ymove.app/exercise-api",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/app.ymove%2Fexercise-api/versions/1.1.3",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "br-com-trainerconnect-personal-trainer",
    "name": "br.com.trainerconnect/personal-trainer",
    "namespace": "br.com.trainerconnect",
    "title": "Trainer Connect",
    "description": "Manage students, workouts, appointments and payments through your personal trainer account.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-11",
    "updatedOn": "2026-10-11",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.trainerconnect.com.br/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://trainerconnect.com.br/assistentes-ia",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/br.com.trainerconnect%2Fpersonal-trainer/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "coach-freddy-freddy",
    "name": "coach.freddy/freddy",
    "namespace": "coach.freddy",
    "title": "freddy",
    "description": "Connect your wearables, rings and training apps, then ask your AI about your own health data.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-13",
    "updatedOn": "2026-06-13",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://freddy.coach/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://freddy.coach",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/coach.freddy%2Ffreddy/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-aim-journal-aim",
    "name": "com.aim-journal/aim",
    "namespace": "com.aim-journal",
    "title": "AIm Workout Journal",
    "description": "Chat forgets your workouts. AIm remembers them for Claude and ChatGPT: sets, weights, 1RM, volume.",
    "version": "1.2.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-16",
    "updatedOn": "2026-09-16",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://aim-journal.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/persistmcp/aim",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://aim-journal.com/guides/en/connect-workout-tracker-mcp/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.aim-journal%2Faim/versions/1.2.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "title",
        "text": "Workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-cyclingcoachai-cycling-coach-ai",
    "name": "com.cyclingcoachai/cycling-coach-ai",
    "namespace": "com.cyclingcoachai",
    "title": "Cycling Coach AI",
    "description": "AI cycling coach: training plans, workouts, nutrition, strength training, Strava, Garmin and Wahoo.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-04-30",
    "updatedOn": "2026-04-30",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://app.usecoachai.com/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.cyclingcoachai%2Fcycling-coach-ai/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "wahoo",
        "term": "Wahoo",
        "field": "description",
        "text": "Wahoo",
        "context": null
      },
      {
        "source": "strava",
        "term": "Strava",
        "field": "description",
        "text": "Strava",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "wahoo",
      "strava",
      "general"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-garminmcp-garmin",
    "name": "com.garminmcp/garmin",
    "namespace": "com.garminmcp",
    "title": "Garmin MCP",
    "description": "Read-only Garmin data for your AI: sleep, Body Battery, activities, laps, and training status.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-17",
    "updatedOn": "2026-09-17",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://garminmcp.com/u/{user_id}/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [
          "user_id"
        ],
        "secretUrlVariables": [
          "user_id"
        ]
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://garminmcp.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.garminmcp%2Fgarmin/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-getsimma-simma",
    "name": "com.getsimma/simma",
    "namespace": "com.getsimma",
    "title": "Simma",
    "description": "Your swim, run and ride training, explained. For coaches and athletes, computed from Garmin data.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-15",
    "updatedOn": "2026-09-15",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.getsimma.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://getsimma.com/resources/connect-simma-to-claude",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.getsimma%2Fsimma/versions/0.1.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-gymnavigator-coach",
    "name": "com.gymnavigator/coach",
    "namespace": "com.gymnavigator",
    "title": "Gym Navigator Coach",
    "description": "Plan workouts, find exercises and gyms, log sessions and track progress with Gym Navigator.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-27",
    "updatedOn": "2026-09-27",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://coach.gymnavigator.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://gymnavigator.com/coach/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.gymnavigator%2Fcoach/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-justgains-mcp-server",
    "name": "com.justgains/mcp-server",
    "namespace": "com.justgains",
    "title": "JustGains",
    "description": "Save workouts, read training history and progress, search exercises, and log food in JustGains.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-12",
    "updatedOn": "2026-10-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://justgains.com/connect/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/JustGains/justgains-connector",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://justgains.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.justgains%2Fmcp-server/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-kompetic-joti",
    "name": "com.kompetic/joti",
    "namespace": "com.kompetic",
    "title": "Joti",
    "description": "Read your workouts, history, and stats; create and schedule new workouts. Writes are additive only.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-02",
    "updatedOn": "2026-09-02",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://joti.kompetic.com/api/ai/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.kompetic%2Fjoti/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-lifttrackapp-lifttrack",
    "name": "com.lifttrackapp/lifttrack",
    "namespace": "com.lifttrackapp",
    "title": "LiftTrack",
    "description": "Manage strength workouts and track exercise progress. Requires a LiftTrack account.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-09",
    "updatedOn": "2026-09-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.lifttrackapp.com/",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://lifttrackapp.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.lifttrackapp%2Flifttrack/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-missingmcp-garmin",
    "name": "com.missingmcp/garmin",
    "namespace": "com.missingmcp",
    "title": "Garmin — MissingMCP",
    "description": "Garmin data in Claude: 135 tools — activities, sleep, HRV, training, workouts. Free, open source.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-12",
    "updatedOn": "2026-07-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://missingmcp.com/garmin/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/VelkyVenik/missingmcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://missingmcp.com/garmin",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.missingmcp%2Fgarmin/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-missingmcp-whoop",
    "name": "com.missingmcp/whoop",
    "namespace": "com.missingmcp",
    "title": "WHOOP — MissingMCP",
    "description": "WHOOP recovery, strain, sleep and workouts in Claude via official WHOOP OAuth. Free, open source.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-12",
    "updatedOn": "2026-07-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://missingmcp.com/whoop/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/VelkyVenik/missingmcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://missingmcp.com/whoop",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.missingmcp%2Fwhoop/versions/1.0.0",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-myoamigo-myoamigo",
    "name": "com.myoamigo/myoamigo",
    "namespace": "com.myoamigo",
    "title": "MyoAmigo",
    "description": "Agent-first strength-training platform across iOS, Web & MCP: read & write workouts, PRs & plans.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-19",
    "updatedOn": "2026-06-19",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.myoamigo.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.myoamigo.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.myoamigo%2Fmyoamigo/versions/1.0.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-olyport-cdc-places",
    "name": "com.olyport/cdc-places",
    "namespace": "com.olyport",
    "title": "CDC PLACES Health Data",
    "description": "County and tract-level health outcomes, behaviors, and preventive services from CDC PLACES",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-04-03",
    "updatedOn": "2026-04-03",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.olyport.com/cdc-places/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://olyport.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.olyport%2Fcdc-places/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "title",
        "text": "Health Data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-pacelabintervals-workouts",
    "name": "com.pacelabintervals/workouts",
    "namespace": "com.pacelabintervals",
    "title": "Pacelab Intervals",
    "description": "Create and schedule interval workouts (Tabata, AMRAP, EMOM) from your real training history.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-20",
    "updatedOn": "2026-09-20",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://pacelabintervals.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://pacelabintervals.com/claude",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.pacelabintervals%2Fworkouts/versions/1.0.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-pack4back-nutrition",
    "name": "com.pack4back/nutrition",
    "namespace": "com.pack4back",
    "title": "Nutrition by Pack4Back",
    "description": "Log meals, water, and weight to Garmin Connect from Claude or ChatGPT.",
    "version": "0.7.17",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-08",
    "updatedOn": "2026-10-08",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://nutrition.pack4back.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/pack4back/garmin-nutrition",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://nutrition.pack4back.com/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.pack4back%2Fnutrition/versions/0.7.17",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-parameterfit-parameter",
    "name": "com.parameterfit/parameter",
    "namespace": "com.parameterfit",
    "title": "Parameter",
    "description": "Your AI writes training plans that arrive as structured workouts on iPhone and Apple Watch.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-06",
    "updatedOn": "2026-08-06",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.parameterfit.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://parameterfit.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.parameterfit%2Fparameter/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-repsworkout-reps",
    "name": "com.repsworkout/reps",
    "namespace": "com.repsworkout",
    "title": "Reps",
    "description": "Your Reps gym log in Claude or ChatGPT: workouts, PRs, progress, routines and training plans.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-18",
    "updatedOn": "2026-09-18",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.repsworkout.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://repsworkout.com/connect?utm_source=mcp-registry",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.repsworkout%2Freps/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-rhylthyme-rhylthyme",
    "name": "com.rhylthyme/rhylthyme",
    "namespace": "com.rhylthyme",
    "title": "Rhylthyme",
    "description": "Real-time multi-track schedules for cooking, lab protocols, events and workouts. Validate and share.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-17",
    "updatedOn": "2026-09-17",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.rhylthyme.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/rhylthyme/rhylthyme-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://www.rhylthyme.com",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.rhylthyme%2Frhylthyme/versions/1.3.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-rirlift-rirlift",
    "name": "com.rirlift/rirlift",
    "namespace": "com.rirlift",
    "title": "RIRLift",
    "description": "Your RIRLift strength training log: workouts, progress, volume, recovery and program drafts.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-11",
    "updatedOn": "2026-10-11",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.rirlift.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.rirlift.com/ai/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.rirlift%2Frirlift/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-tredict-mcp-server",
    "name": "com.tredict/mcp-server",
    "namespace": "com.tredict",
    "title": "Tredict",
    "description": "Analyse activities, build training plans and sync structured workouts to your sports watch.",
    "version": "0.9.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-04-18",
    "updatedOn": "2026-04-18",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://www.tredict.com/api/mcp/v2",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      },
      {
        "type": "sse",
        "url": "https://www.tredict.com/api/mcp/v2",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/tredict-com/mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://www.tredict.com/blog/mcp_server_docs/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.tredict%2Fmcp-server/versions/0.9.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "com-weight-forecast-weight-forecast",
    "name": "com.weight-forecast/weight-forecast",
    "namespace": "com.weight-forecast",
    "title": "Weight Forecast",
    "description": "Know your goal-weight date. Log food, sync Garmin, get a daily AI coach in Telegram.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-04",
    "updatedOn": "2026-10-04",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://weight-forecast.com/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.weight-forecast.com/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/com.weight-forecast%2Fweight-forecast/versions/1.0.1",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "dev-anatome-anatome",
    "name": "dev.anatome/anatome",
    "namespace": "dev.anatome",
    "title": null,
    "description": "Log workouts and meals by telling your AI. 873 exercises, muscle diagrams, food lookup.",
    "version": "2.6.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-12",
    "updatedOn": "2026-08-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://anatome.dev/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://anatome.dev",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/dev.anatome%2Fanatome/versions/2.6.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "fitness-depot-strength-programs",
    "name": "fitness.depot/strength-programs",
    "namespace": "fitness.depot",
    "title": "depot.fitness",
    "description": "Search 101 structured strength-training programs, exercises and guides from depot.fitness.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-12",
    "updatedOn": "2026-10-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://nihheurtdimdezbhrdba.supabase.co/functions/v1/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://depot.fitness",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/fitness.depot%2Fstrength-programs/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "fr-runningworkout-running-workout",
    "name": "fr.runningworkout/running-workout",
    "namespace": "fr.runningworkout",
    "title": "Running Workout",
    "description": "AI coach for Garmin: builds training plans and structured workouts, synced straight to your watch.",
    "version": "1.6.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-24",
    "updatedOn": "2026-09-24",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://www.runningworkout.fr/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.runningworkout.fr/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/fr.runningworkout%2Frunning-workout/versions/1.6.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-abhaymettu-bodylog",
    "name": "io.github.abhaymettu/bodylog",
    "namespace": "io.github.abhaymettu",
    "title": "bodylog",
    "description": "Agent-first workout and food log: sets and meals from chat, USDA and Open Food Facts macros, cards.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-23",
    "updatedOn": "2026-09-23",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "bodylog",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "BODYLOG_DB",
          "BODYLOG_CARDS",
          "FDC_API_KEY",
          "BODYLOG_OFFLINE"
        ],
        "secretEnvironmentVariables": [
          "FDC_API_KEY"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/bodylog/",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-09-23",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/abhaymettu/bodylog",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.abhaymettu%2Fbodylog/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-akutishevsky-withings",
    "name": "io.github.akutishevsky/withings",
    "namespace": "io.github.akutishevsky",
    "title": "Withings Health Data",
    "description": "MCP server for Withings health data — sleep, activity, heart, and body metrics.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-17",
    "updatedOn": "2026-02-17",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://withings-mcp.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/akutishevsky/withings-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.akutishevsky%2Fwithings/versions/1.3.0",
    "matches": [
      {
        "source": "withings",
        "term": "Withings",
        "field": "name",
        "text": "withings",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "title",
        "text": "Health Data",
        "context": null
      }
    ],
    "sources": [
      "withings",
      "general"
    ],
    "group": "withings",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-almostjacked-fitness-tools",
    "name": "io.github.almostjacked/fitness-tools",
    "namespace": "io.github.almostjacked",
    "title": "Fitness Tools",
    "description": "Deterministic fitness calculators — TDEE, adaptive TDEE, body fat, 1RM, macros — with consensus.",
    "version": "0.3.4",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-24",
    "updatedOn": "2026-07-24",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@almostjacked/fitness-tools-mcp",
        "version": "0.3.4",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@almostjacked/fitness-tools-mcp",
          "found": true,
          "latestVersion": "0.3.4",
          "lastPublished": "2026-07-24",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://fitness-tools-mcp.ajwallacemusic.workers.dev/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/almostjacked/fitness-tools",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.almostjacked%2Ffitness-tools/versions/0.3.4",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-almostjacked-health-mcp",
    "name": "io.github.almostjacked/health-mcp",
    "namespace": "io.github.almostjacked",
    "title": "Health Data (your own Supabase)",
    "description": "Your health data (weight, macros, weigh-ins) as MCP tools — in your own Supabase, zero custody.",
    "version": "0.1.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-07",
    "updatedOn": "2026-08-07",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@almostjacked/health-mcp",
        "version": "0.1.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "SUPABASE_URL",
          "SUPABASE_SECRET_KEY"
        ],
        "secretEnvironmentVariables": [
          "SUPABASE_SECRET_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@almostjacked/health-mcp",
          "found": true,
          "latestVersion": "0.1.3",
          "lastPublished": "2026-08-07",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/almostjacked/health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.almostjacked%2Fhealth-mcp/versions/0.1.3",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "title",
        "text": "Health Data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-andronaft-health-os",
    "name": "io.github.andronaft/health-os",
    "namespace": "io.github.andronaft",
    "title": "health-os",
    "description": "Local-first personal health record: labs, meds, wearables, food log, deterministic safety checks",
    "version": "0.2.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-01",
    "updatedOn": "2026-10-01",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/andronaft/health-os:0.2.1",
        "version": null,
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "DATABASE_URL",
          "READONLY_DATABASE_URL"
        ],
        "secretEnvironmentVariables": [
          "DATABASE_URL",
          "READONLY_DATABASE_URL"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/andronaft/health-os",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/andronaft/health-os",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.andronaft%2Fhealth-os/versions/0.2.1",
    "matches": [
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-anthesiallc-meddata",
    "name": "io.github.anthesiallc/meddata",
    "namespace": "io.github.anthesiallc",
    "title": null,
    "description": "Drug & supplement lookup and interaction checks from free U.S. government health data.",
    "version": "0.2.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-20",
    "updatedOn": "2026-06-20",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "meddata-mcp",
        "version": "0.2.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "MEDDATA_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "MEDDATA_API_KEY"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/meddata-mcp/",
          "found": true,
          "latestVersion": "0.2.1",
          "lastPublished": "2026-06-20",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/anthesiallc/meddata-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.anthesiallc%2Fmeddata/versions/0.2.1",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-antvsl-oura-mcp",
    "name": "io.github.AntVsl/oura-mcp",
    "namespace": "io.github.AntVsl",
    "title": "Oura Ring",
    "description": "Sleep, readiness, HRV, resting heart rate, activity and stress from your Oura Ring",
    "version": "0.4.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-30",
    "updatedOn": "2026-08-30",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "my-oura-mcp",
        "version": "0.4.2",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_REDIRECT_URI",
          "OURA_API_MODE",
          "OURA_TZ",
          "OURA_TOKEN_STORE",
          "OURA_PUBLIC_URL",
          "OURA_OAUTH_ALLOWED_REDIRECT_ORIGINS"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/my-oura-mcp/",
          "found": true,
          "latestVersion": "0.4.2",
          "lastPublished": "2026-08-30",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      },
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "docker.io/iican/oura-mcp:0.4.2",
        "version": null,
        "transport": "streamable-http",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_MCP_TOKEN",
          "OURA_PUBLIC_URL",
          "OURA_OAUTH_ALLOWED_REDIRECT_ORIGINS",
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_TZ"
        ],
        "secretEnvironmentVariables": [
          "OURA_MCP_TOKEN",
          "OURA_CLIENT_SECRET"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/AntVsl/oura_mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/AntVsl/oura_mcp#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.AntVsl%2Foura-mcp/versions/0.4.2",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "oura",
      "general"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-anup-shesh-garmin-local-mcp",
    "name": "io.github.anup-shesh/garmin-local-mcp",
    "namespace": "io.github.anup-shesh",
    "title": null,
    "description": "Local-first Garmin data warehouse: sync once to SQLite, analyze trends and correlations offline.",
    "version": "0.1.9",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-04",
    "updatedOn": "2026-10-04",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "garmin-local-mcp",
        "version": "0.1.9",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GARMIN_MCP_DATA_DIR"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/garmin-local-mcp/",
          "found": true,
          "latestVersion": "0.1.9",
          "lastPublished": "2026-10-04",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/anup-shesh/garmin-local-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.anup-shesh%2Fgarmin-local-mcp/versions/0.1.9",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-arjanlig-strava-mcp",
    "name": "io.github.ArjanLig/strava-mcp",
    "namespace": "io.github.ArjanLig",
    "title": "Strava Training MCP",
    "description": "Connect Strava training data to Claude for training load analysis and activity insights",
    "version": "0.3.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-03-26",
    "updatedOn": "2026-03-26",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "strava-training-mcp",
        "version": "0.3.2",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/strava-training-mcp/",
          "found": true,
          "latestVersion": "0.3.2",
          "lastPublished": "2026-03-26",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/ArjanLig/strava-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.ArjanLig%2Fstrava-mcp/versions/0.3.2",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-asherlc-dofek",
    "name": "io.github.Asherlc/dofek",
    "namespace": "io.github.Asherlc",
    "title": "Dofek",
    "description": "Private health and fitness analytics through a secure remote MCP connection.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-03",
    "updatedOn": "2026-09-03",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://dofek.fit/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Asherlc%2Fdofek/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-ashwanthramkl-whoop-mcp",
    "name": "io.github.AshwanthramKL/whoop-mcp",
    "namespace": "io.github.AshwanthramKL",
    "title": null,
    "description": "Read-only WHOOP v2 data for MCP clients, with local SQLite cache and CSV/JSONL/Parquet exports.",
    "version": "0.8.5",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-04-25",
    "updatedOn": "2026-04-25",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "whoop-mcp",
        "version": "0.8.5",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET",
          "WHOOP_REDIRECT_URI",
          "WHOOP_LOG_LEVEL",
          "WHOOP_LOG_FILE",
          "WHOOP_LOG_JSON"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/whoop-mcp/",
          "found": true,
          "latestVersion": "0.8.5",
          "lastPublished": "2026-04-25",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/AshwanthramKL/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.AshwanthramKL%2Fwhoop-mcp/versions/0.8.5",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      }
    ],
    "sources": [
      "whoop"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-berkkilicoglu-google-health-fitbit-mcp",
    "name": "io.github.BerkKilicoglu/google-health-fitbit-mcp",
    "namespace": "io.github.BerkKilicoglu",
    "title": null,
    "description": "Privacy-first Google Health API MCP server for health, sleep, activity and HR agents",
    "version": "1.0.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-16",
    "updatedOn": "2026-07-16",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "google-health-fitbit-mcp",
        "version": "1.0.2",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GOOGLE_HEALTH_CLIENT_ID",
          "GOOGLE_HEALTH_CLIENT_SECRET",
          "GOOGLE_HEALTH_REDIRECT_URI",
          "GOOGLE_HEALTH_TOKEN_PATH",
          "GOOGLE_HEALTH_PRIVACY_MODE",
          "GOOGLE_HEALTH_CACHE",
          "GOOGLE_HEALTH_CACHE_PATH",
          "GOOGLE_HEALTH_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "GOOGLE_HEALTH_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/google-health-fitbit-mcp",
          "found": true,
          "latestVersion": "1.0.3",
          "lastPublished": "2026-07-27",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/BerkKilicoglu/google-health-fitbit-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/BerkKilicoglu/google-health-fitbit-mcp#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.BerkKilicoglu%2Fgoogle-health-fitbit-mcp/versions/1.0.2",
    "matches": [
      {
        "source": "google-health",
        "term": "Google Health",
        "field": "name",
        "text": "google health",
        "context": null
      },
      {
        "source": "fitbit",
        "term": "Fitbit",
        "field": "name",
        "text": "fitbit",
        "context": null
      }
    ],
    "sources": [
      "google-health",
      "fitbit"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-briangaoo-totem",
    "name": "io.github.briangaoo/totem",
    "namespace": "io.github.briangaoo",
    "title": null,
    "description": "Totem — talk to your wearables with AI. Today: full Whoop access (48 tools).",
    "version": "1.4.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-08",
    "updatedOn": "2026-06-08",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@briangaoo/totem",
        "version": "1.4.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN",
          "WHOOP_EMAIL",
          "WHOOP_USER_ID",
          "WHOOP_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@briangaoo/totem",
          "found": false
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/briangaoo/totem",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.briangaoo%2Ftotem/versions/1.4.3",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "description",
        "text": "Whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-briangaoo-whoop-mcp",
    "name": "io.github.briangaoo/whoop-mcp",
    "namespace": "io.github.briangaoo",
    "title": null,
    "description": "Full read + write access to your Whoop fitness data via the private iOS API. 48 tools.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-01",
    "updatedOn": "2026-06-01",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@briangaoo/whoop-mcp",
        "version": "1.3.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN",
          "WHOOP_EMAIL",
          "WHOOP_USER_ID",
          "WHOOP_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@briangaoo/whoop-mcp",
          "found": true,
          "latestVersion": "1.3.0",
          "lastPublished": "2026-06-01",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": "Renamed to @briangaoo/totem — install that instead."
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/briangaoo/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.briangaoo%2Fwhoop-mcp/versions/1.3.0",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-cdutr-sisrun-mcp",
    "name": "io.github.cdutr/sisrun-mcp",
    "namespace": "io.github.cdutr",
    "title": "SisRUN Training Plan",
    "description": "Read your SisRUN (appsisrun.com.br) training plan: prescribed workouts, pace/HR windows, structure",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-23",
    "updatedOn": "2026-08-23",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "sisrun-mcp",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "SISRUN_EMAIL",
          "SISRUN_PASSWORD"
        ],
        "secretEnvironmentVariables": [
          "SISRUN_PASSWORD"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/sisrun-mcp/",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-08-23",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/cdutr/sisrun-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.cdutr%2Fsisrun-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-chenhunghan-garmin-mcp-app",
    "name": "io.github.chenhunghan/garmin-mcp-app",
    "namespace": "io.github.chenhunghan",
    "title": "Run Coach",
    "description": "Garmin data with interactive charts: daily briefing, training trends, workout planning. Unofficial.",
    "version": "0.9.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "garmin-mcp-app",
        "version": "0.9.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/garmin-mcp-app",
          "found": true,
          "latestVersion": "0.9.1",
          "lastPublished": "2026-10-15",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/chenhunghan/garmin-mcp-app",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/chenhunghan/garmin-mcp-app#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.chenhunghan%2Fgarmin-mcp-app/versions/0.9.1",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-chrisdoc-hevy-mcp",
    "name": "io.github.chrisdoc/hevy-mcp",
    "namespace": "io.github.chrisdoc",
    "title": "Hevy MCP Server",
    "description": "MCP server for managing workouts, routines, and exercise data through the Hevy API",
    "version": "3.2.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-17",
    "updatedOn": "2026-07-17",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "hevy-mcp",
        "version": "3.2.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "HEVY_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "HEVY_API_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/hevy-mcp",
          "found": true,
          "latestVersion": "6.2.1",
          "lastPublished": "2026-10-16",
          "license": null,
          "licenseEvidence": null,
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/chrisdoc/hevy-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.chrisdoc%2Fhevy-mcp/versions/3.2.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-cowerxdev-apitoolcalls",
    "name": "io.github.cowerxdev/apitoolcalls",
    "namespace": "io.github.cowerxdev",
    "title": "API Tool Calls",
    "description": "94 tools, one small door: home costs, fitness, QR, barcodes, Markdown, SEO, recalls.",
    "version": "0.2.5",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://apitoolcalls.com/mcp?tools=all",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://apitoolcalls.com/agent.html",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.cowerxdev%2Fapitoolcalls/versions/0.2.5",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-cphoskins-cronometer",
    "name": "io.github.cphoskins/cronometer",
    "namespace": "io.github.cphoskins",
    "title": null,
    "description": "MCP server for Cronometer — food logs, macros, fasting, biometrics, and recurring foods",
    "version": "2.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-03",
    "updatedOn": "2026-10-03",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "cronometer-mcp",
        "version": "2.3.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "CRONOMETER_USERNAME",
          "CRONOMETER_PASSWORD",
          "CRONOMETER_DATA_DIR"
        ],
        "secretEnvironmentVariables": [
          "CRONOMETER_PASSWORD"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/cronometer-mcp/",
          "found": true,
          "latestVersion": "2.3.0",
          "lastPublished": "2026-10-03",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/cphoskins/cronometer-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.cphoskins%2Fcronometer/versions/2.3.0",
    "matches": [
      {
        "source": "cronometer",
        "term": "Cronometer",
        "field": "name",
        "text": "cronometer",
        "context": null
      }
    ],
    "sources": [
      "cronometer"
    ],
    "group": "cronometer",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-csjoblom-musclesworked",
    "name": "io.github.csjoblom/musclesworked",
    "namespace": "io.github.csjoblom",
    "title": "MusclesWorked",
    "description": "Exercise-to-muscle mapping: 856 exercises, 65 muscles, workout analysis & alternatives.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-17",
    "updatedOn": "2026-02-17",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "musclesworked-mcp",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "MUSCLESWORKED_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "MUSCLESWORKED_API_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/musclesworked-mcp",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-02-17",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/csjoblom/musclesworked-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.csjoblom%2Fmusclesworked/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-csoai-org-fitness-ai-mcp",
    "name": "io.github.CSOAI-ORG/fitness-ai-mcp",
    "namespace": "io.github.CSOAI-ORG",
    "title": null,
    "description": "Fitness Ai MCP Server by MEOK AI Labs",
    "version": "1.0.11",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-19",
    "updatedOn": "2026-08-19",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "fitness-ai-mcp",
        "version": "1.0.11",
        "transport": "stdio",
        "runtimeHint": "python",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/fitness-ai-mcp/",
          "found": true,
          "latestVersion": "1.0.11",
          "lastPublished": "2026-06-27",
          "license": "MIT License",
          "licenseEvidence": "PyPI classifier \"License :: OSI Approved :: MIT License\"",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/CSOAI-ORG/fitness-ai-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.CSOAI-ORG%2Ffitness-ai-mcp/versions/1.0.11",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-csoai-org-sleep-tracker-ai-mcp",
    "name": "io.github.CSOAI-ORG/sleep-tracker-ai-mcp",
    "namespace": "io.github.CSOAI-ORG",
    "title": null,
    "description": "Sleep Tracker Ai MCP Server by MEOK AI Labs",
    "version": "1.0.9",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-19",
    "updatedOn": "2026-08-19",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "sleep-tracker-ai-mcp",
        "version": "1.0.9",
        "transport": "stdio",
        "runtimeHint": "python",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/sleep-tracker-ai-mcp/",
          "found": true,
          "latestVersion": "1.0.9",
          "lastPublished": "2026-06-13",
          "license": "MIT License",
          "licenseEvidence": "PyPI classifier \"License :: OSI Approved :: MIT License\"",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/CSOAI-ORG/sleep-tracker-ai-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.CSOAI-ORG%2Fsleep-tracker-ai-mcp/versions/1.0.9",
    "matches": [
      {
        "source": "general",
        "term": "sleep tracking",
        "field": "name",
        "text": "sleep tracker",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-csoai-org-workout-planner-ai-mcp",
    "name": "io.github.CSOAI-ORG/workout-planner-ai-mcp",
    "namespace": "io.github.CSOAI-ORG",
    "title": null,
    "description": "MCP server for workout planner ai. Features create workout, track progress, suggest exercises. From",
    "version": "1.0.10",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-19",
    "updatedOn": "2026-08-19",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "workout-planner-ai-mcp",
        "version": "1.0.10",
        "transport": "stdio",
        "runtimeHint": "python",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/workout-planner-ai-mcp/",
          "found": true,
          "latestVersion": "1.0.10",
          "lastPublished": "2026-06-13",
          "license": "MIT License",
          "licenseEvidence": "PyPI classifier \"License :: OSI Approved :: MIT License\"",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/CSOAI-ORG/workout-planner-ai-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.CSOAI-ORG%2Fworkout-planner-ai-mcp/versions/1.0.10",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-cunicopia-dev-whoop-postgres-mcp",
    "name": "io.github.cunicopia-dev/whoop-postgres-mcp",
    "namespace": "io.github.cunicopia-dev",
    "title": "WHOOP MCP",
    "description": "Sync WHOOP recovery, sleep, strain, and workouts into Postgres and query them from any MCP client.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-13",
    "updatedOn": "2026-09-13",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "whoop-postgres-mcp",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET",
          "WHOOP_REDIRECT_URI",
          "WHOOP_DB_URL"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET",
          "WHOOP_DB_URL"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/whoop-postgres-mcp/",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-09-13",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/cunicopia-dev/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.cunicopia-dev%2Fwhoop-postgres-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-cyanheads-cdc-health-mcp-server",
    "name": "io.github.cyanheads/cdc-health-mcp-server",
    "namespace": "io.github.cyanheads",
    "title": null,
    "description": "Search and query CDC public health data — mortality, vaccinations, surveillance, behavioral risk.",
    "version": "0.10.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-12",
    "updatedOn": "2026-10-12",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "@cyanheads/cdc-health-mcp-server",
        "version": "0.10.0",
        "transport": "stdio",
        "runtimeHint": "npx",
        "environmentVariables": [
          "CDC_APP_TOKEN",
          "MCP_LOG_LEVEL"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@cyanheads/cdc-health-mcp-server",
          "found": true,
          "latestVersion": "0.10.0",
          "lastPublished": "2026-10-12",
          "license": "Apache-2.0",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      },
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "@cyanheads/cdc-health-mcp-server",
        "version": "0.10.0",
        "transport": "streamable-http",
        "runtimeHint": "npx",
        "environmentVariables": [
          "MCP_TRANSPORT_TYPE",
          "CDC_APP_TOKEN",
          "MCP_HTTP_HOST",
          "MCP_HTTP_PORT",
          "MCP_HTTP_ENDPOINT_PATH",
          "MCP_AUTH_MODE",
          "MCP_LOG_LEVEL"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@cyanheads/cdc-health-mcp-server",
          "found": true,
          "latestVersion": "0.10.0",
          "lastPublished": "2026-10-12",
          "license": "Apache-2.0",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://cdc.caseyjhand.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/cyanheads/cdc-health-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.cyanheads%2Fcdc-health-mcp-server/versions/0.10.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-apple-health-mcp",
    "name": "io.github.davidmosiah/apple-health-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Unofficial local-first MCP server for Apple Health export data.",
    "version": "0.5.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "apple-health-mcp-unofficial",
        "version": "0.5.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "APPLE_HEALTH_EXPORT_PATH",
          "APPLE_HEALTH_TIMEZONE",
          "APPLE_HEALTH_PRIVACY_MODE",
          "APPLE_HEALTH_WATCH_PATH"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/apple-health-mcp-unofficial",
          "found": true,
          "latestVersion": "0.7.4",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/apple-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/apple-health",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fapple-health-mcp/versions/0.5.0",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "name",
        "text": "apple health",
        "context": null
      }
    ],
    "sources": [
      "apple-health"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-fitbitmcp",
    "name": "io.github.davidmosiah/fitbitmcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first, unofficial Fitbit MCP server for AI health, sleep, activity and heart-rate agents.",
    "version": "0.4.5",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "fitbit-mcp-unofficial",
        "version": "0.4.5",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "FITBIT_CLIENT_ID",
          "FITBIT_CLIENT_SECRET",
          "FITBIT_REDIRECT_URI",
          "FITBIT_TOKEN_PATH",
          "FITBIT_PRIVACY_MODE",
          "FITBIT_CACHE",
          "FITBIT_CACHE_PATH",
          "FITBIT_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "FITBIT_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/fitbit-mcp-unofficial",
          "found": true,
          "latestVersion": "0.6.3",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/fitbit-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/fitbit",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Ffitbitmcp/versions/0.4.5",
    "matches": [
      {
        "source": "fitbit",
        "term": "Fitbit",
        "field": "description",
        "text": "Fitbit",
        "context": null
      }
    ],
    "sources": [
      "fitbit"
    ],
    "group": "fitbit",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-garminmcp",
    "name": "io.github.davidmosiah/garminmcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first unofficial Garmin Connect MCP for AI health, sleep, activity & recovery agents.",
    "version": "0.5.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-03",
    "updatedOn": "2026-07-03",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "garmin-mcp-unofficial",
        "version": "0.5.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GARMIN_TOKEN_PATH",
          "GARMIN_PRIVACY_MODE",
          "GARMIN_CACHE",
          "GARMIN_CACHE_PATH",
          "GARMIN_DOMAIN",
          "GARMIN_NO_CACHE"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/garmin-mcp-unofficial",
          "found": true,
          "latestVersion": "0.7.6",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/garmin-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/garmin",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fgarminmcp/versions/0.5.3",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-google-health-mcp",
    "name": "io.github.davidmosiah/google-health-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first unofficial Google Health API v4 MCP server for health, sleep, activity, HR agents",
    "version": "0.5.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-13",
    "updatedOn": "2026-07-13",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "google-health-mcp-unofficial",
        "version": "0.5.2",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GOOGLE_HEALTH_CLIENT_ID",
          "GOOGLE_HEALTH_CLIENT_SECRET",
          "GOOGLE_HEALTH_REDIRECT_URI",
          "GOOGLE_HEALTH_TOKEN_PATH",
          "GOOGLE_HEALTH_PRIVACY_MODE",
          "GOOGLE_HEALTH_CACHE",
          "GOOGLE_HEALTH_CACHE_PATH",
          "GOOGLE_HEALTH_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "GOOGLE_HEALTH_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/google-health-mcp-unofficial",
          "found": true,
          "latestVersion": "0.7.8",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/google-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/google-health",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fgoogle-health-mcp/versions/0.5.2",
    "matches": [
      {
        "source": "google-health",
        "term": "Google Health",
        "field": "name",
        "text": "google health",
        "context": null
      }
    ],
    "sources": [
      "google-health"
    ],
    "group": "google-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-ouramcp",
    "name": "io.github.davidmosiah/ouramcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first, unofficial Oura MCP server for AI health, sleep, activity and heart-rate agents.",
    "version": "0.4.6",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "oura-mcp-unofficial",
        "version": "0.4.6",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_REDIRECT_URI",
          "OURA_TOKEN_PATH",
          "OURA_PRIVACY_MODE",
          "OURA_CACHE",
          "OURA_CACHE_PATH",
          "OURA_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/oura-mcp-unofficial",
          "found": true,
          "latestVersion": "0.7.4",
          "lastPublished": "2026-10-03",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/oura-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/oura",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fouramcp/versions/0.4.6",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "description",
        "text": "Oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-polarmcp",
    "name": "io.github.davidmosiah/polarmcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first unofficial Polar AccessLink v4 MCP server for AI health, sleep and training agents.",
    "version": "0.3.6",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-13",
    "updatedOn": "2026-07-13",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "polar-mcp-unofficial",
        "version": "0.3.6",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "POLAR_CLIENT_ID",
          "POLAR_CLIENT_SECRET",
          "POLAR_REDIRECT_URI",
          "POLAR_TOKEN_PATH",
          "POLAR_PRIVACY_MODE",
          "POLAR_CACHE",
          "POLAR_CACHE_PATH",
          "POLAR_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "POLAR_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/polar-mcp-unofficial",
          "found": true,
          "latestVersion": "0.5.4",
          "lastPublished": "2026-10-03",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/polar-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/polar",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fpolarmcp/versions/0.3.6",
    "matches": [
      {
        "source": "polar",
        "term": "Polar",
        "field": "description",
        "text": "Polar",
        "context": {
          "field": "description",
          "text": "health"
        }
      }
    ],
    "sources": [
      "polar"
    ],
    "group": "polar",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-samsung-health-mcp",
    "name": "io.github.davidmosiah/samsung-health-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Unofficial local-first MCP server for Samsung Health personal-data CSV/ZIP exports.",
    "version": "0.5.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "samsung-health-mcp-unofficial",
        "version": "0.5.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "SAMSUNG_HEALTH_EXPORT_PATH",
          "SAMSUNG_HEALTH_TIMEZONE",
          "SAMSUNG_HEALTH_PRIVACY_MODE",
          "SAMSUNG_HEALTH_WATCH_PATH"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/samsung-health-mcp-unofficial",
          "found": true,
          "latestVersion": "0.7.4",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/samsung-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/samsung-health",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fsamsung-health-mcp/versions/0.5.0",
    "matches": [
      {
        "source": "samsung-health",
        "term": "Samsung Health",
        "field": "name",
        "text": "samsung health",
        "context": null
      }
    ],
    "sources": [
      "samsung-health"
    ],
    "group": "samsung-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-strava-mcp",
    "name": "io.github.davidmosiah/strava-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first MCP server for Strava activities, streams, routes and training.",
    "version": "0.4.6",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "strava-mcp-unofficial",
        "version": "0.4.6",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "STRAVA_CLIENT_ID",
          "STRAVA_CLIENT_SECRET",
          "STRAVA_REDIRECT_URI",
          "STRAVA_TOKEN_PATH",
          "STRAVA_PRIVACY_MODE",
          "STRAVA_CACHE",
          "STRAVA_CACHE_PATH",
          "STRAVA_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "STRAVA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/strava-mcp-unofficial",
          "found": true,
          "latestVersion": "0.6.4",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/strava-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/strava",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fstrava-mcp/versions/0.4.6",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-wellness-cgm-mcp",
    "name": "io.github.davidmosiah/wellness-cgm-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Local-first CGM MCP for AI agents: Dexcom Developer API + FreeStyle Libre via LibreLink Up.",
    "version": "0.4.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-29",
    "updatedOn": "2026-05-29",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "wellness-cgm-mcp",
        "version": "0.4.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/wellness-cgm-mcp",
          "found": true,
          "latestVersion": "0.6.4",
          "lastPublished": "2026-08-29",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/wellness-cgm-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/cgm",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fwellness-cgm-mcp/versions/0.4.0",
    "matches": [
      {
        "source": "dexcom",
        "term": "Dexcom",
        "field": "description",
        "text": "Dexcom",
        "context": null
      }
    ],
    "sources": [
      "dexcom"
    ],
    "group": "dexcom",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-whoop-mcp",
    "name": "io.github.davidmosiah/whoop-mcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first, unofficial WHOOP MCP server for AI health, sleep, recovery, and performance agents.",
    "version": "0.5.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-03",
    "updatedOn": "2026-07-03",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "whoop-mcp-unofficial",
        "version": "0.5.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET",
          "WHOOP_REDIRECT_URI",
          "WHOOP_TOKEN_PATH",
          "WHOOP_PRIVACY_MODE",
          "WHOOP_CACHE",
          "WHOOP_CACHE_PATH",
          "WHOOP_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/whoop-mcp-unofficial",
          "found": true,
          "latestVersion": "0.6.6",
          "lastPublished": "2026-10-03",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/whoop",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fwhoop-mcp/versions/0.5.3",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      }
    ],
    "sources": [
      "whoop"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-davidmosiah-withingsmcp",
    "name": "io.github.davidmosiah/withingsmcp",
    "namespace": "io.github.davidmosiah",
    "title": null,
    "description": "Privacy-first, unofficial Withings MCP server for AI health, sleep, activity and heart-rate agents.",
    "version": "0.4.7",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-03",
    "updatedOn": "2026-07-03",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "withings-mcp-unofficial",
        "version": "0.4.7",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WITHINGS_CLIENT_ID",
          "WITHINGS_CLIENT_SECRET",
          "WITHINGS_REDIRECT_URI",
          "WITHINGS_TOKEN_PATH",
          "WITHINGS_PRIVACY_MODE",
          "WITHINGS_CACHE",
          "WITHINGS_CACHE_PATH",
          "WITHINGS_NO_CACHE"
        ],
        "secretEnvironmentVariables": [
          "WITHINGS_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/withings-mcp-unofficial",
          "found": true,
          "latestVersion": "0.5.5",
          "lastPublished": "2026-10-03",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/davidmosiah/withings-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://wellness.delx.ai/connectors/withings",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.davidmosiah%2Fwithingsmcp/versions/0.4.7",
    "matches": [
      {
        "source": "withings",
        "term": "Withings",
        "field": "description",
        "text": "Withings",
        "context": null
      }
    ],
    "sources": [
      "withings"
    ],
    "group": "withings",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-dengxuhui-igpsport-mcp",
    "name": "io.github.dengxuhui/igpsport-mcp",
    "namespace": "io.github.dengxuhui",
    "title": null,
    "description": "iGPSport cycling data with training metrics (NP/IF/TSS/CTL/ATL/TSB) and workout generation",
    "version": "0.7.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-30",
    "updatedOn": "2026-06-30",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "igpsport-mcp",
        "version": "0.7.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "IGPSPORT_USERNAME",
          "IGPSPORT_PASSWORD",
          "IGPSPORT_REGION",
          "IGPSPORT_FTP",
          "IGPSPORT_LTHR"
        ],
        "secretEnvironmentVariables": [
          "IGPSPORT_USERNAME",
          "IGPSPORT_PASSWORD"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/igpsport-mcp/",
          "found": true,
          "latestVersion": "0.7.1",
          "lastPublished": "2026-06-30",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/dengxuhui/igpsport-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.dengxuhui%2Figpsport-mcp/versions/0.7.1",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-deugene-connect-iq-mcp",
    "name": "io.github.deugene/connect-iq-mcp",
    "namespace": "io.github.deugene",
    "title": "ConnectIQ MCP Server",
    "description": "MCP server for Garmin ConnectIQ SDK documentation and resources",
    "version": "1.2.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-03-14",
    "updatedOn": "2026-03-14",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "connectiq-mcp-server",
        "version": "1.2.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/connectiq-mcp-server",
          "found": true,
          "latestVersion": "1.3.0",
          "lastPublished": "2026-03-18",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/deugene/connect-iq-mcp.git",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/deugene/connect-iq-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.deugene%2Fconnect-iq-mcp/versions/1.2.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-diecoscai-hevy-mcp",
    "name": "io.github.diecoscai/hevy-mcp",
    "namespace": "io.github.diecoscai",
    "title": "Hevy MCP",
    "description": "MCP server for the Hevy fitness API — spec-generated schemas, dry-run-safe writes, easy setup.",
    "version": "0.5.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-22",
    "updatedOn": "2026-05-22",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@diecoscai/hevy-mcp",
        "version": "0.5.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@diecoscai/hevy-mcp",
          "found": true,
          "latestVersion": "0.5.0",
          "lastPublished": "2026-05-22",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/diecoscai/hevy-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.diecoscai%2Fhevy-mcp/versions/0.5.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-dropflyai-fitfly-engine",
    "name": "io.github.dropflyai/fitfly-engine",
    "namespace": "io.github.dropflyai",
    "title": null,
    "description": "Deterministic fitness coaching engine: adaptive programs, progression math, readiness autoregulation",
    "version": "0.2.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-02",
    "updatedOn": "2026-07-02",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://workout-engine-production-5dd7.up.railway.app/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://workout-engine-production-5dd7.up.railway.app/connect",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.dropflyai%2Ffitfly-engine/versions/0.2.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-dynamicsninja-garminconnect",
    "name": "io.github.DynamicsNinja/garminconnect",
    "namespace": "io.github.DynamicsNinja",
    "title": "Garmin Connect",
    "description": "Unofficial Garmin Connect access: sleep, HRV, training, activities, workouts and weight.",
    "version": "0.9.4",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://garmin.ficdev.xyz/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/DynamicsNinja/garminconnect-js",
    "repositorySource": "github",
    "repositorySubfolder": "mcp",
    "websiteUrl": "https://garmin.ficdev.xyz/claude",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.DynamicsNinja%2Fgarminconnect/versions/0.9.4",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "title",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-endurancetools-garmin-mcp",
    "name": "io.github.endurancetools/garmin-mcp",
    "namespace": "io.github.endurancetools",
    "title": null,
    "description": "Unofficial Garmin Connect server: training load, form, HRV readiness and workouts for your watch",
    "version": "0.4.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "garmin-mcp-server",
        "version": "0.4.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GARMIN_DATA_DIR",
          "GARMIN_REGION",
          "GARMIN_ENABLE_DESTRUCTIVE"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/garmin-mcp-server",
          "found": true,
          "latestVersion": "0.4.1",
          "lastPublished": "2026-10-16",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/endurancetools/garmin-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.endurancetools%2Fgarmin-mcp/versions/0.4.1",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-fino-wind-vaultbeat",
    "name": "io.github.Fino-wind/vaultbeat",
    "namespace": "io.github.Fino-wind",
    "title": null,
    "description": "Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine",
    "version": "0.4.5",
    "versionRule": "registry isLatest",
    "status": "deprecated",
    "statusMessage": "Renamed to io.github.Fino-wind/vaultbeat-apple-health. The PyPI package was renamed too: install vaultbeat-apple-health, not vaultbeat-mcp — the old package name now only forwards to it. Existing pairings are unaffected.",
    "publishedOn": "2026-08-18",
    "updatedOn": "2026-09-22",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "vaultbeat-mcp",
        "version": "0.4.5",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/vaultbeat-mcp/",
          "found": true,
          "latestVersion": "0.6.2",
          "lastPublished": "2026-09-22",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Fino-wind/vaultbeat-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Fino-wind%2Fvaultbeat/versions/0.4.5",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "description",
        "text": "Apple Health",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "Health data",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-fino-wind-vaultbeat-apple-health",
    "name": "io.github.Fino-wind/vaultbeat-apple-health",
    "namespace": "io.github.Fino-wind",
    "title": null,
    "description": "Your AI agent reads your Apple Health data: sleep, HRV, cycle, workouts. Decrypted on your machine",
    "version": "0.9.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-13",
    "updatedOn": "2026-10-13",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "vaultbeat-apple-health",
        "version": "0.9.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/vaultbeat-apple-health/",
          "found": true,
          "latestVersion": "0.9.3",
          "lastPublished": "2026-10-13",
          "license": null,
          "licenseEvidence": null,
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Fino-wind/vaultbeat-apple-health",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Fino-wind%2Fvaultbeat-apple-health/versions/0.9.3",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "name",
        "text": "apple health",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "Health data",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-fmp-projects-fitness-ai-connector",
    "name": "io.github.fmp-projects/fitness-ai-connector",
    "namespace": "io.github.fmp-projects",
    "title": "Fitness AI Connector",
    "description": "Garmin data in Claude & ChatGPT via the Garmin Health API. OAuth sign-in, no password sharing.",
    "version": "2.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-03",
    "updatedOn": "2026-07-03",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://garmin-mcp-nuqd.onrender.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/fmp-projects/fitness-ai-connector",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://fmp.it.com/en/fitness-ai/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.fmp-projects%2Ffitness-ai-connector/versions/2.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-futureweb-intervals-mcp-server",
    "name": "io.github.futureweb/intervals-mcp-server",
    "namespace": "io.github.futureweb",
    "title": "Futureweb Intervals MCP",
    "description": "Self-hosted Intervals.icu MCP server: training analytics, Garmin data, wellness, workout planning",
    "version": "1.0.0b2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "futureweb-intervals-mcp",
        "version": "1.0.0b2",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "API_KEY",
          "ATHLETE_ID",
          "MCP_PERMISSIONS",
          "MCP_TOOLSET",
          "ATHLETE_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "API_KEY"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/futureweb-intervals-mcp/",
          "found": true,
          "latestVersion": "1.0.0b2",
          "lastPublished": "2026-10-15",
          "license": "GPL-3.0-only",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      },
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/futureweb/intervals-mcp-server:1.0.0b2",
        "version": null,
        "transport": "stdio",
        "runtimeHint": "docker",
        "environmentVariables": [
          "API_KEY",
          "ATHLETE_ID",
          "MCP_PERMISSIONS",
          "MCP_TOOLSET",
          "ATHLETE_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "API_KEY"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/futureweb/intervals-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/futureweb/intervals-mcp-server",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.futureweb%2Fintervals-mcp-server/versions/1.0.0b2",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-gabrielmahia-kenya-health-mcp",
    "name": "io.github.gabrielmahia/kenya-health-mcp",
    "namespace": "io.github.gabrielmahia",
    "title": null,
    "description": "MCP server for Kenya health data: SHIF contributions (NHIF's successor), a small facility sample, ma",
    "version": "0.1.9",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-17",
    "updatedOn": "2026-10-17",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "kenya-health-mcp",
        "version": "0.1.9",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/kenya-health-mcp/",
          "found": true,
          "latestVersion": "0.1.9",
          "lastPublished": "2026-10-17",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/gabrielmahia/kenya-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.gabrielmahia%2Fkenya-health-mcp/versions/0.1.9",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-goodturnstudio-planmyworkout",
    "name": "io.github.GoodTurnStudio/planmyworkout",
    "namespace": "io.github.GoodTurnStudio",
    "title": "Plan My Workout",
    "description": "A workout plan for your goal, level, days and equipment, and how to do any exercise.",
    "version": "1.2.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-28",
    "updatedOn": "2026-09-28",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://goodturn-mcp.pages.dev/planmyworkout/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/GoodTurnStudio/goodturn-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://goodturn-mcp.pages.dev/planmyworkout",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.GoodTurnStudio%2Fplanmyworkout/versions/1.2.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "title",
        "text": "Workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-goodturnstudio-syncmycycle",
    "name": "io.github.GoodTurnStudio/syncmycycle",
    "namespace": "io.github.GoodTurnStudio",
    "title": "Sync My Cycle",
    "description": "Your likely menstrual cycle phase today and this week, with food and workout ideas.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-28",
    "updatedOn": "2026-09-28",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://goodturn-mcp.pages.dev/syncmycycle/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/GoodTurnStudio/goodturn-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://goodturn-mcp.pages.dev/syncmycycle",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.GoodTurnStudio%2Fsyncmycycle/versions/1.3.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-googlarz-suunto-mcp",
    "name": "io.github.googlarz/suunto-mcp",
    "namespace": "io.github.googlarz",
    "title": "Suunto MCP",
    "description": "Suunto watch data (workouts, sleep, recovery, 24/7 activity) for Claude and other AI assistants.",
    "version": "0.19.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "suunto-mcp",
        "version": "0.19.2",
        "transport": "stdio",
        "runtimeHint": "npx",
        "environmentVariables": [
          "SUUNTO_CLIENT_ID",
          "SUUNTO_CLIENT_SECRET",
          "SUUNTO_SUBSCRIPTION_KEY"
        ],
        "secretEnvironmentVariables": [
          "SUUNTO_CLIENT_SECRET",
          "SUUNTO_SUBSCRIPTION_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/suunto-mcp",
          "found": true,
          "latestVersion": "0.19.2",
          "lastPublished": "2026-10-15",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/googlarz/suunto-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/googlarz/suunto-mcp#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.googlarz%2Fsuunto-mcp/versions/0.19.2",
    "matches": [
      {
        "source": "suunto",
        "term": "Suunto",
        "field": "name",
        "text": "suunto",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "suunto",
      "general"
    ],
    "group": "suunto",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-hhopke-intervals-icu-mcp",
    "name": "io.github.hhopke/intervals-icu-mcp",
    "namespace": "io.github.hhopke",
    "title": null,
    "description": "Read/write Intervals.icu MCP server: activities, wellness, calendar, gear, and workouts.",
    "version": "5.6.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-08",
    "updatedOn": "2026-10-08",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "intervals-icu-mcp",
        "version": "5.6.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "INTERVALS_ICU_API_KEY",
          "INTERVALS_ICU_ATHLETE_ID"
        ],
        "secretEnvironmentVariables": [
          "INTERVALS_ICU_API_KEY"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/intervals-icu-mcp/",
          "found": true,
          "latestVersion": "5.6.0",
          "lastPublished": "2026-10-08",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/hhopke/intervals-icu-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.hhopke%2Fintervals-icu-mcp/versions/5.6.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-imgrund-hybridlog",
    "name": "io.github.Imgrund/hybridlog",
    "namespace": "io.github.Imgrund",
    "title": "hybridlog",
    "description": "Reads your own Garmin mirror: readiness, training load, muscle freshness, and read-only SQL.",
    "version": "0.1.13",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-03",
    "updatedOn": "2026-09-03",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/imgrund/hybridlog:0.1.13",
        "version": null,
        "transport": "stdio",
        "runtimeHint": "docker",
        "environmentVariables": [
          "DATABASE_URL",
          "APP_KEY"
        ],
        "secretEnvironmentVariables": [
          "DATABASE_URL",
          "APP_KEY"
        ],
        "facts": null
      }
    ],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://{hybridlog_host}/mcp/garmin",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [
          "hybridlog_host"
        ],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/Imgrund/hybridlog",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/Imgrund/hybridlog#connect-an-ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Imgrund%2Fhybridlog/versions/0.1.13",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-jefflitt1-health4ai",
    "name": "io.github.jefflitt1/health4ai",
    "namespace": "io.github.jefflitt1",
    "title": "health4ai",
    "description": "Query your Apple Health data from your own Supabase/Postgres via local MCP.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-19",
    "updatedOn": "2026-09-19",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "health4ai",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "DATABASE_URL",
          "HEALTHKIT_USER_ID"
        ],
        "secretEnvironmentVariables": [
          "DATABASE_URL"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/health4ai/",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-09-19",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/jefflitt1/health4ai",
    "repositorySource": "github",
    "repositorySubfolder": "mcp-server",
    "websiteUrl": "https://health4.ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jefflitt1%2Fhealth4ai/versions/0.1.0",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "description",
        "text": "Apple Health",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "Health data",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-jenwein-mifit",
    "name": "io.github.Jenwein/mifit",
    "namespace": "io.github.Jenwein",
    "title": "mifit",
    "description": "Read-only access to your own Mi Fitness (Xiaomi) data: sleep, heart rate, steps, workouts",
    "version": "0.3.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "mifit",
        "version": "0.3.2",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/mifit/",
          "found": true,
          "latestVersion": "0.3.2",
          "lastPublished": "2026-10-16",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Jenwein/mifit",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Jenwein%2Fmifit/versions/0.3.2",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "Fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-jezue-fitatu-api",
    "name": "io.github.Jezue/fitatu-api",
    "namespace": "io.github.Jezue",
    "title": "Fitatu",
    "description": "Unofficial Fitatu calorie counter: read and log food, weight, water and workouts.",
    "version": "0.6.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "fitatu-api",
        "version": "0.6.0",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "FITATU_SESSION"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/fitatu-api/",
          "found": true,
          "latestVersion": "0.6.0",
          "lastPublished": "2026-10-15",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Jezue/fitatu_library",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/Jezue/fitatu_library/blob/main/docs/AGENTS.md#mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Jezue%2Ffitatu-api/versions/0.6.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-jordanburke-oura-ring-mcp-server",
    "name": "io.github.jordanburke/oura-ring-mcp-server",
    "namespace": "io.github.jordanburke",
    "title": null,
    "description": "Oura Ring MCP server for the Oura API v2: sleep, readiness, activity, heart rate, and more.",
    "version": "0.2.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-13",
    "updatedOn": "2026-07-13",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "oura-ring-mcp-server",
        "version": "0.2.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_SANDBOX",
          "TRANSPORT_TYPE",
          "PORT",
          "HOST",
          "OURA_TELEMETRY_FILE",
          "OURA_TELEMETRY_CONSOLE"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/oura-ring-mcp-server",
          "found": true,
          "latestVersion": "0.2.0",
          "lastPublished": "2026-07-13",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/jordanburke/oura-ring-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.jordanburke%2Foura-ring-mcp-server/versions/0.2.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-krumjahn-health-analyzer-mcp",
    "name": "io.github.krumjahn/health-analyzer-mcp",
    "namespace": "io.github.krumjahn",
    "title": "Apple Health MCP Server",
    "description": "Apple Health data for Claude, Cursor, and any MCP client — 100% local on your Mac.",
    "version": "1.1.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-01",
    "updatedOn": "2026-08-01",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "health-analyzer-mcp",
        "version": "1.1.2",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "HEALTH_ANALYZER_TOKEN",
          "HEALTH_ANALYZER_TOKEN_FILE"
        ],
        "secretEnvironmentVariables": [
          "HEALTH_ANALYZER_TOKEN"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/health-analyzer-mcp",
          "found": true,
          "latestVersion": "1.1.2",
          "lastPublished": "2026-08-01",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/krumjahn/MacHealthAnalyzer",
    "repositorySource": "github",
    "repositorySubfolder": "mcp-server",
    "websiteUrl": "https://applehealthdata.com/apple-health-mcp/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.krumjahn%2Fhealth-analyzer-mcp/versions/1.1.2",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "title",
        "text": "Apple Health",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "Health data",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-leo-runningcoach-coachleo",
    "name": "io.github.leo-runningcoach/coachleo",
    "namespace": "io.github.leo-runningcoach",
    "title": "Leo Training",
    "description": "Running, trail and triathlon coach. Reads Strava, Garmin, COROS, Suunto, Polar. Adapts to your feel.",
    "version": "1.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.leotraining.app/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/leo-runningcoach/coachleo",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://leotraining.app",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.leo-runningcoach%2Fcoachleo/versions/1.1.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "polar",
        "term": "Polar",
        "field": "description",
        "text": "Polar",
        "context": {
          "field": "title",
          "text": "Training"
        }
      },
      {
        "source": "suunto",
        "term": "Suunto",
        "field": "description",
        "text": "Suunto",
        "context": null
      },
      {
        "source": "coros",
        "term": "COROS",
        "field": "description",
        "text": "COROS",
        "context": null
      },
      {
        "source": "strava",
        "term": "Strava",
        "field": "description",
        "text": "Strava",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "polar",
      "suunto",
      "coros",
      "strava"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-ljcl-strava-mcp",
    "name": "io.github.ljcl/strava-mcp",
    "namespace": "io.github.ljcl",
    "title": null,
    "description": "Remote MCP server for your Strava activities, segments, and routes",
    "version": "3.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-23",
    "updatedOn": "2026-08-23",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/ljcl/strava-mcp:3.0.0",
        "version": null,
        "transport": "streamable-http",
        "runtimeHint": "docker",
        "environmentVariables": [
          "STRAVA_CLIENT_ID",
          "STRAVA_CLIENT_SECRET",
          "PUBLIC_URL",
          "STRAVA_ACCESS_TOKEN",
          "STRAVA_REFRESH_TOKEN",
          "MCP_AUTH_TOKEN",
          "PORT",
          "TOKEN_DATA_DIR",
          "ROUTE_EXPORT_PATH"
        ],
        "secretEnvironmentVariables": [
          "STRAVA_CLIENT_SECRET",
          "STRAVA_ACCESS_TOKEN",
          "STRAVA_REFRESH_TOKEN",
          "MCP_AUTH_TOKEN"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/ljcl/strava-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/ljcl/strava-mcp#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.ljcl%2Fstrava-mcp/versions/3.0.0",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-lkennedyshare-hybriqx-workout-adaptation",
    "name": "io.github.LKennedyShare/hybriqx-workout-adaptation",
    "namespace": "io.github.LKennedyShare",
    "title": "Hybriqx Workout Adaptation",
    "description": "Advisory workout adaptation via hosted MCP and x402. Python buyer with operator-approved tools.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://www.hybriqx.com/mcp/",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/LKennedyShare/hybriqx-workout-assistant",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.LKennedyShare%2Fhybriqx-workout-adaptation/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mason-levyy-mfp-mcp",
    "name": "io.github.Mason-Levyy/mfp-mcp",
    "namespace": "io.github.Mason-Levyy",
    "title": "MyFitnessPal",
    "description": "MCP server for MyFitnessPal: log, search, and analyze your food diary.",
    "version": "0.4.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-30",
    "updatedOn": "2026-09-30",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "mfp-mcp",
        "version": "0.4.1",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "MFP_COOKIE",
          "MFP_USERNAME"
        ],
        "secretEnvironmentVariables": [
          "MFP_COOKIE"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/mfp-mcp/",
          "found": true,
          "latestVersion": "0.4.1",
          "lastPublished": "2026-09-30",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Mason-Levyy/myfitnesspal-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Mason-Levyy%2Fmfp-mcp/versions/0.4.1",
    "matches": [
      {
        "source": "myfitnesspal",
        "term": "MyFitnessPal",
        "field": "title",
        "text": "MyFitnessPal",
        "context": null
      }
    ],
    "sources": [
      "myfitnesspal"
    ],
    "group": "myfitnesspal",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mbrionesalvarez-caddie-mcp",
    "name": "io.github.mbrionesalvarez/caddie-mcp",
    "namespace": "io.github.mbrionesalvarez",
    "title": null,
    "description": "Your Garmin golf data in Claude: GPS shots, strokes gained, club distances, health context",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-11",
    "updatedOn": "2026-08-11",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "caddie-mcp",
        "version": "1.0.1",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/caddie-mcp/",
          "found": true,
          "latestVersion": "1.0.1",
          "lastPublished": "2026-08-11",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/mbrionesalvarez/caddie-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/mbrionesalvarez/caddie-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mbrionesalvarez%2Fcaddie-mcp/versions/1.0.1",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mcp-dir-garmin-mcp",
    "name": "io.github.mcp-dir/garmin-mcp",
    "namespace": "io.github.mcp-dir",
    "title": "Garmin Connect (treinos)",
    "description": "List, fetch, create, edit (replace), delete and schedule structured workouts on Garmin Connect (runn",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-10",
    "updatedOn": "2026-06-10",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.mcp.ai/p_garmin",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/mcp-dir/garmin-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mcp-dir%2Fgarmin-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mcp-dir-mfit-mcp",
    "name": "io.github.mcp-dir/mfit-mcp",
    "namespace": "io.github.mcp-dir",
    "title": "MFIT Personal",
    "description": "Client, workout, body composition, retention and finance management for personal trainers.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-10",
    "updatedOn": "2026-06-10",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.mcp.ai/p_mfit",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/mcp-dir/mfit-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mcp-dir%2Fmfit-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mcp-dir-whoop-mcp",
    "name": "io.github.mcp-dir/whoop-mcp",
    "namespace": "io.github.mcp-dir",
    "title": "WHOOP",
    "description": "Your WHOOP data in the assistant, read-only: recovery, sleep, strain, workouts, cycles and body meas",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-21",
    "updatedOn": "2026-08-21",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://api.mcp.ai/p_whoop",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/mcp-dir/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mcp-dir%2Fwhoop-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-millerchou-strava-mcp-bridge",
    "name": "io.github.millerchou/strava-mcp-bridge",
    "namespace": "io.github.millerchou",
    "title": "Strava MCP Bridge",
    "description": "Use Strava's official MCP from Codex and other local stdio clients without a developer app.",
    "version": "0.1.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-11",
    "updatedOn": "2026-07-11",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "strava-mcp-bridge",
        "version": "0.1.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/strava-mcp-bridge",
          "found": true,
          "latestVersion": "0.1.1",
          "lastPublished": "2026-07-11",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/millerchou/strava-mcp-bridge",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/millerchou/strava-mcp-bridge#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.millerchou%2Fstrava-mcp-bridge/versions/0.1.1",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mitchhankins01-oura-ring-mcp",
    "name": "io.github.mitchhankins01/oura-ring-mcp",
    "namespace": "io.github.mitchhankins01",
    "title": null,
    "description": "Connect your Oura Ring to Claude AI assistants. Health metrics with smart analysis tools.",
    "version": "0.1.4",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-01-25",
    "updatedOn": "2026-01-25",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "oura-ring-mcp",
        "version": "0.1.4",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_ACCESS_TOKEN",
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET"
        ],
        "secretEnvironmentVariables": [
          "OURA_ACCESS_TOKEN",
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/oura-ring-mcp",
          "found": true,
          "latestVersion": "0.1.4",
          "lastPublished": "2026-01-25",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/mitchhankins01/oura-ring-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mitchhankins01%2Foura-ring-mcp/versions/0.1.4",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mrfentmen-suunto-mcp",
    "name": "io.github.mrfentmen/suunto-mcp",
    "namespace": "io.github.mrfentmen",
    "title": null,
    "description": "Suunto API: workout history, summaries. Needs OAuth token.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-22",
    "updatedOn": "2026-09-22",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@mrfentmen/suunto-mcp",
        "version": "1.0.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@mrfentmen/suunto-mcp",
          "found": true,
          "latestVersion": "1.0.0",
          "lastPublished": "2026-09-22",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/mrfentmen/awesome-mcps",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mrfentmen%2Fsuunto-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "suunto",
        "term": "Suunto",
        "field": "name",
        "text": "suunto",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "suunto",
      "general"
    ],
    "group": "suunto",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-mrfentmen-wger-mcp",
    "name": "io.github.mrfentmen/wger-mcp",
    "namespace": "io.github.mrfentmen",
    "title": null,
    "description": "Exercises, muscles, and workout data from the open wger database. No key required.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-21",
    "updatedOn": "2026-09-21",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@mrfentmen/wger-mcp",
        "version": "1.0.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@mrfentmen/wger-mcp",
          "found": true,
          "latestVersion": "1.0.4",
          "lastPublished": "2026-10-01",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/mrfentmen/wger-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.mrfentmen%2Fwger-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-musette-cc-musette-mcp",
    "name": "io.github.musette-cc/musette-mcp",
    "namespace": "io.github.musette-cc",
    "title": null,
    "description": "AI soigneur for cyclists: Strava ride to an Ien-Vitse-validated nutrition plan + orderable box.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-30",
    "updatedOn": "2026-06-30",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.musette.cc",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/musette-cc/musette-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://www.musette.cc/mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.musette-cc%2Fmusette-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "description",
        "text": "Strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-nasseralbusaidi-macrofactor-mcp",
    "name": "io.github.NasserAlbusaidi/macrofactor-mcp",
    "namespace": "io.github.NasserAlbusaidi",
    "title": null,
    "description": "Fueling & recovery decision engine combining MacroFactor nutrition with Garmin training data",
    "version": "0.1.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-10",
    "updatedOn": "2026-07-10",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "macrofactor-mcp",
        "version": "0.1.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "MACROFACTOR_DB_PATH",
          "MACROFACTOR_DATA_DIR",
          "GARMINTOKENS"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/macrofactor-mcp/",
          "found": true,
          "latestVersion": "0.1.1",
          "lastPublished": "2026-07-10",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/NasserAlbusaidi/macrofactor-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.NasserAlbusaidi%2Fmacrofactor-mcp/versions/0.1.1",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-naymevg-health-mcp",
    "name": "io.github.naymEvg/health-mcp",
    "namespace": "io.github.naymEvg",
    "title": "Health Hub MCP",
    "description": "Self-hosted MCP server for Android Health Connect — 34 metrics, daily rollups, dedup, 5 LLM tools.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-11",
    "updatedOn": "2026-08-11",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://{host}/mcp-health",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [
          "host"
        ],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/naymEvg/health-conect-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/naymEvg/health-conect-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.naymEvg%2Fhealth-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "health-connect",
        "term": "Health Connect",
        "field": "description",
        "text": "Health Connect",
        "context": null
      }
    ],
    "sources": [
      "health-connect"
    ],
    "group": "health-connect",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-neiltron-apple-health-mcp",
    "name": "io.github.neiltron/apple-health-mcp",
    "namespace": "io.github.neiltron",
    "title": "Apple Health",
    "description": "Local-first Apple Health MCP server for questions about your sleep, workouts and heart data.",
    "version": "1.4.5",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-20",
    "updatedOn": "2026-09-20",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "@neiltron/apple-health-mcp",
        "version": "1.4.5",
        "transport": "stdio",
        "runtimeHint": "npx",
        "environmentVariables": [
          "HEALTH_DATA_DIR",
          "MAX_MEMORY_MB",
          "CACHE_SIZE"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@neiltron/apple-health-mcp",
          "found": true,
          "latestVersion": "1.4.5",
          "lastPublished": "2026-09-20",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/neiltron/apple-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/neiltron/apple-health-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.neiltron%2Fapple-health-mcp/versions/1.4.5",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "name",
        "text": "apple health",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-nftechie-transition-mcp",
    "name": "io.github.nftechie/transition-mcp",
    "namespace": "io.github.nftechie",
    "title": null,
    "description": "AI-powered multisport coaching — workouts, training plans, and performance analytics.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-09",
    "updatedOn": "2026-02-09",
    "packages": [
      {
        "registryType": "mcpb",
        "registryBaseUrl": null,
        "identifier": "https://github.com/nftechie/transition-mcp/releases/download/v1.0.0/transition-mcp-darwin-arm64",
        "version": "1.0.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "TRANSITION_API_KEY",
          "TRANSITION_API_URL"
        ],
        "secretEnvironmentVariables": [
          "TRANSITION_API_KEY"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/nftechie/transition-mcp",
    "repositorySource": "github",
    "repositorySubfolder": "mcp",
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.nftechie%2Ftransition-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-osjayaprakash-oura-ring-python-mcp",
    "name": "io.github.osjayaprakash/oura-ring-python-mcp",
    "namespace": "io.github.osjayaprakash",
    "title": "Oura Ring",
    "description": "Read-only Oura Ring sleep, readiness, activity, stress and heart rate data (OAuth2)",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-27",
    "updatedOn": "2026-09-27",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "oura-ring-python-mcp",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_TOKEN_FILE",
          "OURA_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/oura-ring-python-mcp/",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-09-27",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      },
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/osjayaprakash/oura-ring-python-mcp:0.1.0",
        "version": null,
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/osjayaprakash/oura-ring-python-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://oura-ring-python-mcp.readthedocs.io",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.osjayaprakash%2Foura-ring-python-mcp/versions/0.1.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-pablo-albaladejo-kaiord",
    "name": "io.github.pablo-albaladejo/kaiord",
    "namespace": "io.github.pablo-albaladejo",
    "title": null,
    "description": "Convert, validate, and inspect workout files (FIT, TCX, ZWO, Garmin Connect) for AI agents.",
    "version": "10.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-18",
    "updatedOn": "2026-07-18",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@kaiord/mcp",
        "version": "10.0.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@kaiord/mcp",
          "found": true,
          "latestVersion": "10.3.0",
          "lastPublished": "2026-10-11",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/pablo-albaladejo/kaiord",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://kaiord.com/docs/mcp/tools",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.pablo-albaladejo%2Fkaiord/versions/10.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-partymola-fitbit-mcp",
    "name": "io.github.partymola/fitbit-mcp",
    "namespace": "io.github.partymola",
    "title": null,
    "description": "Retired, superseded by google-health-mcp. Fitbit Web API shuts down 30 Sept 2026.",
    "version": "0.6.0",
    "versionRule": "registry isLatest",
    "status": "deprecated",
    "statusMessage": "Superseded by io.github.partymola/google-health-mcp",
    "publishedOn": "2026-08-20",
    "updatedOn": "2026-10-01",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "fitbit-mcp",
        "version": "0.6.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/fitbit-mcp/",
          "found": true,
          "latestVersion": "0.6.0",
          "lastPublished": "2026-08-20",
          "license": "GPL-3.0-or-later",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/partymola/fitbit-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.partymola%2Ffitbit-mcp/versions/0.6.0",
    "matches": [
      {
        "source": "fitbit",
        "term": "Fitbit",
        "field": "name",
        "text": "fitbit",
        "context": null
      }
    ],
    "sources": [
      "fitbit"
    ],
    "group": "fitbit",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-partymola-google-health-mcp",
    "name": "io.github.partymola/google-health-mcp",
    "namespace": "io.github.partymola",
    "title": null,
    "description": "MCP server for the Google Health API, with a local SQLite cache and trend analysis.",
    "version": "1.8.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-04",
    "updatedOn": "2026-10-04",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "google-health-mcp",
        "version": "1.8.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/google-health-mcp/",
          "found": true,
          "latestVersion": "1.8.0",
          "lastPublished": "2026-10-04",
          "license": "GPL-3.0-or-later",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/partymola/google-health-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.partymola%2Fgoogle-health-mcp/versions/1.8.0",
    "matches": [
      {
        "source": "google-health",
        "term": "Google Health",
        "field": "name",
        "text": "google health",
        "context": null
      }
    ],
    "sources": [
      "google-health"
    ],
    "group": "google-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-partymola-withings-mcp",
    "name": "io.github.partymola/withings-mcp",
    "namespace": "io.github.partymola",
    "title": null,
    "description": "MCP server for the Withings Health API with OAuth, local SQLite cache, and trend analysis.",
    "version": "0.8.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-06",
    "updatedOn": "2026-09-06",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "withings-mcp",
        "version": "0.8.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/withings-mcp/",
          "found": true,
          "latestVersion": "0.8.0",
          "lastPublished": "2026-09-06",
          "license": "GPL-3.0-or-later",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/partymola/withings-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.partymola%2Fwithings-mcp/versions/0.8.0",
    "matches": [
      {
        "source": "withings",
        "term": "Withings",
        "field": "name",
        "text": "withings",
        "context": null
      }
    ],
    "sources": [
      "withings"
    ],
    "group": "withings",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-philipad-health-export-mcp",
    "name": "io.github.PhilipAD/health-export-mcp",
    "namespace": "io.github.PhilipAD",
    "title": "MetricBridge Apple Health",
    "description": "Query 190 Apple Health metrics from any MCP agent: zero-dependency, read-only, local-first.",
    "version": "1.6.7",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-16",
    "updatedOn": "2026-10-16",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "health-export-mcp",
        "version": "1.6.7",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/health-export-mcp",
          "found": true,
          "latestVersion": "1.6.7",
          "lastPublished": "2026-10-16",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      },
      {
        "registryType": "mcpb",
        "registryBaseUrl": null,
        "identifier": "https://github.com/PhilipAD/health-export-mcp/releases/download/v1.6.7/health-export.mcpb",
        "version": "1.6.7",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/PhilipAD/health-export-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://www.healthexport.dev/mcp/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.PhilipAD%2Fhealth-export-mcp/versions/1.6.7",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "title",
        "text": "Apple Health",
        "context": null
      }
    ],
    "sources": [
      "apple-health"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-pipeworx-io-wger",
    "name": "io.github.pipeworx-io/wger",
    "namespace": "io.github.pipeworx-io",
    "title": "Wger",
    "description": "Wger MCP — wraps wger Workout Manager REST API (free, no auth for read)",
    "version": "1.0.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-26",
    "updatedOn": "2026-09-26",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://gateway.pipeworx.io/wger/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/pipeworx-io/mcp-wger",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://pipeworx.io/packs/wger",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.pipeworx-io%2Fwger/versions/1.0.2",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "Workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-pranciskus-garmin-workouts-mcp",
    "name": "io.github.pranciskus/garmin-workouts-mcp",
    "namespace": "io.github.pranciskus",
    "title": "Garmin Workouts MCP",
    "description": "Manage Garmin Connect workouts, including strength workouts with mapped exercises.",
    "version": "0.1.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-03-08",
    "updatedOn": "2026-03-08",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/pranciskus/garmin-workouts-mcp:0.1.2",
        "version": null,
        "transport": "stdio",
        "runtimeHint": "docker",
        "environmentVariables": [
          "GARMIN_EMAIL",
          "GARMIN_PASSWORD"
        ],
        "secretEnvironmentVariables": [
          "GARMIN_EMAIL",
          "GARMIN_PASSWORD"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/pranciskus/garmin-workouts-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/pranciskus/garmin-workouts-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.pranciskus%2Fgarmin-workouts-mcp/versions/0.1.2",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-proscar87-oura-mcp",
    "name": "io.github.proscar87/oura-mcp",
    "namespace": "io.github.proscar87",
    "title": null,
    "description": "The Oura v2 API as an MCP server. Paginates, fixes the date range, warns when data is missing.",
    "version": "0.4.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-27",
    "updatedOn": "2026-09-27",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "mcp-oura",
        "version": "0.4.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_SANDBOX",
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_CREDENTIALS",
          "OURA_PAT",
          "OURA_PAT_FILE"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET",
          "OURA_PAT"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/mcp-oura/",
          "found": true,
          "latestVersion": "0.4.0",
          "lastPublished": "2026-09-27",
          "license": "MIT",
          "licenseEvidence": "PyPI license field",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/proscar87/oura-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.proscar87%2Foura-mcp/versions/0.4.0",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-r-huijts-strava-mcp",
    "name": "io.github.r-huijts/strava-mcp",
    "namespace": "io.github.r-huijts",
    "title": null,
    "description": "MCP server for accessing Strava API",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2025-09-17",
    "updatedOn": "2025-09-17",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "strava-mcp-server",
        "version": "1.0.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "STRAVA_CLIENT_ID",
          "STRAVA_CLIENT_SECRET",
          "STRAVA_ACCESS_TOKEN"
        ],
        "secretEnvironmentVariables": [
          "STRAVA_CLIENT_SECRET",
          "STRAVA_ACCESS_TOKEN"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/strava-mcp-server",
          "found": true,
          "latestVersion": "1.2.0",
          "lastPublished": "2026-01-13",
          "license": "ISC",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/r-huijts/strava-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.r-huijts%2Fstrava-mcp/versions/1.0.1",
    "matches": [
      {
        "source": "strava",
        "term": "Strava",
        "field": "name",
        "text": "strava",
        "context": null
      }
    ],
    "sources": [
      "strava"
    ],
    "group": "strava",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-rajdeepmondaldotcom-whoop-mcp",
    "name": "io.github.rajdeepmondaldotcom/whoop-mcp",
    "namespace": "io.github.rajdeepmondaldotcom",
    "title": null,
    "description": "WHOOP recovery, sleep, strain, and workouts for any AI. Analysis tools, demo mode, fast setup.",
    "version": "0.0.5",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-12",
    "updatedOn": "2026-06-12",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "whoop-mcp-server",
        "version": "0.0.5",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_MCP_DEMO"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/whoop-mcp-server/",
          "found": true,
          "latestVersion": "0.0.12",
          "lastPublished": "2026-06-12",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/rajdeepmondaldotcom/whoop-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.rajdeepmondaldotcom%2Fwhoop-mcp/versions/0.0.5",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-rajdeepmondaldotcom-whoop-mcp-server",
    "name": "io.github.rajdeepmondaldotcom/whoop-mcp-server",
    "namespace": "io.github.rajdeepmondaldotcom",
    "title": null,
    "description": "WHOOP recovery, sleep, strain, and workouts for any AI. Analysis tools, demo mode, fast setup.",
    "version": "0.0.12",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-12",
    "updatedOn": "2026-06-12",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "whoop-mcp-server",
        "version": "0.0.12",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_MCP_DEMO"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/whoop-mcp-server/",
          "found": true,
          "latestVersion": "0.0.12",
          "lastPublished": "2026-06-12",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/rajdeepmondaldotcom/whoop-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.rajdeepmondaldotcom%2Fwhoop-mcp-server/versions/0.0.12",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-roian6-health-bridge",
    "name": "io.github.roian6/health-bridge",
    "namespace": "io.github.roian6",
    "title": "Health Bridge for AI",
    "description": "Apple Health AI Bridge provides read-only local MCP access for Health Bridge for AI.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-28",
    "updatedOn": "2026-07-28",
    "packages": [],
    "remotes": [],
    "repositoryUrl": "https://github.com/roian6/apple-health-ai-bridge",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://healthbridge.chanhyo.dev/apple-health-mcp/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.roian6%2Fhealth-bridge/versions/1.0.1",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "description",
        "text": "Apple Health",
        "context": null
      }
    ],
    "sources": [
      "apple-health"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-rwestergren-cronometer-api-mcp",
    "name": "io.github.rwestergren/cronometer-api-mcp",
    "namespace": "io.github.rwestergren",
    "title": null,
    "description": "MCP server for Cronometer nutrition tracking — food logs, diary, macros, fasting",
    "version": "0.2.6",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-13",
    "updatedOn": "2026-10-13",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "cronometer-api-mcp",
        "version": "0.2.6",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "CRONOMETER_USERNAME",
          "CRONOMETER_PASSWORD",
          "CRONOMETER_TOTP_SECRET",
          "CRONOMETER_ACCOUNT_TZ"
        ],
        "secretEnvironmentVariables": [
          "CRONOMETER_PASSWORD",
          "CRONOMETER_TOTP_SECRET"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/cronometer-api-mcp/",
          "found": true,
          "latestVersion": "0.2.6",
          "lastPublished": "2026-10-13",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/rwestergren/cronometer-api-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.rwestergren%2Fcronometer-api-mcp/versions/0.2.6",
    "matches": [
      {
        "source": "cronometer",
        "term": "Cronometer",
        "field": "name",
        "text": "cronometer",
        "context": null
      }
    ],
    "sources": [
      "cronometer"
    ],
    "group": "cronometer",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-rwestergren-hevy-mcp-remote",
    "name": "io.github.rwestergren/hevy-mcp-remote",
    "namespace": "io.github.rwestergren",
    "title": "Hevy MCP (Remote)",
    "description": "Hosted/gateway-ready Hevy fitness MCP: workouts, routines, templates.",
    "version": "0.1.6",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-05",
    "updatedOn": "2026-05-05",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/rwestergren/hevy-mcp:0.1.6",
        "version": null,
        "transport": "streamable-http",
        "runtimeHint": "docker",
        "environmentVariables": [
          "HEVY_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "HEVY_API_KEY"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/rwestergren/hevy-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/rwestergren/hevy-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.rwestergren%2Fhevy-mcp-remote/versions/0.1.6",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-shashankswe2020-ux-whoop",
    "name": "io.github.shashankswe2020-ux/whoop",
    "namespace": "io.github.shashankswe2020-ux",
    "title": null,
    "description": "MCP server for WHOOP health data — recovery, sleep, workouts, cycles, and trends.",
    "version": "0.5.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-03",
    "updatedOn": "2026-06-03",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "whoop-ai-mcp",
        "version": "0.5.2",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/whoop-ai-mcp",
          "found": true,
          "latestVersion": "0.9.1",
          "lastPublished": "2026-10-09",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/shashankswe2020-ux/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.shashankswe2020-ux%2Fwhoop/versions/0.5.2",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-shkyyy18-mi-fitness-data-bridge",
    "name": "io.github.shkyyy18/mi-fitness-data-bridge",
    "namespace": "io.github.shkyyy18",
    "title": "Mi Fitness Data Bridge",
    "description": "Local-first bridge: export your own Mi Fitness (Xiaomi) health data to SQLite/JSON/CSV and MCP.",
    "version": "0.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-13",
    "updatedOn": "2026-08-13",
    "packages": [],
    "remotes": [],
    "repositoryUrl": "https://github.com/shkyyy18/mi-fitness-data-bridge",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.shkyyy18%2Fmi-fitness-data-bridge/versions/0.3.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-shrek9999-atena",
    "name": "io.github.shrek9999/atena",
    "namespace": "io.github.shrek9999",
    "title": "ATENA Decision Intelligence",
    "description": "Decision support for AI fitness agents: next-action choices under uncertainty and trade-offs.",
    "version": "1.2.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://atena-mcp.onrender.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/shrek9999/atena-mvp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/shrek9999/atena-mvp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.shrek9999%2Fatena/versions/1.2.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-shrynshjn-health-partner",
    "name": "io.github.shrynshjn/health-partner",
    "namespace": "io.github.shrynshjn",
    "title": null,
    "description": "Manage your Health Partner account, log food, water, workouts, body using agent",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-13",
    "updatedOn": "2026-08-13",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://healthpartner.shrynshjn.com/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/shrynshjn/health_partner",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://healthpartner.shrynshjn.com/ai",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.shrynshjn%2Fhealth-partner/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-slaat-garmin-connect-workouts-mcp",
    "name": "io.github.slaat/garmin-connect-workouts-mcp",
    "namespace": "io.github.slaat",
    "title": null,
    "description": "Turn plain language into real workouts on your Garmin watch: pace, HR, power, intervals, swim sets.",
    "version": "1.1.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-02",
    "updatedOn": "2026-09-02",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "garmin-connect-workouts-mcp",
        "version": "1.1.3",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/garmin-connect-workouts-mcp",
          "found": true,
          "latestVersion": "1.1.3",
          "lastPublished": "2026-09-02",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/slaat/garmin-connect-workouts-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.slaat%2Fgarmin-connect-workouts-mcp/versions/1.1.3",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-snoozelieb-coach-mcp",
    "name": "io.github.snoozelieb/coach-mcp",
    "namespace": "io.github.snoozelieb",
    "title": null,
    "description": "Adaptive AI training coach MCP server backed by Garmin Connect",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-10",
    "updatedOn": "2026-06-10",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": "https://pypi.org",
        "identifier": "garmin-coach-mcp",
        "version": "1.0.0",
        "transport": "stdio",
        "runtimeHint": "uvx",
        "environmentVariables": [
          "GARMIN_EMAIL",
          "GARMIN_PASSWORD",
          "COACH_DATA_DIR"
        ],
        "secretEnvironmentVariables": [
          "GARMIN_PASSWORD"
        ],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/garmin-coach-mcp/",
          "found": true,
          "latestVersion": "1.1.0",
          "lastPublished": "2026-08-27",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/snoozelieb/coach-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.snoozelieb%2Fcoach-mcp/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      }
    ],
    "sources": [
      "garmin"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-soma-intelligence-open-health-sync",
    "name": "io.github.soma-intelligence/open-health-sync",
    "namespace": "io.github.soma-intelligence",
    "title": "Open Health Sync",
    "description": "Read-only access to self-hosted health data: samples, sleep, workouts, nutrition, daily summaries.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-13",
    "updatedOn": "2026-10-13",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/soma-intelligence/open-health-sync:0.1.0",
        "version": null,
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OHS_MCP_URL",
          "OHS_MCP_KEY"
        ],
        "secretEnvironmentVariables": [
          "OHS_MCP_KEY"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/soma-intelligence/open-health-sync",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.soma-intelligence%2Fopen-health-sync/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-souravpn-whoop-mcp",
    "name": "io.github.souravpn/whoop-mcp",
    "namespace": "io.github.souravpn",
    "title": null,
    "description": "MCP server for WHOOP — gives Claude access to your recovery, sleep, strain, and workout data",
    "version": "1.0.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-27",
    "updatedOn": "2026-05-27",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@souravpn/whoop-mcp",
        "version": "1.0.1",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@souravpn/whoop-mcp",
          "found": true,
          "latestVersion": "1.0.2",
          "lastPublished": "2026-05-27",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/souravpn/whoop-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.souravpn%2Fwhoop-mcp/versions/1.0.2",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-stumason-polar-flow-server",
    "name": "io.github.StuMason/polar-flow-server",
    "namespace": "io.github.StuMason",
    "title": "Polar Health Data (self-hosted)",
    "description": "Self-hosted Polar health analytics with a built-in MCP server: sleep, HRV, workouts, baselines.",
    "version": "1.6.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-02",
    "updatedOn": "2026-10-02",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "docker.io/stumason/polar-flow-server:1.6.1",
        "version": null,
        "transport": "streamable-http",
        "runtimeHint": null,
        "environmentVariables": [
          "DATABASE_URL",
          "POLAR_CLIENT_ID",
          "POLAR_CLIENT_SECRET",
          "BASE_URL"
        ],
        "secretEnvironmentVariables": [
          "DATABASE_URL",
          "POLAR_CLIENT_SECRET"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/StuMason/polar-flow-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://stumason.github.io/polar-flow-server/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.StuMason%2Fpolar-flow-server/versions/1.6.1",
    "matches": [
      {
        "source": "polar",
        "term": "Polar",
        "field": "name",
        "text": "polar",
        "context": {
          "field": "title",
          "text": "Health"
        }
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "title",
        "text": "Health Data",
        "context": null
      }
    ],
    "sources": [
      "polar",
      "general"
    ],
    "group": "polar",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-thebriangao-totem",
    "name": "io.github.thebriangao/totem",
    "namespace": "io.github.thebriangao",
    "title": null,
    "description": "Totem — talk to your wearables with AI. Today: full Whoop access (48 tools).",
    "version": "1.4.4",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-12",
    "updatedOn": "2026-06-12",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@thebriangao/totem",
        "version": "1.4.4",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN",
          "WHOOP_EMAIL",
          "WHOOP_USER_ID",
          "WHOOP_TIMEZONE"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_IOS_BEARER_TOKEN",
          "WHOOP_COGNITO_REFRESH_TOKEN"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@thebriangao/totem",
          "found": true,
          "latestVersion": "1.4.4",
          "lastPublished": "2026-06-12",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/thebriangao/totem",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.thebriangao%2Ftotem/versions/1.4.4",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "description",
        "text": "Whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-westvegh-tally-workout",
    "name": "io.github.westvegh/tally-workout",
    "namespace": "io.github.westvegh",
    "title": "Tally Workout",
    "description": "iPhone strength log. Any MCP agent reads your training and plans workouts in the Tally app.",
    "version": "1.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-15",
    "updatedOn": "2026-10-15",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.tallyworkout.app/api/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/westvegh/tally-workout-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://tallyworkout.app",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.westvegh%2Ftally-workout/versions/1.1.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "name",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-wmarceau-fitness-influencer",
    "name": "io.github.wmarceau/fitness-influencer",
    "namespace": "io.github.wmarceau",
    "title": null,
    "description": "AI-powered fitness content creator tools: video editing, image generation, workout plans, analytics.",
    "version": "1.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-01-16",
    "updatedOn": "2026-01-16",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "fitness-influencer-mcp",
        "version": "1.3.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "XAI_API_KEY",
          "GOOGLE_CREDENTIALS_PATH"
        ],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/fitness-influencer-mcp/",
          "found": true,
          "latestVersion": "1.3.1",
          "lastPublished": "2026-10-10",
          "license": "MIT",
          "licenseEvidence": "PyPI license_expression",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/MarceauSolutions/dev-sandbox",
    "repositorySource": "github",
    "repositorySubfolder": "projects/fitness-influencer",
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.wmarceau%2Ffitness-influencer/versions/1.3.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "name",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-yadheedhya06-mcp-server-whoop",
    "name": "io.github.Yadheedhya06/mcp-server-whoop",
    "namespace": "io.github.Yadheedhya06",
    "title": "WHOOP Health Signals",
    "description": "Local-first, read-only WHOOP MCP server for recovery, sleep, strain, workouts, and body signals",
    "version": "0.2.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-17",
    "updatedOn": "2026-07-17",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "mcp-server-whoop",
        "version": "0.2.2",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/mcp-server-whoop",
          "found": true,
          "latestVersion": "0.2.2",
          "lastPublished": "2026-07-17",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Yadheedhya06/mcp-server-whoop",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Yadheedhya06%2Fmcp-server-whoop/versions/0.2.2",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-yasuakiomokawa-oura-mcp",
    "name": "io.github.YasuakiOmokawa/oura-mcp",
    "namespace": "io.github.YasuakiOmokawa",
    "title": "Oura Ring",
    "description": "MCP server for Oura Ring API v2 (sleep, activity, readiness, heart rate, workouts).",
    "version": "0.2.13",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-16",
    "updatedOn": "2026-05-16",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@yasuakiomokawa/oura-mcp",
        "version": "0.2.13",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "OURA_CLIENT_ID",
          "OURA_CLIENT_SECRET",
          "OURA_CALLBACK_PORT"
        ],
        "secretEnvironmentVariables": [
          "OURA_CLIENT_SECRET"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@yasuakiomokawa/oura-mcp",
          "found": true,
          "latestVersion": "0.2.13",
          "lastPublished": "2026-05-16",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/YasuakiOmokawa/oura-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.YasuakiOmokawa%2Foura-mcp/versions/0.2.13",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "oura",
      "general"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-yuridivonis-whoop-mcp-server",
    "name": "io.github.yuridivonis/whoop-mcp-server",
    "namespace": "io.github.yuridivonis",
    "title": "Whoop MCP Server",
    "description": "Your WHOOP recovery, sleep, strain and workouts in Claude, ChatGPT or other MCP apps. Self-hosted.",
    "version": "1.5.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-03",
    "updatedOn": "2026-10-03",
    "packages": [
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/yuridivonis/whoop-mcp-server:1.5.1",
        "version": null,
        "transport": "streamable-http",
        "runtimeHint": "docker",
        "environmentVariables": [
          "WHOOP_CLIENT_ID",
          "WHOOP_CLIENT_SECRET",
          "WHOOP_REDIRECT_URI",
          "MCP_AUTH_PASSWORD",
          "PUBLIC_URL",
          "ENCRYPTION_SECRET",
          "UPDATE_CHECK"
        ],
        "secretEnvironmentVariables": [
          "WHOOP_CLIENT_SECRET",
          "MCP_AUTH_PASSWORD",
          "ENCRYPTION_SECRET"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/yuridivonis/whoop-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/yuridivonis/whoop-mcp-server#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.yuridivonis%2Fwhoop-mcp-server/versions/1.5.1",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-zayden16-whoop-mcp-server",
    "name": "io.github.Zayden16/whoop-mcp-server",
    "namespace": "io.github.Zayden16",
    "title": null,
    "description": "MCP server for the official Whoop API v2: cycles, recovery, sleep, workouts, and profile data",
    "version": "1.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-09",
    "updatedOn": "2026-07-09",
    "packages": [],
    "remotes": [],
    "repositoryUrl": "https://github.com/Zayden16/whoop-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Zayden16%2Fwhoop-mcp-server/versions/1.1.0",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-github-zsadigzade-trainbud",
    "name": "io.github.Zsadigzade/trainbud",
    "namespace": "io.github.Zsadigzade",
    "title": "TrainBud",
    "description": "Talk to your own fitness data. Findings computed in code against your own 28-day baselines.",
    "version": "0.9.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-18",
    "updatedOn": "2026-09-18",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": "https://registry.npmjs.org",
        "identifier": "trainbud",
        "version": "0.9.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GARMIN_EMAIL",
          "GARMIN_PASSWORD",
          "ANTHROPIC_API_KEY"
        ],
        "secretEnvironmentVariables": [
          "GARMIN_PASSWORD",
          "ANTHROPIC_API_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/trainbud",
          "found": true,
          "latestVersion": "0.9.0",
          "lastPublished": "2026-09-18",
          "license": "MIT",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      },
      {
        "registryType": "oci",
        "registryBaseUrl": null,
        "identifier": "ghcr.io/zsadigzade/trainbud:0.9.0",
        "version": null,
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "GARMIN_EMAIL",
          "GARMIN_PASSWORD"
        ],
        "secretEnvironmentVariables": [
          "GARMIN_PASSWORD"
        ],
        "facts": null
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/Zsadigzade/trainbud",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://github.com/Zsadigzade/trainbud#readme",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Zsadigzade%2Ftrainbud/versions/0.9.0",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-toolforest-toolforest",
    "name": "io.toolforest/toolforest",
    "namespace": "io.toolforest",
    "title": "Toolforest",
    "description": "Hosted MCP server with managed OAuth for 15+ toolkits: Google Workspace, Fitbit, Oura, Kalshi, etc.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-12",
    "updatedOn": "2026-06-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.toolforest.io/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.toolforest.io",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.toolforest%2Ftoolforest/versions/1.0.0",
    "matches": [
      {
        "source": "fitbit",
        "term": "Fitbit",
        "field": "description",
        "text": "Fitbit",
        "context": null
      },
      {
        "source": "oura",
        "term": "Oura",
        "field": "description",
        "text": "Oura",
        "context": null
      }
    ],
    "sources": [
      "fitbit",
      "oura"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-usefulapi-fitbit",
    "name": "io.usefulapi/fitbit",
    "namespace": "io.usefulapi",
    "title": "Fitbit MCP by usefulapi",
    "description": "Read Fitbit profile, activity, sleep, heart rate and device data.",
    "version": "1.11.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-09",
    "updatedOn": "2026-10-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://fitbit.usefulapi.io/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/m190/usefulapi-mcp",
    "repositorySource": "github",
    "repositorySubfolder": "servers/fitbit",
    "websiteUrl": "https://usefulapi.io/fitbit/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.usefulapi%2Ffitbit/versions/1.11.1",
    "matches": [
      {
        "source": "fitbit",
        "term": "Fitbit",
        "field": "name",
        "text": "fitbit",
        "context": null
      }
    ],
    "sources": [
      "fitbit"
    ],
    "group": "fitbit",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-usefulapi-oura",
    "name": "io.usefulapi/oura",
    "namespace": "io.usefulapi",
    "title": "Oura MCP by usefulapi",
    "description": "Read sleep, readiness, activity, stress, heart rate and workouts from the Oura Ring.",
    "version": "1.11.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-09",
    "updatedOn": "2026-10-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://oura.usefulapi.io/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/m190/usefulapi-mcp",
    "repositorySource": "github",
    "repositorySubfolder": "servers/oura",
    "websiteUrl": "https://usefulapi.io/oura/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.usefulapi%2Foura/versions/1.11.1",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "oura",
      "general"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-usefulapi-vital",
    "name": "io.usefulapi/vital",
    "namespace": "io.usefulapi",
    "title": "Vital MCP by usefulapi",
    "description": "Read wearables and lab health data — sleep, activity, workouts, timeseries, lab tests and orders.",
    "version": "1.11.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-09",
    "updatedOn": "2026-10-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://vital.usefulapi.io/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/m190/usefulapi-mcp",
    "repositorySource": "github",
    "repositorySubfolder": "servers/vital",
    "websiteUrl": "https://usefulapi.io/vital/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.usefulapi%2Fvital/versions/1.11.1",
    "matches": [
      {
        "source": "junction",
        "term": "Vital",
        "field": "name",
        "text": "vital",
        "context": {
          "field": "description",
          "text": "wearables"
        }
      },
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "junction",
      "general"
    ],
    "group": "junction",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "io-usefulapi-whoop",
    "name": "io.usefulapi/whoop",
    "namespace": "io.usefulapi",
    "title": "WHOOP MCP by usefulapi",
    "description": "Read WHOOP recovery, sleep, cycles, workouts and body measurements.",
    "version": "1.11.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-09",
    "updatedOn": "2026-10-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://whoop.usefulapi.io/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/m190/usefulapi-mcp",
    "repositorySource": "github",
    "repositorySubfolder": "servers/whoop",
    "websiteUrl": "https://usefulapi.io/whoop/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/io.usefulapi%2Fwhoop/versions/1.11.1",
    "matches": [
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "name",
        "text": "whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "whoop",
      "general"
    ],
    "group": "whoop",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "is-k01-synthetic-health-data",
    "name": "is.k01/synthetic-health-data",
    "namespace": "is.k01",
    "title": "K01 Synthetic Health Data",
    "description": "Privacy-preserving synthetic health data generation. FHIR R4/R5 compliant.",
    "version": "1.7.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-25",
    "updatedOn": "2026-02-25",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.k01.is/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/K01labs/k01-mcp-server",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/is.k01%2Fsynthetic-health-data/versions/1.7.1",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "name",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "life-twyn-twyn",
    "name": "life.twyn/twyn",
    "namespace": "life.twyn",
    "title": "twyn",
    "description": "Your labs, wearables, DNA and notes as one health record your AI agent can read (OAuth 2.1).",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-13",
    "updatedOn": "2026-10-13",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://twyn.life/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://twyn.life/for-ai-agents",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/life.twyn%2Ftwyn/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "wearable",
        "field": "description",
        "text": "wearables",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "link-smirnov-mcp-oura",
    "name": "link.smirnov/mcp-oura",
    "namespace": "link.smirnov",
    "title": "MCP for Oura",
    "description": "Multi-tenant hosted MCP server for Oura Ring — 21 read-only tools, OAuth per user.",
    "version": "0.1.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-05-17",
    "updatedOn": "2026-05-17",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp-oura.smirnov.link/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/Smirnov-Labs/mcpforoura",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/link.smirnov%2Fmcp-oura/versions/0.1.1",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "name",
        "text": "oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "me-passport-mcp",
    "name": "me.passport/mcp",
    "namespace": "me.passport",
    "title": "Passport.Me",
    "description": "Your Gmail, Calendar, Drive, GitHub, Oura, wallet and confirmed profile facts in any MCP client.",
    "version": "1.0.1",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-29",
    "updatedOn": "2026-09-29",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.passport.me/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://passport.me/developers",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/me.passport%2Fmcp/versions/1.0.1",
    "matches": [
      {
        "source": "oura",
        "term": "Oura",
        "field": "description",
        "text": "Oura",
        "context": null
      }
    ],
    "sources": [
      "oura"
    ],
    "group": "oura",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "me-phor-phorme-training",
    "name": "me.phor/phorme-training",
    "namespace": "me.phor",
    "title": "Phorme Training",
    "description": "Coach-built training methods, gym weeks, workouts with demos and your log. Coaches run theirs here.",
    "version": "1.6.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://phor.me/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://phor.me/chatgpt",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/me.phor%2Fphorme-training/versions/1.6.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "me-pulsai-garmin",
    "name": "me.pulsai/garmin",
    "namespace": "me.pulsai",
    "title": "Pulsai — Garmin for any AI",
    "description": "Hosted MCP: your Garmin data (activities, sleep, HRV) in Claude, ChatGPT & Gemini.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-12",
    "updatedOn": "2026-07-12",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://pulsai.me/mcp/{endpoint_code}",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [
          "endpoint_code"
        ],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://pulsai.me",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/me.pulsai%2Fgarmin/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "general"
    ],
    "group": "garmin",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "mobile-upfit-upfit",
    "name": "mobile.upfit/upfit",
    "namespace": "mobile.upfit",
    "title": "Upfit Plan Builder",
    "description": "Read-only bodyweight workout builder and exercise form cues from the Upfit iPhone app.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://www.upfit.mobile/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://www.upfit.mobile",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/mobile.upfit%2Fupfit/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "no-sladd-mcp",
    "name": "no.sladd/mcp",
    "namespace": "no.sladd",
    "title": null,
    "description": "Detect and redact Norwegian PII (fodselsnummer, names, health data) in text and PDFs.",
    "version": "0.1.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-10",
    "updatedOn": "2026-07-10",
    "packages": [
      {
        "registryType": "npm",
        "registryBaseUrl": null,
        "identifier": "@sladd-no/mcp",
        "version": "0.1.0",
        "transport": "stdio",
        "runtimeHint": null,
        "environmentVariables": [
          "SLADD_API_KEY",
          "SLADD_API_BASE"
        ],
        "secretEnvironmentVariables": [
          "SLADD_API_KEY"
        ],
        "facts": {
          "registry": "npm",
          "url": "https://www.npmjs.com/package/@sladd-no/mcp",
          "found": true,
          "latestVersion": "0.1.0",
          "lastPublished": "2026-07-10",
          "license": "UNLICENSED",
          "licenseEvidence": "package.json license",
          "deprecated": null
        }
      }
    ],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://sladd.no/mcp",
        "headers": [
          "Authorization"
        ],
        "secretHeaders": [
          "Authorization"
        ],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://sladd.no/api",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/no.sladd%2Fmcp/versions/0.1.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "org-ghurt-ghurt",
    "name": "org.ghurt/ghurt",
    "namespace": "org.ghurt",
    "title": "ghurt",
    "description": "Query Garmin, Oura & Whoop sleep, HRV, recovery & training load from Claude or ChatGPT.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-13",
    "updatedOn": "2026-07-13",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://ghurt.org/v1/mcp?key={api_key}",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [
          "api_key"
        ],
        "secretUrlVariables": [
          "api_key"
        ]
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://ghurt.org",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/org.ghurt%2Fghurt/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "oura",
        "term": "Oura",
        "field": "description",
        "text": "Oura",
        "context": null
      },
      {
        "source": "whoop",
        "term": "WHOOP",
        "field": "description",
        "text": "Whoop",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "oura",
      "whoop",
      "general"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "org-memoryapi-health",
    "name": "org.memoryapi/health",
    "namespace": "org.memoryapi",
    "title": "Health Data",
    "description": "Health data: NIH grants, WHO statistics, and genetic variants",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-06-11",
    "updatedOn": "2026-06-11",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://health.memoryapi.org/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/org.memoryapi%2Fhealth/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "title",
        "text": "Health Data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "plus-gym-gym-plus",
    "name": "plus.gym/gym-plus",
    "namespace": "plus.gym",
    "title": null,
    "description": "Connect ChatGPT or Claude to your Gym Plus account to log and review workouts with AI coaching.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-07-07",
    "updatedOn": "2026-07-07",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://gym.plus/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://gym.plus",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/plus.gym%2Fgym-plus/versions/1.0.0",
    "matches": [
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "run-stas-stas",
    "name": "run.stas/stas",
    "namespace": "run.stas",
    "title": "STAS Running Coach for Claude",
    "description": "Connect Claude to your Intervals.icu watch data for fitness, workout review, and plan writing.",
    "version": "1.0.2",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-04-17",
    "updatedOn": "2026-04-17",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://stas.run/api/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://github.com/hivrich/stas.run",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://stas.run",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/run.stas%2Fstas/versions/1.0.2",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workout",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "tech-skeletonarmy-marrow",
    "name": "tech.skeletonarmy/marrow",
    "namespace": "tech.skeletonarmy",
    "title": null,
    "description": "Nine MCP tools that read your own Apple Health data, mirrored from the Marrow iOS app.",
    "version": "0.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-10-14",
    "updatedOn": "2026-10-14",
    "packages": [
      {
        "registryType": "pypi",
        "registryBaseUrl": null,
        "identifier": "marrow-mcp",
        "version": "0.3.0",
        "transport": "streamable-http",
        "runtimeHint": "python",
        "environmentVariables": [],
        "secretEnvironmentVariables": [],
        "facts": {
          "registry": "pypi",
          "url": "https://pypi.org/project/marrow-mcp/",
          "found": true,
          "latestVersion": "0.3.0",
          "lastPublished": "2026-10-14",
          "license": "MIT License",
          "licenseEvidence": "PyPI classifier \"License :: OSI Approved :: MIT License\"",
          "deprecated": null
        }
      }
    ],
    "remotes": [],
    "repositoryUrl": "https://github.com/skeletonarmytech/marrow-mcp",
    "repositorySource": "github",
    "repositorySubfolder": null,
    "websiteUrl": "https://marrowhealthapp.com/mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/tech.skeletonarmy%2Fmarrow/versions/0.3.0",
    "matches": [
      {
        "source": "apple-health",
        "term": "Apple Health",
        "field": "description",
        "text": "Apple Health",
        "context": null
      },
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "Health data",
        "context": null
      }
    ],
    "sources": [
      "apple-health",
      "general"
    ],
    "group": "apple-health",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "tools-pacing-mcp",
    "name": "tools.pacing/mcp",
    "namespace": "tools.pacing",
    "title": "Pacing Tools",
    "description": "Ask your AI about your fitness: activities and data from Garmin, COROS, Strava, GPX and more",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-24",
    "updatedOn": "2026-09-24",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://mcp.pacing.tools/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://pacing.tools/docs/mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/tools.pacing%2Fmcp/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "description",
        "text": "Garmin",
        "context": null
      },
      {
        "source": "coros",
        "term": "COROS",
        "field": "description",
        "text": "COROS",
        "context": null
      },
      {
        "source": "strava",
        "term": "Strava",
        "field": "description",
        "text": "Strava",
        "context": null
      },
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "coros",
      "strava",
      "general"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "training-stats-garmin",
    "name": "training.stats/garmin",
    "namespace": "training.stats",
    "title": "Garmin & Strava for Claude and ChatGPT",
    "description": "Read-only Garmin and Strava data for your AI: activities, sleep, HRV, readiness, training load.",
    "version": "1.0.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-09-21",
    "updatedOn": "2026-09-21",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://stats.training/mcp/{mcp_key}",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [
          "mcp_key"
        ],
        "secretUrlVariables": [
          "mcp_key"
        ]
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://stats.training/garmin-mcp",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/training.stats%2Fgarmin/versions/1.0.0",
    "matches": [
      {
        "source": "garmin",
        "term": "Garmin",
        "field": "name",
        "text": "garmin",
        "context": null
      },
      {
        "source": "strava",
        "term": "Strava",
        "field": "title",
        "text": "Strava",
        "context": null
      },
      {
        "source": "general",
        "term": "HRV",
        "field": "description",
        "text": "HRV",
        "context": null
      }
    ],
    "sources": [
      "garmin",
      "strava",
      "general"
    ],
    "group": "several",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "uk-slate-hq-slate",
    "name": "uk.slate-hq/slate",
    "namespace": "uk.slate-hq",
    "title": null,
    "description": "Your own SLATE health data in your AI assistant: read, trend, plan and log. Never suggests a dose.",
    "version": "0.3.0",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-08-23",
    "updatedOn": "2026-08-23",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://ydyrdehcbyrfbnjqgdoi.functions.supabase.co/slate-mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": null,
    "repositorySource": null,
    "repositorySubfolder": null,
    "websiteUrl": "https://slate-hq.uk/mcp-connector/",
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/uk.slate-hq%2Fslate/versions/0.3.0",
    "matches": [
      {
        "source": "general",
        "term": "health data",
        "field": "description",
        "text": "health data",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  },
  {
    "slug": "xyz-perpvue-mcp",
    "name": "xyz.perpvue/mcp",
    "namespace": "xyz.perpvue",
    "title": "BearTrail",
    "description": "Query workouts, browse exercises, and explore fitness data from BearTrail",
    "version": "1.0.3",
    "versionRule": "registry isLatest",
    "status": "active",
    "statusMessage": null,
    "publishedOn": "2026-02-09",
    "updatedOn": "2026-02-09",
    "packages": [],
    "remotes": [
      {
        "type": "streamable-http",
        "url": "https://perpvue.xyz/mcp",
        "headers": [],
        "secretHeaders": [],
        "urlVariables": [],
        "secretUrlVariables": []
      }
    ],
    "repositoryUrl": "https://gitlab.com/xihay/beartrail-mcp",
    "repositorySource": "gitlab",
    "repositorySubfolder": null,
    "websiteUrl": null,
    "registryEntryUrl": "https://registry.modelcontextprotocol.io/v0.1/servers/xyz.perpvue%2Fmcp/versions/1.0.3",
    "matches": [
      {
        "source": "general",
        "term": "fitness",
        "field": "description",
        "text": "fitness",
        "context": null
      },
      {
        "source": "general",
        "term": "workout",
        "field": "description",
        "text": "workouts",
        "context": null
      }
    ],
    "sources": [
      "general"
    ],
    "group": "general",
    "publisherIsVendor": false,
    "publisherEvidence": null
  }
];
