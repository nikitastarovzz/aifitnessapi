// Fixture for scripts/deprecation-scan.test.mjs: one rule per line where marked.
import GoogleFit from "react-native-google-fit";

export async function terraWidget(devId: string, apiKey: string) {
  return fetch("https://api.tryterra.co/v2/auth/generateWidgetSession", {
    method: "POST",
    headers: { "dev-id": devId, "x-api-key": apiKey },
  });
}

export const fitRest = (token: string) =>
  fetch(`https://www.googleapis.com/fitness/v1/users/me/dataSources`, { headers: { Authorization: `Bearer ${token}` } });

export const goodTerra = "https://access.tryterra.co/api/widget/session";
export const goodGoogle = "https://health.googleapis.com/v4/users/me/dataTypes/steps/dataPoints";

void GoogleFit;
