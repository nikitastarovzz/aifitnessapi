/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/build-api-demand.mjs
 * after scripts/search-pull.mjs (the weekly live pull).
 *
 * What developers searched for about each product in the API directory, in
 * the 28 days 2026-09-27 to 2026-10-24: impressions of the
 * disclosed queries naming the product, per engine and never added together,
 * and the pages on this site those queries surfaced, with up to three of the
 * queries each. Selection and filtering rules are in the script's header.
 * 24 products.
 */

export type DemandEngine = "Google" | "Bing" | "Google and Bing";
export type DemandPage = { href: string; queries: { q: string; engine: DemandEngine }[] };
export type ApiDemand = { google: number; bing: number; pages: DemandPage[] };

export const API_DEMAND_RANGE = {"start":"2026-09-27","end":"2026-10-24"} as const;

export const API_DEMAND: Record<string, ApiDemand> = {
  "fitbit": {
    "google": 55,
    "bing": 78,
    "pages": [
      {
        "href": "/integrate/fitbit-api",
        "queries": [
          {
            "q": "fitbit api",
            "engine": "Google"
          },
          {
            "q": "fitbit get the current running pace api",
            "engine": "Bing"
          },
          {
            "q": "api fitbit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "queries": [
          {
            "q": "should i build my own fitbit api integration or use a research platform? which companies offer this?",
            "engine": "Google"
          },
          {
            "q": "fitbit web api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "is there a platform that gives me a single api to pull all my participants' fitbit data at once?",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/migrate/fitbit-research-studies-after-turndown",
        "queries": [
          {
            "q": "fitbit api deprecation",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/python-fitbit",
        "queries": [
          {
            "q": "fitbit api python",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/migrate/fitbit-web-api-to-google-health",
        "queries": [
          {
            "q": "fitbit web",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "garmin": {
    "google": 279,
    "bing": 55,
    "pages": [
      {
        "href": "/libraries/garminconnect",
        "queries": [
          {
            "q": "garmin connect python library garth unofficial api",
            "engine": "Google"
          },
          {
            "q": "garmin connect python",
            "engine": "Google"
          },
          {
            "q": "python garmin connect",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra garmin api",
            "engine": "Google"
          },
          {
            "q": "terra garmin api terms",
            "engine": "Bing"
          },
          {
            "q": "terra garmin",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fix/garmin-api-approval",
        "queries": [
          {
            "q": "garmin api",
            "engine": "Google"
          },
          {
            "q": "garmin connect api",
            "engine": "Google"
          },
          {
            "q": "garmin connect developer program access request form",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "garmin health api oauth developer registration",
            "engine": "Google"
          },
          {
            "q": "garmin connect api private use alternative 2025",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/garmin-api",
        "queries": [
          {
            "q": "garmin connect iq api vs health api unterschied",
            "engine": "Google"
          },
          {
            "q": "api garmin",
            "engine": "Google"
          },
          {
            "q": "garmin api developer",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/devices/ant-plus-vs-bluetooth",
        "queries": [
          {
            "q": "garmin ant+",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "oura": {
    "google": 32,
    "bing": 21,
    "pages": [
      {
        "href": "/integrate/oura-api",
        "queries": [
          {
            "q": "oura connector",
            "engine": "Google"
          },
          {
            "q": "oura api",
            "engine": "Google"
          },
          {
            "q": "oura ring api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "whoop": {
    "google": 64,
    "bing": 35,
    "pages": [
      {
        "href": "/compare/apple-watch-vs-whoop",
        "queries": [
          {
            "q": "whoop api developer integration",
            "engine": "Google"
          },
          {
            "q": "whoop vs apple watch",
            "engine": "Google"
          },
          {
            "q": "whoop vs apple watch app",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/whoop-api",
        "queries": [
          {
            "q": "whoop api",
            "engine": "Google and Bing"
          },
          {
            "q": "is whoop api free",
            "engine": "Google"
          },
          {
            "q": "whoop developer api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/whoop-api-alternatives",
        "queries": [
          {
            "q": "how does whoop compare to alternatives for recovery scoring?",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "strava": {
    "google": 64,
    "bing": 16,
    "pages": [
      {
        "href": "/integrate/strava-api",
        "queries": [
          {
            "q": "strava api",
            "engine": "Google"
          },
          {
            "q": "strava integration",
            "engine": "Google"
          },
          {
            "q": "api strava",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/data/gps-activity-api",
        "queries": [
          {
            "q": "strava developers site route suggestion api endpoint",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/migrate/adapt-to-strava-api-changes",
        "queries": [
          {
            "q": "strava api integration",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "polar": {
    "google": 16,
    "bing": 26,
    "pages": [
      {
        "href": "/integrate/polar-api",
        "queries": [
          {
            "q": "polar flow api",
            "engine": "Google and Bing"
          },
          {
            "q": "polar api",
            "engine": "Google"
          },
          {
            "q": "polar access link v3",
            "engine": "Bing"
          }
        ]
      }
    ]
  },
  "healthkit": {
    "google": 215,
    "bing": 77,
    "pages": [
      {
        "href": "/fitness-apis/apple-healthkit-vs-google-health-connect",
        "queries": [
          {
            "q": "cliniko vs healthkit",
            "engine": "Google"
          },
          {
            "q": "healthkit vs cliniko",
            "engine": "Google"
          },
          {
            "q": "google healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/healthkit",
        "queries": [
          {
            "q": "healthkit",
            "engine": "Google"
          },
          {
            "q": "health kit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/healthkit",
        "queries": [
          {
            "q": "apple healthkit",
            "engine": "Google"
          },
          {
            "q": "apple healthkit api",
            "engine": "Google"
          },
          {
            "q": "swift healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/react-native-health",
        "queries": [
          {
            "q": "react native healthkit",
            "engine": "Google"
          },
          {
            "q": "react-native-healthkit",
            "engine": "Google"
          },
          {
            "q": "react native health kit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/kingstinct-react-native-healthkit",
        "queries": [
          {
            "q": "kingstinct/react-native-healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/matrix",
        "queries": [
          {
            "q": "what is healthkit",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "health-connect": {
    "google": 26,
    "bing": 57,
    "pages": [
      {
        "href": "/libraries/flutter-health-connect",
        "queries": [
          {
            "q": "flutter health connect",
            "engine": "Google"
          },
          {
            "q": "health connect flutter",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/health-connect-api/permission-ui-guidelines",
        "queries": [
          {
            "q": "health connect permissions",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/health-connect-releases",
        "queries": [
          {
            "q": "health connect sdk",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "terra": {
    "google": 106,
    "bing": 32,
    "pages": [
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          },
          {
            "q": "spike vs terra api in united states",
            "engine": "Google"
          },
          {
            "q": "terra wearable api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra aggregator",
            "engine": "Google"
          },
          {
            "q": "terra wearables aggregator",
            "engine": "Bing"
          },
          {
            "q": "terra api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/terra-alternatives",
        "queries": [
          {
            "q": "terra api alternative",
            "engine": "Google"
          },
          {
            "q": "terra api alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "junction": {
    "google": 3,
    "bing": 19,
    "pages": [
      {
        "href": "/alternatives/terra-alternatives",
        "queries": [
          {
            "q": "what is the best vital api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "rook": {
    "google": 8,
    "bing": 13,
    "pages": []
  },
  "spike": {
    "google": 48,
    "bing": 2,
    "pages": [
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          },
          {
            "q": "spike vs terra api in united states",
            "engine": "Google"
          },
          {
            "q": "spike api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare",
        "queries": [
          {
            "q": "spike api alternative",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "nutritionix": {
    "google": 15,
    "bing": 3,
    "pages": [
      {
        "href": "/alternatives/nutritionix-alternatives",
        "queries": [
          {
            "q": "nutritionix alternative",
            "engine": "Google"
          },
          {
            "q": "nutritionix api alternative",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/nutritionix-vs-edamam",
        "queries": [
          {
            "q": "nutritionix api",
            "engine": "Google"
          },
          {
            "q": "nutritionix api pricing",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "edamam": {
    "google": 1,
    "bing": 2,
    "pages": []
  },
  "usda-fdc": {
    "google": 0,
    "bing": 5,
    "pages": []
  },
  "open-food-facts": {
    "google": 0,
    "bing": 3,
    "pages": []
  },
  "exercisedb": {
    "google": 34,
    "bing": 14,
    "pages": [
      {
        "href": "/alternatives/exercisedb-alternatives",
        "queries": [
          {
            "q": "exercisedb",
            "engine": "Google"
          },
          {
            "q": "is exercisedb io same as rapiapi exercisedb",
            "engine": "Bing"
          },
          {
            "q": "exercisedb (rapidapi)",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/pricing/exercise-database-api-pricing",
        "queries": [
          {
            "q": "exercisedb free",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "wger": {
    "google": 14,
    "bing": 6,
    "pages": [
      {
        "href": "/alternatives/exercisedb-alternatives",
        "queries": [
          {
            "q": "wger alternative",
            "engine": "Google"
          },
          {
            "q": "wger alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "kinestex": {
    "google": 1,
    "bing": 0,
    "pages": []
  },
  "sency": {
    "google": 0,
    "bing": 2,
    "pages": []
  },
  "quickpose": {
    "google": 0,
    "bing": 0,
    "pages": []
  },
  "mediapipe": {
    "google": 63,
    "bing": 58,
    "pages": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "queries": [
          {
            "q": "movenet vs mediapipe",
            "engine": "Google"
          },
          {
            "q": "mediapipe vs yolo",
            "engine": "Google"
          },
          {
            "q": "yolo pose vs mediapipe",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "queries": [
          {
            "q": "mediapipe pose landmarker",
            "engine": "Bing"
          },
          {
            "q": "mediapipe pose landmarker lite",
            "engine": "Bing"
          }
        ]
      }
    ]
  },
  "movenet": {
    "google": 18,
    "bing": 9,
    "pages": [
      {
        "href": "/motion/pose-estimation-models-compared",
        "queries": [
          {
            "q": "movenet vs mediapipe",
            "engine": "Google"
          },
          {
            "q": "mediapipe vs movenet",
            "engine": "Google"
          },
          {
            "q": "movenet model",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "apple-vision": {
    "google": 28,
    "bing": 1,
    "pages": [
      {
        "href": "/motion/apple-vision-body-pose",
        "queries": [
          {
            "q": "vndetecthumanbodyposerequest",
            "engine": "Google"
          },
          {
            "q": "vndetecthumanbodypose3drequest",
            "engine": "Google"
          }
        ]
      }
    ]
  }
};
