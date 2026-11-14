/**
 * GENERATED — do not hand-edit. Rebuild with:
 *   node scripts/build-api-demand.mjs
 * after scripts/search-pull.mjs (the weekly live pull).
 *
 * What developers searched for about each product in the API directory, in
 * the 28 days 2026-10-15 to 2026-11-11: impressions of the
 * disclosed queries naming the product, per engine and never added together,
 * and the pages on this site those queries surfaced, with up to three of the
 * queries each. Selection and filtering rules are in the script's header.
 * 25 products.
 */

export type DemandEngine = "Google" | "Bing" | "Google and Bing";
export type DemandPage = { href: string; queries: { q: string; engine: DemandEngine }[] };
export type ApiDemand = { google: number; bing: number; pages: DemandPage[] };

export const API_DEMAND_RANGE = {"start":"2026-10-15","end":"2026-11-11"} as const;

export const API_DEMAND: Record<string, ApiDemand> = {
  "fitbit": {
    "google": 46,
    "bing": 51,
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
        "href": "/fitness-apis/wearable-data-apis",
        "queries": [
          {
            "q": "purina vs fitbit",
            "engine": "Google"
          },
          {
            "q": "cerave vs fitbit",
            "engine": "Google"
          },
          {
            "q": "fitbit vs purina",
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
        "href": "/alternatives/fitbit-api-alternatives",
        "queries": [
          {
            "q": "what are the best alternatives to labfront for a research study using fitbit devices?",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/google-health-api/floors",
        "queries": [
          {
            "q": "fitbit air floors",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/google-health-api/vo2-max",
        "queries": [
          {
            "q": "vo2 max in google fitbit air",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "garmin": {
    "google": 125,
    "bing": 142,
    "pages": [
      {
        "href": "/pricing/garmin-api-pricing",
        "queries": [
          {
            "q": "garmin api",
            "engine": "Google"
          },
          {
            "q": "garmin api cost",
            "engine": "Google"
          },
          {
            "q": "garmin api pricing",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/fix/garmin-api-personal-use",
        "queries": [
          {
            "q": "garmin api for personal use",
            "engine": "Bing"
          },
          {
            "q": "garmin personal api",
            "engine": "Bing"
          },
          {
            "q": "garmin personal api key",
            "engine": "Bing"
          }
        ]
      },
      {
        "href": "/libraries/compare/garminconnect-vs-garth",
        "queries": [
          {
            "q": "garmin connect python library garth unofficial api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/garmin-api",
        "queries": [
          {
            "q": "garmin connect api",
            "engine": "Google"
          },
          {
            "q": "api garmin",
            "engine": "Google and Bing"
          },
          {
            "q": "garmin api",
            "engine": "Bing"
          }
        ]
      },
      {
        "href": "/fix/garmin-api-approval",
        "queries": [
          {
            "q": "garmin connect developer program access request form",
            "engine": "Google"
          },
          {
            "q": "garmin api key",
            "engine": "Google"
          },
          {
            "q": "api settings in garmin",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/libraries/garminconnect",
        "queries": [
          {
            "q": "garmin connect api python",
            "engine": "Bing"
          }
        ]
      }
    ]
  },
  "oura": {
    "google": 39,
    "bing": 26,
    "pages": [
      {
        "href": "/integrate/oura-api",
        "queries": [
          {
            "q": "oura connector",
            "engine": "Google"
          },
          {
            "q": "integracao oura",
            "engine": "Google"
          },
          {
            "q": "oura api",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/oura-api-alternatives",
        "queries": [
          {
            "q": "oura member care alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "whoop": {
    "google": 70,
    "bing": 39,
    "pages": [
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
            "q": "whoop api access",
            "engine": "Bing"
          }
        ]
      },
      {
        "href": "/compare/apple-watch-vs-whoop",
        "queries": [
          {
            "q": "whoop vs apple watch",
            "engine": "Google"
          },
          {
            "q": "whoop vs apple watch app",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "strava": {
    "google": 33,
    "bing": 21,
    "pages": [
      {
        "href": "/integrate/strava-api",
        "queries": [
          {
            "q": "strava api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "polar": {
    "google": 21,
    "bing": 11,
    "pages": [
      {
        "href": "/integrate/polar-api",
        "queries": [
          {
            "q": "polar api",
            "engine": "Google"
          },
          {
            "q": "polar accesslink",
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
    "google": 367,
    "bing": 76,
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
        "href": "/integrate/healthkit",
        "queries": [
          {
            "q": "apple healthkit",
            "engine": "Google"
          },
          {
            "q": "healthkit api",
            "engine": "Bing"
          },
          {
            "q": "apple healthkit api",
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
            "q": "react native health kit",
            "engine": "Google"
          },
          {
            "q": "react-native-healthkit",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/healthkit",
        "queries": [
          {
            "q": "what is healthkit",
            "engine": "Google"
          },
          {
            "q": "health kit",
            "engine": "Google"
          },
          {
            "q": "apple healthkit data",
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
      }
    ]
  },
  "health-connect": {
    "google": 13,
    "bing": 69,
    "pages": [
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
        "href": "/test/health-connect-test-data",
        "queries": [
          {
            "q": "health connect fake steps",
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
    "google": 348,
    "bing": 25,
    "pages": [
      {
        "href": "/alternatives/terra-alternatives",
        "queries": [
          {
            "q": "terra api alternatives",
            "engine": "Google"
          },
          {
            "q": "terra wellness alternatives",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/integrate/terra-api",
        "queries": [
          {
            "q": "terra wearable api",
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
        "href": "/alternatives",
        "queries": [
          {
            "q": "terra api alternative",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/alternatives/human-api-alternatives",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
          {
            "q": "spike vs terra api in united states",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "junction": {
    "google": 6,
    "bing": 19,
    "pages": [
      {
        "href": "/alternatives/healthkit-alternatives",
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
    "google": 138,
    "bing": 11,
    "pages": []
  },
  "spike": {
    "google": 35,
    "bing": 2,
    "pages": [
      {
        "href": "/alternatives/human-api-alternatives",
        "queries": [
          {
            "q": "compare spike api vs terra vs human api in united states",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/terra-vs-spike",
        "queries": [
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
        "href": "/compare/rook-vs-spike",
        "queries": [
          {
            "q": "spike api alternatives",
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
    "bing": 2,
    "pages": [
      {
        "href": "/alternatives/nutritionix-alternatives",
        "queries": [
          {
            "q": "nutritionix alternative",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/compare/nutritionix-vs-edamam",
        "queries": [
          {
            "q": "nutritionix api alternative",
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
    "google": 3,
    "bing": 2,
    "pages": [
      {
        "href": "/compare/edamam-vs-spoonacular",
        "queries": [
          {
            "q": "edamam",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "usda-fdc": {
    "google": 2,
    "bing": 4,
    "pages": [
      {
        "href": "/alternatives/nutritionix-alternatives",
        "queries": [
          {
            "q": "usda fooddata central (.gov) alternatives",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "open-food-facts": {
    "google": 0,
    "bing": 3,
    "pages": []
  },
  "exercisedb": {
    "google": 106,
    "bing": 8,
    "pages": [
      {
        "href": "/pricing/exercise-database-api-pricing",
        "queries": [
          {
            "q": "exercisedb",
            "engine": "Google"
          },
          {
            "q": "exercisedb free",
            "engine": "Google"
          },
          {
            "q": "exercisedb api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "wger": {
    "google": 13,
    "bing": 12,
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
        "href": "/fitness-apis/exercise-database-apis",
        "queries": [
          {
            "q": "wger exercise database api free",
            "engine": "Bing"
          }
        ]
      }
    ]
  },
  "your-move": {
    "google": 3,
    "bing": 0,
    "pages": [
      {
        "href": "/integrate",
        "queries": [
          {
            "q": "ymove api",
            "engine": "Google"
          }
        ]
      }
    ]
  },
  "kinestex": {
    "google": 1,
    "bing": 2,
    "pages": []
  },
  "sency": {
    "google": 0,
    "bing": 0,
    "pages": []
  },
  "quickpose": {
    "google": 0,
    "bing": 0,
    "pages": []
  },
  "mediapipe": {
    "google": 56,
    "bing": 72,
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
            "q": "yolo pose vs mediapipe",
            "engine": "Google"
          }
        ]
      },
      {
        "href": "/motion/mediapipe-pose-landmarker-models",
        "queries": [
          {
            "q": "mediapipe pose landmarker lite",
            "engine": "Google and Bing"
          },
          {
            "q": "mediapipe pose landmarker",
            "engine": "Google and Bing"
          }
        ]
      }
    ]
  },
  "movenet": {
    "google": 22,
    "bing": 6,
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
          }
        ]
      }
    ]
  },
  "apple-vision": {
    "google": 38,
    "bing": 0,
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
      },
      {
        "href": "/pose-keypoints/apple-vision-3d",
        "queries": [
          {
            "q": "apple vision body pose",
            "engine": "Google"
          }
        ]
      }
    ]
  }
};
