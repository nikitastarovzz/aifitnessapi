/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/build-api-demand.mjs
 * after scripts/search-pull.mjs (the weekly live pull).
 *
 * What developers searched for about each product in the API directory, in
 * the 28 days 2026-09-12 to 2026-10-09: impressions of the
 * disclosed queries naming the product, per engine and never added together,
 * and the pages on this site those queries surfaced, with up to three of the
 * queries each. Selection and filtering rules are in the script's header.
 * 24 products.
 */

export type DemandEngine = "Google" | "Bing" | "Google and Bing";
export type DemandPage = { href: string; queries: { q: string; engine: DemandEngine }[] };
export type ApiDemand = { google: number; bing: number; pages: DemandPage[] };

export const API_DEMAND_RANGE = {"start":"2026-09-12","end":"2026-10-09"} as const;

export const API_DEMAND: Record<string, ApiDemand> = {
  "fitbit": {
    "google": 42,
    "bing": 96,
    "pages": [
      {
        "href": "/integrate/fitbit-api",
        "queries": [
          {
            "q": "fitbit api",
            "engine": "Google"
          },
          {
            "q": "api fitbit",
            "engine": "Google"
          },
          {
            "q": "fitbit client id",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fitbit-api-shutdown",
        "queries": [
          {
            "q": "fitbit api deprecation",
            "engine": "Google"
          },
          {
            "q": "fitbit api end of life",
            "engine": "Bing"
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
        "href": "/migrate/fitbit-web-api-to-google-health",
        "queries": [
          {
            "q": "fitbit web",
            "engine": "Google"
          },
          {
            "q": "fitbit api deprecation",
            "engine": "Bing"
          }
        ]
      },
      {
        "href": "/alternatives/fitbit-api-alternatives",
        "queries": [
          {
            "q": "should i build my own fitbit api integration or use a research platform? which companies offer this?",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "garmin": {
    "google": 305,
    "bing": 43,
    "pages": [
      {
        "href": "/fix/garmin-api-approval",
        "queries": [
          {
            "q": "garmin api",
            "engine": "Google"
          },
          {
            "q": "garmin api access application suspended",
            "engine": "Google"
          },
          {
            "q": "garmin connect api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/garmin-api-alternatives",
        "queries": [
          {
            "q": "garmin connect api private use alternative 2025",
            "engine": "Google"
          },
          {
            "q": "garmin api for personal use",
            "engine": "Bing"
          }
        ]
      },
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
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "garmin health api oauth developer registration",
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
            "q": "garmin api developer",
            "engine": "Google"
          },
          {
            "q": "garmin api for personal use",
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
            "q": "terra api garmin",
            "engine": "Google"
          },
          {
            "q": "terra garmin",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "oura": {
    "google": 19,
    "bing": 31,
    "pages": [
      {
        "href": "/integrate/oura-api",
        "queries": [
          {
            "q": "oura api",
            "engine": "Google and Bing"
          },
          {
            "q": "oura cloud api",
            "engine": "Bing"
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
    "bing": 27,
    "pages": [
      {
        "href": "/integrate/whoop-api",
        "queries": [
          {
            "q": "whoop api",
            "engine": "Google and Bing"
          },
          {
            "q": "whoop developer",
            "engine": "Google"
          },
          {
            "q": "is whoop api free",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/apple-watch-vs-whoop",
        "queries": [
          {
            "q": "whoop api developer integration",
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
      },
      {
        "href": "/pricing",
        "queries": [
          {
            "q": "whoop api cost",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "strava": {
    "google": 74,
    "bing": 23,
    "pages": [
      {
        "href": "/integrate/strava-api",
        "queries": [
          {
            "q": "strava api",
            "engine": "Google"
          },
          {
            "q": "api strava",
            "engine": "Google"
          },
          {
            "q": "strava integration",
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
      },
      {
        "href": "/pricing/strava-api-pricing",
        "queries": [
          {
            "q": "strava api pricing",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "polar": {
    "google": 7,
    "bing": 23,
    "pages": [
      {
        "href": "/integrate/polar-api",
        "queries": [
          {
            "q": "polar flow api",
            "engine": "Google"
          },
          {
            "q": "polar accesslink api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "healthkit": {
    "google": 110,
    "bing": 83,
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
        "href": "/matrix",
        "queries": [
          {
            "q": "healthkit",
            "engine": "Google"
          },
          {
            "q": "what is healthkit",
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
            "q": "healthkit api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/react-native-health",
        "queries": [
          {
            "q": "react-native-healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/tools/permission-builder",
        "queries": [
          {
            "q": "healthkit permissions",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/healthkit-units",
        "queries": [
          {
            "q": "hkunit",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "health-connect": {
    "google": 23,
    "bing": 48,
    "pages": [
      {
        "href": "/alternatives/google-fit-api-alternatives",
        "queries": [
          {
            "q": "google fit apis deprecated health connect official 2026",
            "engine": "Google"
          },
          {
            "q": "google fit api deprecation health connect official 2026",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/flutter-health-connect",
        "queries": [
          {
            "q": "flutter health connect",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fix/google-fit-api-deprecated",
        "queries": [
          {
            "q": "google fit api deprecation health connect 2026 official",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/health-connect-api",
        "queries": [
          {
            "q": "health connect api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "terra": {
    "google": 85,
    "bing": 20,
    "pages": [
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra aggregator",
            "engine": "Google"
          },
          {
            "q": "terra garmin api",
            "engine": "Google"
          },
          {
            "q": "terra api",
            "engine": "Google"
          }
        ]
      },
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
    "google": 0,
    "bing": 16,
    "pages": []
  },
  "rook": {
    "google": 8,
    "bing": 3,
    "pages": []
  },
  "spike": {
    "google": 28,
    "bing": 3,
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
          }
        ]
      }
    ]
  },
  "nutritionix": {
    "google": 18,
    "bing": 6,
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
          }
        ]
      }
    ]
  },
  "edamam": {
    "google": 2,
    "bing": 5,
    "pages": []
  },
  "usda-fdc": {
    "google": 0,
    "bing": 2,
    "pages": []
  },
  "open-food-facts": {
    "google": 0,
    "bing": 1,
    "pages": []
  },
  "exercisedb": {
    "google": 35,
    "bing": 49,
    "pages": [
      {
        "href": "/alternatives/exercisedb-alternatives",
        "queries": [
          {
            "q": "exercisedb",
            "engine": "Google"
          },
          {
            "q": "exercisedb-style",
            "engine": "Bing"
          },
          {
            "q": "exercisedb api",
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
    "google": 8,
    "bing": 9,
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
      },
      {
        "href": "/compare/exercisedb-vs-wger",
        "queries": [
          {
            "q": "wger exercise api images license",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "kinestex": {
    "google": 0,
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
    "google": 133,
    "bing": 42,
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
            "q": "mediapipe vs yolo",
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
    "google": 39,
    "bing": 16,
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
            "q": "blazepose vs movenet",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "apple-vision": {
    "google": 14,
    "bing": 6,
    "pages": [
      {
        "href": "/motion/apple-vision-body-pose",
        "queries": [
          {
            "q": "vndetecthumanbodyposerequest",
            "engine": "Google"
          }
        ]
      }
    ]
  }
};
