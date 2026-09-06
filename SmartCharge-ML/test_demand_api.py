import requests

BASE_URL = "http://127.0.0.1:8000"

print("============================================================")
print("1. TESTING ROOT ENDPOINT (GET /)")
print("============================================================")
res_root = requests.get(f"{BASE_URL}/")
print("Status Code:", res_root.status_code)
print("Response JSON:", res_root.json())
assert res_root.status_code == 200, "Root endpoint failed!"


print("\n============================================================")
print("2. REGRESSION TEST: OLD ENDPOINT (POST /predict)")
print("============================================================")
old_payload = {
    "ChargerID": 2060,
    "ChargerType": 0,
    "ChargerCompany": 0,
    "hour": 7,
    "day_of_week": 0,
    "month": 8
}
print("Payload:", old_payload)
res_old = requests.post(f"{BASE_URL}/predict", json=old_payload)
print("Status Code:", res_old.status_code)
print("Response JSON:", res_old.json())
assert res_old.status_code == 200, "Old /predict endpoint failed!"
assert res_old.json().get("predictedDemand") == 9.96, f"Expected 9.96, got {res_old.json().get('predictedDemand')}"
print("[OK] Old /predict regression test PASSED!")


print("\n============================================================")
print("3. NEW ENDPOINT TEST: GENERALIZED MODEL (POST /predict-demand)")
print("============================================================")
new_payload = {
    "Location": "public institution",
    "ChargerType": 0,
    "target_datetime": "2022-08-01T07:00:00"
}
print("Payload:", new_payload)
res_new = requests.post(f"{BASE_URL}/predict-demand", json=new_payload)
print("Status Code:", res_new.status_code)
print("Response JSON:", res_new.json())
assert res_new.status_code == 200, "New /predict-demand endpoint failed!"
assert res_new.json().get("predictedDemand") == 26.30, f"Expected 26.30, got {res_new.json().get('predictedDemand')}"
print("[OK] New /predict-demand endpoint test PASSED!")


print("\n============================================================")
print("4. ERROR HANDLING TEST: INSUFFICIENT HISTORICAL DATA")
print("============================================================")
missing_payload = {
    "Location": "nonexistent_location_xyz",
    "ChargerType": 0,
    "target_datetime": "2022-08-01T07:00:00"
}
print("Payload:", missing_payload)
res_missing = requests.post(f"{BASE_URL}/predict-demand", json=missing_payload)
print("Status Code:", res_missing.status_code)
print("Response JSON:", res_missing.json())
assert res_missing.status_code == 404, f"Expected status 404, got {res_missing.status_code}"
print("[OK] Insufficient history error handling test PASSED!")


print("\n============================================================")
print("ALL API TESTS SUCCEEDED CLEANLY!")
print("============================================================")
