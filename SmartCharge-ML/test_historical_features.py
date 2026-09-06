import joblib
import pandas as pd
from historical_features import get_historical_features

# ============================================================
# 1. DEFINE TEST CONTEXT FROM DATASET
# ============================================================
location = "public institution"
charger_type = 0
target_datetime_str = "2022-08-01 07:00:00"
target_dt = pd.to_datetime(target_datetime_str)

print("============================================================")
print("1. HISTORICAL FEATURE LOOKUP TEST")
print("============================================================")
print(f"Target Context:")
print(f"  Location:        {location}")
print(f"  ChargerType:     {charger_type}")
print(f"  Target Datetime: {target_dt}")

# ============================================================
# 2. REQUEST HISTORICAL FEATURES FROM LOOKUP MODULE
# ============================================================
res = get_historical_features(location, charger_type, target_dt)

if not res.get("available"):
    print("\nError: Historical features not available.")
    print("Reason:", res.get("reason"))
    exit(1)

hist_features = res["features"]

print("\nDerived Historical Features (Strictly before target datetime):")
for k, v in hist_features.items():
    print(f"  {k}: {v}")

# ============================================================
# 3. ASSEMBLE 10-FEATURE MODEL INPUT
# ============================================================
hour = target_dt.hour
day_of_week = target_dt.dayofweek
month = target_dt.month

model_input_dict = {
    "Location": location,
    "ChargerType": charger_type,
    "hour": hour,
    "day_of_week": day_of_week,
    "month": month,
    "PreviousDemand": hist_features["PreviousDemand"],
    "PreviousSessions": hist_features["PreviousSessions"],
    "HoursSincePrevious": hist_features["HoursSincePrevious"],
    "RecentAvgDemand": hist_features["RecentAvgDemand"],
    "SameHourAvgDemand": hist_features["SameHourAvgDemand"]
}

feature_order = [
    "Location",
    "ChargerType",
    "hour",
    "day_of_week",
    "month",
    "PreviousDemand",
    "PreviousSessions",
    "HoursSincePrevious",
    "RecentAvgDemand",
    "SameHourAvgDemand"
]

input_df = pd.DataFrame([model_input_dict])[feature_order]

print("\n============================================================")
print("2. COMPLETE 10-FEATURE MODEL INPUT")
print("============================================================")
print(input_df.to_dict(orient="records")[0])

# ============================================================
# 4. LOAD NEW MODEL & EXECUTE PREDICTION
# ============================================================
print("\n============================================================")
print("3. LOADING NEW MODEL & EXECUTING INFERENCE")
print("============================================================")

model_path = "smartcharge_demand_model.pkl"
model_pipeline = joblib.load(model_path)
print(f"Model successfully loaded from: {model_path}")

predicted_demand = float(model_pipeline.predict(input_df)[0])

print(f"\n============================================================")
print(f"PREDICTED TOTAL DEMAND: {predicted_demand:.2f} kWh")
print(f"============================================================")
print("Prediction successfully completed!")
