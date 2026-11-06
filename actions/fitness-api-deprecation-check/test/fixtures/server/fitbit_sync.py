# Fixture for scripts/deprecation-scan.test.mjs and .github/workflows/deprecation-check.yml.
# Not real code: each line exercises one rule. Line numbers are asserted in test/expected.json.
import requests

FITBIT = "https://api.fitbit.com"


def steps(token, date):
    return requests.get(f"https://api.fitbit.com/1/user/-/activities/steps/date/{date}/7d.json", headers={"Authorization": f"Bearer {token}"})


def heart_intraday(token, date):
    return requests.get(f"{FITBIT}/1/user/-/activities/heart/date/{date}/1d/1min.json")


def sleep(token, start, end):
    return requests.get(FITBIT + "/1.2/user/-/sleep/date/" + start + "/" + end + ".json")


def refresh(refresh_token):
    return requests.post("https://api.fitbit.com/oauth2/token", data={"grant_type": "refresh_token"})


def kept_on_purpose():
    return "https://api.fitbit.com/1/user/-/profile.json"  # fitness-api-deprecation-ignore


def oura_v1(token):
    return requests.get("https://api.ouraring.com/v1/sleep", params={"access_token": token})


def whoop_v1():
    return "https://api.prod.whoop.com/developer/v1/recovery"


def strava_club(club_id):
    return f"https://www.strava.com/api/v3/clubs/{club_id}/members"
