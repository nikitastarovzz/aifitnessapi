/**
 * The documented limits and the arithmetic behind /tools/rate-limit-calculator
 * (ops/AUDIENCE-30-2026-11-05.md item 7).
 *
 * Plain ESM with no dependencies, imported by the page, its client component
 * and scripts/rate-limit-calc.test.mjs, so the tests run the code a reader
 * runs.
 *
 * Every limit, scope note and mitigation carries `src`: the vendor URL, the
 * vendor's own words and `ev`, the evidence file of the vendor's integration
 * guide that already holds that quote (ops/sources/evidence/integrate-*.json,
 * re-checked against the live pages by .github/workflows/source-quotes.yml).
 * The test fails if a quote is missing from its evidence file or if a limit's
 * number does not appear in its quote. A mitigation is listed only where the
 * vendor documents the mechanism; nothing here is general advice.
 *
 * The Google Health API's limits come from the generated
 * src/data/googleHealthApi.ts (lib/ghapiCoverage.ts builds its entry with
 * `parsePublishedLimit`), and the Fitbit Web API's turn-off from the same
 * file.
 *
 * Model. A user syncs `syncsPerDay` times a day and each sync makes
 * `endpointsPerSync` requests (for Terra, each request asks for
 * `daysPerRequest` days). "spread" assumes users' syncs are spread evenly over
 * the day; "aligned" assumes every user syncs at the same moments (a cron at
 * the top of the hour), which is the worst case for short windows. A limit's
 * `scope` is "app" (all users' traffic counts), "user" (each user's own
 * traffic counts) or "unstated" (the vendor gives a number without saying
 * which; it is applied to the whole app, the stricter reading, and labeled).
 */

export const DAY = 86400;

