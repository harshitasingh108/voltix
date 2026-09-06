import requests

# API Endpoint URL
API_URL = "http://127.0.0.1:8000/predict"

# Real feature row extracted from ChargingRecords test dataset (ChargerID: 2060, 2022-08-01 07:00:00)
payload = {
    "ChargerID": 2060,
    "ChargerType": 0,
    "ChargerCompany": 0,
    "hour": 7,
    "day_of_week": 0,
    "month": 8,
    "PreviousDemand": 10.39,
    "PreviousSessions": 1.0,
    "HoursSincePrevious": 265.0,
    "RecentAvgDemand": 7.393333,
    "SameHourAvgDemand": 4.963333
}

print("============================================================")
print("SENDING PREDICTION REQUEST TO FASTAPI")
print("============================================================")
print("Target URL:", API_URL)
print("Payload:", payload)

# Send POST request to FastAPI endpoint
response = requests.post(API_URL, json=payload)

# Display results
if response.status_code == 200:
    data = response.json()
    print("\n============================================================")
    print("API RESPONSE")
    print("============================================================")
    print("Status Code:", response.status_code)
    print("Response JSON:", data)
    print("Predicted Demand:", data.get("predictedDemand"), "kWh")
else:
    print("Request failed with status code:", response.status_code)
    print("Error output:", response.text)
