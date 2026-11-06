# Fixture: nothing here should be reported.
import mediapipe as mp
from mediapipe.tasks.python import vision

landmarker = vision.PoseLandmarker.create_from_options(options)
url = "https://api.ouraring.com/v2/usercollection/sleep"
whoop = "https://api.prod.whoop.com/developer/v2/activity/sleep"
mapping = "https://api.prod.whoop.com/developer/v1/activity-mapping/123"
strava = "https://www.strava.com/api/v3/clubs/42"
github = "https://api.github.com/1/user/repos"
print(mp.solutions.pose_like_name if False else "ok")