export const RATE_LIMIT_VENDORS =[
  {
    "id": "whoop",
    "name": "WHOOP",
    "guide": "/integrate/whoop-api",
    "tiers": [
      {
        "id": "default",
        "label": "Default",
        "limits": [
          {
            "label": "per minute",
            "max": 100,
            "window": 60,
            "scope": "app",
            "src": {
              "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
              "quote": "All clients are subject to two sets of rate limiting for requests. By default, clients may only send: 100 requests per minute. 10,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-whoop-api.json"
            }
          },
          {
            "label": "per day",
            "max": 10000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
              "quote": "All clients are subject to two sets of rate limiting for requests. By default, clients may only send: 100 requests per minute. 10,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-whoop-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "WHOOP says every client may send these; the client is your app.",
      "src": {
        "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
        "quote": "All clients are subject to two sets of rate limiting for requests. By default, clients may only send: 100 requests per minute. 10,000 requests per day.",
        "ev": "ops/sources/evidence/integrate-whoop-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Webhooks for workout, sleep and recovery changes, instead of polling those",
        "src": {
          "url": "https://developer.whoop.com/docs/developing/webhooks/",
          "quote": "Enum : \"workout.updated\" \"workout.deleted\" \"sleep.updated\" \"sleep.deleted\" \"recovery.updated\" \"recovery.deleted\"",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      },
      {
        "text": "Ask for a rate limit increase from the Developer Dashboard (Open Request)",
        "src": {
          "url": "https://developer.whoop.com/docs/developing/rate-limiting/",
          "quote": "Upon request, WHOOP can increase your rate limits. Open your app in the Developer Dashboard , click Open Request , and choose Rate limit increase .",
          "ev": "ops/sources/evidence/integrate-whoop-api.json"
        }
      }
    ]
  },
  {
    "id": "strava",
    "name": "Strava",
    "guide": "/integrate/strava-api",
    "tiers": [
      {
        "id": "default",
        "label": "New app (default)",
        "limits": [
          {
            "label": "non-upload, per 15 minutes",
            "max": 100,
            "window": 900,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/rate-limits/",
              "quote": "rate limit allows 100 requests every 15 minutes, with up to 1,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "non-upload, per day",
            "max": 1000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/rate-limits/",
              "quote": "rate limit allows 100 requests every 15 minutes, with up to 1,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "overall, per 15 minutes",
            "max": 200,
            "window": 900,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/rate-limits/",
              "quote": "The default overall rate limit allows 200 requests every 15 minutes, with up to 2,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "overall, per day",
            "max": 2000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/rate-limits/",
              "quote": "The default overall rate limit allows 200 requests every 15 minutes, with up to 2,000 requests per day.",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          }
        ]
      },
      {
        "id": "upgraded",
        "label": "Self-service upgrade",
        "limits": [
          {
            "label": "read, per 15 minutes",
            "max": 200,
            "window": 900,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/getting-started/",
              "quote": "Once your app is configured in your API dashboard, you can upgrade your access directly from your API Settings Dashboard. This raises your access to: Athlete capacity of 10 Read read limits: 200 requests / 15min & 2,000 requests / day Overall rate limits: 400 requests / 15min & 4,000 requests / day",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "read, per day",
            "max": 2000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/getting-started/",
              "quote": "Once your app is configured in your API dashboard, you can upgrade your access directly from your API Settings Dashboard. This raises your access to: Athlete capacity of 10 Read read limits: 200 requests / 15min & 2,000 requests / day Overall rate limits: 400 requests / 15min & 4,000 requests / day",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "overall, per 15 minutes",
            "max": 400,
            "window": 900,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/getting-started/",
              "quote": "Once your app is configured in your API dashboard, you can upgrade your access directly from your API Settings Dashboard. This raises your access to: Athlete capacity of 10 Read read limits: 200 requests / 15min & 2,000 requests / day Overall rate limits: 400 requests / 15min & 4,000 requests / day",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          },
          {
            "label": "overall, per day",
            "max": 4000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://developers.strava.com/docs/getting-started/",
              "quote": "Once your app is configured in your API dashboard, you can upgrade your access directly from your API Settings Dashboard. This raises your access to: Athlete capacity of 10 Read read limits: 200 requests / 15min & 2,000 requests / day Overall rate limits: 400 requests / 15min & 4,000 requests / day",
              "ev": "ops/sources/evidence/integrate-strava-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Strava limits usage per application, with a 15-minute and a daily limit; the 15-minute window resets on the quarter hour and the daily one at midnight UTC.",
      "src": {
        "url": "https://developers.strava.com/docs/rate-limits/",
        "quote": "Strava API usage is limited on a per-application basis using both a 15-minute and daily request limit. Applications have an overall rate limit as well as a separate rate limit associated with the endpoints we consider",
        "ev": "ops/sources/evidence/integrate-strava-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Implement webhooks when activity polling hits the daily limit",
        "src": {
          "url": "https://developers.strava.com/docs/rate-limits/",
          "quote": "Activity polling is causing you to hit your daily rate limits Implement webhooks",
          "ev": "ops/sources/evidence/integrate-strava-api.json"
        }
      },
      {
        "text": "Throttle backfills by reading the rate-limit response headers",
        "src": {
          "url": "https://developers.strava.com/docs/rate-limits/",
          "quote": "Check API response headers (see above) and throttle back requests when necessary",
          "ev": "ops/sources/evidence/integrate-strava-api.json"
        }
      }
    ]
  },
  {
    "id": "oura",
    "name": "Oura",
    "guide": "/integrate/oura-api",
    "tiers": [
      {
        "id": "default",
        "label": "Default",
        "limits": [
          {
            "label": "per 5 minutes",
            "max": 5000,
            "window": 300,
            "scope": "unstated",
            "src": {
              "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
              "quote": "The Oura API is limited to 5000 requests per 5-minute period.",
              "ev": "ops/sources/evidence/integrate-oura-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Oura enforces a per-access-token and a per-application layer but gives this one figure without saying which layer it is, so it is applied here to your whole app, the stricter reading.",
      "src": {
        "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
        "quote": "The API enforces rate limits at two layers to ensure fair access across all applications:",
        "ev": "ops/sources/evidence/integrate-oura-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Webhooks: Oura says customers who implement them properly have not hit rate limits",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "We have not had customers hit rate limits with webhooks properly implemented",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      {
        "text": "One historical request when a user connects, then webhooks",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "Make a single request for historical data when a user first connects, then use webhooks for ongoing updates",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      },
      {
        "text": "Retry from the rate-limit headers rather than a fixed-interval backoff",
        "src": {
          "url": "https://cloud.ouraring.com/v2/static/json/openapi-1.43.json",
          "quote": "five headers are included to guide retries. Prefer these over fixed-interval backoff:",
          "ev": "ops/sources/evidence/integrate-oura-api.json"
        }
      }
    ]
  },
  {
    "id": "polar",
    "name": "Polar AccessLink",
    "guide": "/integrate/polar-api",
    "tiers": [
      {
        "id": "default",
        "label": "Dynamic",
        "limits": [
          {
            "label": "per 15 minutes",
            "max": 500,
            "perUser": 20,
            "window": 900,
            "scope": "app",
            "src": {
              "url": "https://www.polar.com/accesslink-api/",
              "quote": "15min rate limit: 500 + number of users x 20",
              "ev": "ops/sources/evidence/integrate-polar-api.json"
            }
          },
          {
            "label": "per 24 hours",
            "max": 5000,
            "perUser": 100,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://www.polar.com/accesslink-api/",
              "quote": "24h rate limit: 5000 + number of users x 100",
              "ev": "ops/sources/evidence/integrate-polar-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Polar scales the limit with the number of registered users and updates it daily; the users you enter are used as that number.",
      "src": {
        "url": "https://www.polar.com/accesslink-api/",
        "quote": "Dynamic rate limit scales partners rate limit values based on number of registered users. Rate limit values are updated daily.",
        "ev": "ops/sources/evidence/integrate-polar-api.json"
      }
    },
    "mitigations": [
      {
        "text": "A webhook, which must answer Polar's ping when you create it",
        "src": {
          "url": "https://www.polar.com/accesslink-api/swagger.yaml",
          "quote": "When creating webhook the AccessLink sends a ping message to the url in request body. The ping message must be answered with 200 OK or otherwise the webhook is not created.",
          "ev": "ops/sources/evidence/integrate-polar-api.json"
        }
      }
    ]
  },
  {
    "id": "withings",
    "name": "Withings",
    "guide": "/integrate/withings-api",
    "tiers": [
      {
        "id": "default",
        "label": "Standard",
        "limits": [
          {
            "label": "per minute",
            "max": 120,
            "window": 60,
            "scope": "app",
            "src": {
              "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
              "quote": "The standard Withings API enforces a 120 requests-per-minute limit across your application",
              "ev": "ops/sources/evidence/integrate-withings-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Withings says the limit applies across your application.",
      "src": {
        "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
        "quote": "The standard Withings API enforces a 120 requests-per-minute limit across your application",
        "ev": "ops/sources/evidence/integrate-withings-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Notifications: Withings POSTs when new data arrives, then you fetch",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/notifications/notification-overview/",
          "quote": "Withings POSTs to your callback URL the moment new measurements arrive, then your handler fetches the data via the Data API.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      },
      {
        "text": "Fetch with lastupdate to get everything changed since your last sync",
        "src": {
          "url": "https://developer.withings.com/developer-guide/v3/integration-guide/public-health-data-api/data-api/fetch-data-example/",
          "quote": "For ongoing sync, we recommend lastupdate instead: pass the timestamp of your last successful fetch and the Data API returns everything created or modified since, including any updates you missed if a notification was lost.",
          "ev": "ops/sources/evidence/integrate-withings-api.json"
        }
      }
    ]
  },
  {
    "id": "wahoo",
    "name": "Wahoo",
    "guide": "/integrate/wahoo-api",
    "tiers": [
      {
        "id": "sandbox",
        "label": "Sandbox",
        "limits": [
          {
            "label": "per 5 minutes",
            "max": 25,
            "window": 300,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests every 5 Min: 25 200",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          },
          {
            "label": "per hour",
            "max": 100,
            "window": 3600,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests per Hour: 100 1000",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          },
          {
            "label": "per day",
            "max": 250,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests per Day: 250 5000",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          }
        ]
      },
      {
        "id": "production",
        "label": "Production",
        "limits": [
          {
            "label": "per 5 minutes",
            "max": 200,
            "window": 300,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests every 5 Min: 25 200",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          },
          {
            "label": "per hour",
            "max": 1000,
            "window": 3600,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests per Hour: 100 1000",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          },
          {
            "label": "per day",
            "max": 5000,
            "window": 86400,
            "scope": "app",
            "src": {
              "url": "https://cloud-api.wahooligan.com/",
              "quote": "Requests per Day: 250 5000",
              "ev": "ops/sources/evidence/integrate-wahoo-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "The lines read do not say whether the limit is per app or per user, so it is applied here to your whole app. Authentication, token refreshes and file downloads do not count.",
      "src": {
        "url": "https://cloud-api.wahooligan.com/",
        "quote": "Requests to authenticate, refresh tokens, and download files do not count against rate limits.",
        "ev": "ops/sources/evidence/integrate-wahoo-api.json"
      }
    },
    "mitigations": [
      {
        "text": "The workout_summary webhook",
        "src": {
          "url": "https://cloud-api.wahooligan.com/",
          "quote": "\"event_type\" : \"workout_summary\"",
          "ev": "ops/sources/evidence/integrate-wahoo-api.json"
        }
      },
      {
        "text": "Ask support for higher throughput",
        "src": {
          "url": "https://cloud-api.wahooligan.com/",
          "quote": "If you require a higher throughput, please contact support to request an increase.",
          "ev": "ops/sources/evidence/integrate-wahoo-api.json"
        }
      }
    ]
  },
  {
    "id": "dexcom",
    "name": "Dexcom",
    "guide": "/integrate/dexcom-api",
    "tiers": [
      {
        "id": "default",
        "label": "Default",
        "limits": [
          {
            "label": "per hour",
            "max": 60000,
            "window": 3600,
            "scope": "app",
            "src": {
              "url": "https://developer.dexcom.com/docs/dexcomv3/endpoint-overview",
              "quote": "Request frequency is limited to 60,000 calls per app per hour. If the limit is exceeded, an HTTP 429 response is returned.",
              "ev": "ops/sources/evidence/integrate-dexcom-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Dexcom limits calls per app.",
      "src": {
        "url": "https://developer.dexcom.com/docs/dexcomv3/endpoint-overview",
        "quote": "Request frequency is limited to 60,000 calls per app per hour. If the limit is exceeded, an HTTP 429 response is returned.",
        "ev": "ops/sources/evidence/integrate-dexcom-api.json"
      }
    },
    "mitigations": []
  },
  {
    "id": "coros",
    "name": "COROS (Partner API)",
    "guide": "/integrate/coros-api",
    "tiers": [
      {
        "id": "default",
        "label": "Partner API",
        "limits": [
          {
            "label": "per minute",
            "max": 1000,
            "window": 60,
            "scope": "unstated",
            "src": {
              "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
              "quote": "Rate limit: 1,000 calls/minute",
              "ev": "ops/sources/evidence/integrate-coros-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "The line read does not say whether the figure is per app or per user, so it is applied here to your whole app. The MCP path's rate limit is not stated.",
      "src": {
        "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
        "quote": "Rate limit: 1,000 calls/minute",
        "ev": "ops/sources/evidence/integrate-coros-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Partner API webhooks push workout data within about 5 minutes",
        "src": {
          "url": "https://support.coros.com/api/v2/help_center/en-us/sections/53180979524884/articles.json",
          "quote": "Webhook push notifications (workout data pushed to your endpoint within ~5 minutes)",
          "ev": "ops/sources/evidence/integrate-coros-api.json"
        }
      }
    ]
  },
  {
    "id": "teamup",
    "name": "TeamUp",
    "guide": "/integrate/teamup-api",
    "tiers": [
      {
        "id": "default",
        "label": "Default",
        "limits": [
          {
            "label": "per minute, per caller",
            "max": 250,
            "window": 60,
            "scope": "user",
            "src": {
              "url": "https://docs.goteamup.com/api-reference/rate-limits",
              "quote": "Unless otherwise noted in an endpoint's description, the rate limit is 250 requests per minute for a caller. The caller is identified by the authenticated user or in the case of unauthenticated endpoints, the IP address.",
              "ev": "ops/sources/evidence/integrate-teamup-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "The caller is the authenticated user (or the IP address for unauthenticated endpoints), so the limit is applied per user.",
      "src": {
        "url": "https://docs.goteamup.com/api-reference/rate-limits",
        "quote": "Unless otherwise noted in an endpoint's description, the rate limit is 250 requests per minute for a caller. The caller is identified by the authenticated user or in the case of unauthenticated endpoints, the IP address.",
        "ev": "ops/sources/evidence/integrate-teamup-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Event notifications with webhooks",
        "src": {
          "url": "https://docs.goteamup.com/guides/getting-started",
          "quote": "Receive event notifications with Webhooks",
          "ev": "ops/sources/evidence/integrate-teamup-api.json"
        }
      }
    ]
  },
  {
    "id": "wodify",
    "name": "Wodify",
    "guide": "/integrate/wodify-api",
    "tiers": [
      {
        "id": "default",
        "label": "Default",
        "limits": [
          {
            "label": "per second (sustained)",
            "max": 5,
            "window": 1,
            "scope": "unstated",
            "src": {
              "url": "https://docs.wodify.com/docs/rate-limiting",
              "quote": "Rate 5 requests per second",
              "ev": "ops/sources/evidence/integrate-wodify-api.json"
            }
          },
          {
            "label": "per calendar month",
            "max": 500000,
            "window": 2678400,
            "scope": "unstated",
            "src": {
              "url": "https://docs.wodify.com/docs/rate-limiting",
              "quote": "Quota 500,000 requests per month",
              "ev": "ops/sources/evidence/integrate-wodify-api.json"
            }
          }
        ]
      }
    ],
    "scopeNote": {
      "text": "Wodify also allows a burst of 20 requests above the rate before throttling. The lines read do not say whether the limits are per key or per user, so they are applied here to your whole app, and a month is taken as 31 days.",
      "src": {
        "url": "https://docs.wodify.com/docs/rate-limiting",
        "quote": "Burst 20 requests",
        "ev": "ops/sources/evidence/integrate-wodify-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Exponential backoff on 429",
        "src": {
          "url": "https://docs.wodify.com/docs/rate-limiting",
          "quote": "We recommend implementing exponential backoff",
          "ev": "ops/sources/evidence/integrate-wodify-api.json"
        }
      },
      {
        "text": "Batch requests instead of looping single calls",
        "src": {
          "url": "https://docs.wodify.com/docs/rate-limiting",
          "quote": "Batch requests where possible — avoid sending individual requests in rapid loops.",
          "ev": "ops/sources/evidence/integrate-wodify-api.json"
        }
      },
      {
        "text": "Cache data you reference often",
        "src": {
          "url": "https://docs.wodify.com/docs/rate-limiting",
          "quote": "Cache responses — store data you reference frequently rather than re-fetching it.",
          "ev": "ops/sources/evidence/integrate-wodify-api.json"
        }
      }
    ]
  },
  {
    "id": "terra",
    "name": "Terra",
    "guide": "/integrate/terra-api",
    "tiers": [
      {
        "id": "default",
        "label": "Data-read endpoints",
        "limits": [
          {
            "label": "requested days per hour, per user",
            "max": 6000,
            "window": 3600,
            "scope": "user",
            "unit": "days",
            "src": {
              "url": "https://docs.tryterra.co/reference/health-and-fitness-api/rate-limits",
              "quote": "your code has issued requests for this user totalling more than 6,000 days in the current hour",
              "ev": "ops/sources/evidence/integrate-terra-api.json"
            }
          }
        ]
      }
    ],
    "maxDaysPerRequest": {
      "days": 1826,
      "src": {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/rate-limits",
        "quote": "your start_date / end_date window is wider than 5 years",
        "ev": "ops/sources/evidence/integrate-terra-api.json"
      }
    },
    "scopeNote": {
      "text": "Terra's limit counts days of data requested, not requests: each request counts the days its date range spans. Terra says it applies rate limits on data-read endpoints.",
      "src": {
        "url": "https://docs.tryterra.co/reference/health-and-fitness-api/rate-limits",
        "quote": "Terra applies rate limits on data-read endpoints",
        "ev": "ops/sources/evidence/integrate-terra-api.json"
      }
    },
    "mitigations": [
      {
        "text": "Deliver to a webhook (or a database, bucket or queue) instead of reading",
        "src": {
          "url": "https://tryterra.co/",
          "quote": "Terra delivers to webhooks, SQL databases (Postgres and MySQL), Supabase, cloud storage (S3, GCS and Azure Blob), queueing services (SQS and Kafka), MongoDB and Firestore.",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      },
      {
        "text": "Ranges over a month go through to_webhook and arrive asynchronously",
        "src": {
          "url": "https://docs.tryterra.co/unified-api/managing-user-health-data/requesting-historical-data",
          "quote": "Time ranges longer than one month must use to_webhook=true , and Terra sends the data asynchronously .",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      },
      {
        "text": "Terra handles retries and backoff against the providers' own limits",
        "src": {
          "url": "https://docs.tryterra.co/unified-api/getting-started",
          "quote": "Terra has no rate limits of its own. Providers do, and Terra handles retries and backoff for you.",
          "ev": "ops/sources/evidence/integrate-terra-api.json"
        }
      }
    ]
  },
  {
    "id": "concept2",
    "name": "Concept2 Logbook",
    "guide": "/integrate/concept2-api",
    "unlimited": {
      "text": "Concept2 says the API is not currently rate limited, that this may change, and that abuse will bring rate limits or removal of access.",
      "src": {
        "url": "https://log.concept2.com/developers/documentation/",
        "quote": "The API is not currently rate limited. This may change in the future. Abuse of the API will result in either rate limits or removal of access.",
        "ev": "ops/sources/evidence/integrate-concept2-api.json"
      }
    },
    "tiers": [],
    "mitigations": [
      {
        "text": "A webhook on result added, updated or deleted",
        "src": {
          "url": "https://log.concept2.com/developers/documentation/",
          "quote": "Through your self-service developer portal, you can register and manage a webhook that will fire when a relevant result is added, updated, or deleted.",
          "ev": "ops/sources/evidence/integrate-concept2-api.json"
        }
      }
    ]
  }
];

/** Vendors whose limits are not documented in the pages read, and why. */
export const NOT_DOCUMENTED = [
  {
    "id": "garmin",
    "name": "Garmin",
    "guide": "/integrate/garmin-api",
    "reason": "Garmin's public program pages publish no request limits; the overview gives Starter a \"Limited\" user capacity without a number.",
    "src": {
      "url": "https://developer.garmin.com/gc-developer-program/overview/",
      "quote": "Push only Historical Data Not included User Capacity Limited",
      "ev": "ops/sources/evidence/integrate-garmin-api.json"
    }
  },
  {
    "id": "suunto",
    "name": "Suunto",
    "guide": "/integrate/suunto-api",
    "reason": "Suunto says the developer API is rate-limited and has smaller limits than production, but publishes neither number.",
    "src": {
      "url": "https://apizone.suunto.com/faq",
      "quote": "There developer API has same capabilities as the production API. However, the number of calls you can do with developer API are rate-limited.",
      "ev": "ops/sources/evidence/integrate-suunto-api.json"
    }
  },
  {
    "id": "mindbody",
    "name": "Mindbody",
    "guide": "/integrate/mindbody-api",
    "reason": "Mindbody sets daily call limits when it issues your API key, plus system limits; no public number.",
    "src": {
      "url": "https://developers.mindbodyonline.com/WebhooksDocumentation",
      "quote": "There are two kinds of rate limits: daily call limits and system limits. Your daily call limits are defined when you receive your API Key. System limits are in place to ensure faster response times and stability. If you need Mindbody to increase your rate limits, contact your account manager.",
      "ev": "ops/sources/evidence/integrate-mindbody-api.json"
    }
  },
  {
    "id": "glofox",
    "name": "Glofox",
    "guide": "/integrate/glofox-api",
    "reason": "Glofox documents a 429 when you exceed the rate limit, but the sections read do not state the limit.",
    "src": {
      "url": "https://api-portal.glofox.com/api-portal/glofox/api/openapi-reference.html",
      "quote": "429 Too Many Requests The API blocks the request when you exceed the rate limit.",
      "ev": "ops/sources/evidence/integrate-glofox-api.json"
    }
  },
  {
    "id": "samsung",
    "name": "Samsung Health Data SDK",
    "guide": "/integrate/samsung-health-api",
    "reason": "An on-device SDK that reads Samsung Health on the phone; Samsung's pages describe no request limits."
  },
  {
    "id": "mariana-tek",
    "name": "Mariana Tek",
    "guide": "/integrate/mariana-tek-api",
    "reason": "Rate limits do not appear in the guides read, and the Admin API reference was not among them."
  }
];

export const DEFAULT_INPUTS = { users: 1000, syncsPerDay: 24, endpointsPerSync: 3, timing: "spread", daysPerRequest: 1 };

export const BOUNDS = {
  users: [1, 10_000_000],
  syncsPerDay: [1, 1440],
  endpointsPerSync: [1, 100],
  daysPerRequest: [1, 3650],
};

/** "300 requests / minute", "86.4M requests / day", "120,000 requests / minute"
 *  → { max, window }. Throws on anything else, so a reworded source table
 *  fails the build instead of producing a wrong number. */
export function parsePublishedLimit(text) {
  const m = /^\s*([\d.,]+)\s*([KMB])?\s+requests\s*\/\s*(second|minute|hour|day)\s*$/i.exec(String(text));
  if (!m) throw new Error(`Unrecognized limit text: ${text}`);
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? "").toUpperCase()] ?? 1;
  const max = Math.round(Number(m[1].replace(/,/g, "")) * mult);
  const window = { second: 1, minute: 60, hour: 3600, day: DAY }[m[3].toLowerCase()];
  if (!Number.isFinite(max) || max <= 0) throw new Error(`Unrecognized limit number: ${text}`);
  return { max, window };
}

/** A limit's capacity for `users` registered users (Polar scales with users). */
export function capacity(limit, users) {
  return limit.max + (limit.perUser ?? 0) * users;
}

/** What one user's sync costs against this limit: requests, or requested days. */
export function perSync(limit, inputs) {
  return inputs.endpointsPerSync * (limit.unit === "days" ? inputs.daysPerRequest : 1);
}

/** Average syncs one user makes within the window. */
export function syncsInWindow(limit, inputs) {
  return (inputs.syncsPerDay * limit.window) / DAY;
}

/** The most syncs one user can land in a single window: at least one, since
 *  a single sync's requests arrive together. */
export function worstSyncsInWindow(limit, inputs) {
  return Math.max(1, Math.ceil(syncsInWindow(limit, inputs) - 1e-9));
}

/** Requests (or requested days) counted against the limit in its window. */
export function demand(limit, inputs) {
  const cost = perSync(limit, inputs);
  if (limit.scope === "user") return worstSyncsInWindow(limit, inputs) * cost;
  if (inputs.timing === "aligned") return inputs.users * worstSyncsInWindow(limit, inputs) * cost;
  return Math.max(cost, inputs.users * syncsInWindow(limit, inputs) * cost);
}

/**
 * The most users this sync pattern supports before the limit is exceeded:
 * Infinity when it never binds (a per-user limit one user stays under, or a
 * Polar-style limit that grows faster than the load), 0 when even one user
 * exceeds it.
 */
export function maxUsers(limit, inputs) {
  const cost = perSync(limit, inputs);
  if (limit.scope === "user") return worstSyncsInWindow(limit, inputs) * cost <= limit.max ? Infinity : 0;
  if (cost > capacity(limit, 1)) return 0;
  const perUserLoad =
    inputs.timing === "aligned" ? worstSyncsInWindow(limit, inputs) * cost : syncsInWindow(limit, inputs) * cost;
  const growth = limit.perUser ?? 0;
  if (perUserLoad <= growth) return Infinity;
  const n = Math.floor(limit.max / (perUserLoad - growth) + 1e-9);
  return Math.min(Math.max(n, inputs.timing === "aligned" ? 0 : 1), BOUNDS.users[1] * 10);
}

/** One row per limit, and the binding one: the highest share of its limit
 *  (ties go to the shorter window, which a burst hits first). */
export function evaluateTier(tier, inputs) {
  const rows = tier.limits.map((limit) => {
    const cap = capacity(limit, inputs.users);
    const used = demand(limit, inputs);
    return { limit, capacity: cap, demand: used, utilization: used / cap, maxUsers: maxUsers(limit, inputs) };
  });
  const binding = rows.reduce(
    (b, r) => (!b || r.utilization > b.utilization + 1e-12 || (Math.abs(r.utilization - b.utilization) <= 1e-12 && r.limit.window < b.limit.window) ? r : b),
    null,
  );
  return { rows, binding, over: rows.some((r) => r.utilization > 1) };
}

/** The tier a vendor uses under a tier choice map ({ vendorId: tierId }). */
export function pickTier(vendor, tiers = {}) {
  return vendor.tiers.find((t) => t.id === tiers[vendor.id]) ?? vendor.tiers[0] ?? null;
}

/** Every vendor with a documented limit, evaluated and sorted: over the limit
 *  first, then by how close the binding limit is. */
export function evaluateAll(vendors, inputs, tiers = {}) {
  return vendors
    .filter((v) => v.tiers.length > 0)
    .map((v) => {
      const tier = pickTier(v, tiers);
      const r = evaluateTier(tier, inputs);
      const warnings = [];
      if (v.maxDaysPerRequest && inputs.daysPerRequest > v.maxDaysPerRequest.days) warnings.push("span");
      return { vendor: v, tier, ...r, warnings };
    })
    .sort((a, b) => b.binding.utilization - a.binding.utilization);
}

/** Total requests the pattern makes, independent of any vendor. */
export function totals(inputs) {
  const perDay = inputs.users * inputs.syncsPerDay * inputs.endpointsPerSync;
  return {
    perDay,
    perMinuteAverage: perDay / 1440,
    perMinutePeak: inputs.timing === "aligned" ? inputs.users * inputs.endpointsPerSync * Math.max(1, Math.ceil(inputs.syncsPerDay / 1440 - 1e-9)) : perDay / 1440,
  };
}

/** "per 15 minutes", "per day", "per 31 days" … */
export function windowLabel(seconds) {
  if (seconds === 1) return "second";
  if (seconds < 3600 && seconds % 60 === 0) return seconds === 60 ? "minute" : `${seconds / 60} minutes`;
  if (seconds < DAY && seconds % 3600 === 0) return seconds === 3600 ? "hour" : `${seconds / 3600} hours`;
  if (seconds % DAY === 0) return seconds === DAY ? "day" : `${seconds / DAY} days`;
  return `${seconds} seconds`;
}

const clampInt = (v, [lo, hi], dflt) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && v !== null && v !== "" ? Math.min(hi, Math.max(lo, n)) : dflt;
};

/** Reads ?u=&s=&e=&t=&d=&tier=vendor:tier,… with every number clamped to BOUNDS. */
export function parseCalcState(search, vendors) {
  const p = new URLSearchParams(search);
  const inputs = {
    users: clampInt(p.get("u"), BOUNDS.users, DEFAULT_INPUTS.users),
    syncsPerDay: clampInt(p.get("s"), BOUNDS.syncsPerDay, DEFAULT_INPUTS.syncsPerDay),
    endpointsPerSync: clampInt(p.get("e"), BOUNDS.endpointsPerSync, DEFAULT_INPUTS.endpointsPerSync),
    timing: p.get("t") === "aligned" ? "aligned" : "spread",
    daysPerRequest: clampInt(p.get("d"), BOUNDS.daysPerRequest, DEFAULT_INPUTS.daysPerRequest),
  };
  const tiers = {};
  for (const pair of (p.get("tier") ?? "").split(",")) {
    const [vid, tid] = pair.split(":");
    const v = vendors.find((x) => x.id === vid);
    if (v && v.tiers.some((t) => t.id === tid)) tiers[vid] = tid;
  }
  return { inputs, tiers };
}

/** The query string for a state; defaults are left out. */
export function calcStateToSearch({ inputs, tiers }) {
  const p = new URLSearchParams();
  if (inputs.users !== DEFAULT_INPUTS.users) p.set("u", String(inputs.users));
  if (inputs.syncsPerDay !== DEFAULT_INPUTS.syncsPerDay) p.set("s", String(inputs.syncsPerDay));
  if (inputs.endpointsPerSync !== DEFAULT_INPUTS.endpointsPerSync) p.set("e", String(inputs.endpointsPerSync));
  if (inputs.timing !== DEFAULT_INPUTS.timing) p.set("t", inputs.timing);
  if (inputs.daysPerRequest !== DEFAULT_INPUTS.daysPerRequest) p.set("d", String(inputs.daysPerRequest));
  const t = Object.entries(tiers ?? {}).map(([v, id]) => `${v}:${id}`);
  if (t.length) p.set("tier", t.join(","));
  const s = p.toString().replace(/%2C/g, ",").replace(/%3A/g, ":");
  return s ? `?${s}` : "";
}
