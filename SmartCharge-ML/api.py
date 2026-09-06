import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ============================================================
# 1. LOAD PRE-TRAINED MODEL & DATASET HISTORY
# ============================================================

model = joblib.load("smartcharge_model.pkl")

# Pre-load dataset and compute historical features matching check_data.py
raw_df = pd.read_csv("data/ChargingRecords.csv")
raw_df["StartDatetime"] = pd.to_datetime(raw_df["StartDatetime"])
raw_df["date"] = raw_df["StartDatetime"].dt.date
raw_df["hour"] = raw_df["StartDatetime"].dt.hour

# Station-hour aggregation
station_hour = (
    raw_df.groupby(["ChargerID", "ChargerCompany", "Location", "ChargerType", "date", "hour"])
          .agg(
              Sessions=("Demand", "count"),
              TotalDemand=("Demand", "sum"),
              AvgDemand=("Demand", "mean")
          )
          .reset_index()
)

station_hour["date"] = pd.to_datetime(station_hour["date"])
station_hour["datetime"] = (
    station_hour["date"]
    + pd.to_timedelta(station_hour["hour"], unit="h")
)

station_hour["hour"] = station_hour["datetime"].dt.hour
station_hour["day_of_week"] = station_hour["datetime"].dt.dayofweek
station_hour["month"] = station_hour["datetime"].dt.month

station_hour = station_hour.sort_values(
    ["ChargerID", "datetime"]
).reset_index(drop=True)

# Historical leakage-safe feature calculations matching check_data.py
station_hour["PreviousSessions"] = (
    station_hour.groupby("ChargerID")["Sessions"].shift(1)
)

station_hour["PreviousDemand"] = (
    station_hour.groupby("ChargerID")["TotalDemand"].shift(1)
)

station_hour["PreviousDatetime"] = (
    station_hour.groupby("ChargerID")["datetime"].shift(1)
)

station_hour["HoursSincePrevious"] = (
    (station_hour["datetime"] - station_hour["PreviousDatetime"]).dt.total_seconds() / 3600
)

station_hour["RecentAvgDemand"] = (
    station_hour.groupby("ChargerID")["PreviousDemand"]
    .rolling(window=3, min_periods=1)
    .mean()
    .reset_index(level=0, drop=True)
)

station_hour["SameHourAvgDemand"] = (
    station_hour.groupby(["ChargerID", "hour"])["PreviousDemand"]
    .expanding()
    .mean()
    .reset_index(level=[0, 1], drop=True)
    .sort_index()
)

# Store valid historical records
history_df = station_hour.dropna(
    subset=[
        "PreviousSessions",
        "PreviousDemand",
        "HoursSincePrevious",
        "RecentAvgDemand",
        "SameHourAvgDemand"
    ]
).copy()


# Helper function to derive historical features for a ChargerID
def derive_historical_features(charger_id: int, hour: int, day_of_week: int, month: int, charger_type: int, charger_company: int):
    c_records = history_df[history_df["ChargerID"] == charger_id]
    if c_records.empty:
        return None

    # Check exact match for (month, day_of_week, hour)
    exact_match = c_records[
        (c_records["month"] == month) &
        (c_records["day_of_week"] == day_of_week) &
        (c_records["hour"] == hour)
    ]

    if not exact_match.empty:
        latest = exact_match.iloc[-1]
        same_hour_avg = latest["SameHourAvgDemand"]
    else:
        latest = c_records.iloc[-1]
        same_hour_records = c_records[c_records["hour"] == hour]
        if not same_hour_records.empty:
            same_hour_avg = same_hour_records.iloc[-1]["SameHourAvgDemand"]
        else:
            same_hour_avg = latest["SameHourAvgDemand"]

    return {
        "ChargerID": int(charger_id),
        "ChargerType": int(charger_type),
        "ChargerCompany": int(charger_company),
        "hour": int(hour),
        "day_of_week": int(day_of_week),
        "month": int(month),
        "PreviousDemand": float(latest["PreviousDemand"]),
        "PreviousSessions": float(latest["PreviousSessions"]),
        "HoursSincePrevious": float(latest["HoursSincePrevious"]),
        "RecentAvgDemand": float(latest["RecentAvgDemand"]),
        "SameHourAvgDemand": float(same_hour_avg)
    }


# ============================================================
# 2. FASTAPI APP & CORS CONFIGURATION
# ============================================================

app = FastAPI(
    title="VOLTIX SmartCharge ML API",
    description="User-facing Prediction API for EV Charging Station Demand",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 3. PYDANTIC REQUEST MODEL (USER-FACING CONTEXT ONLY)
# ============================================================

class PredictionInput(BaseModel):
    ChargerID: int = Field(..., description="ID of the charging station")
    ChargerType: int = Field(..., description="Type of charger")
    ChargerCompany: int = Field(..., description="Company ID operating the charger")
    hour: int = Field(..., ge=0, le=23, description="Hour of the day (0-23)")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of week (0=Monday, 6=Sunday)")
    month: int = Field(..., ge=1, le=12, description="Month of year (1-12)")


# ============================================================
# 4. GET ROOT ENDPOINT
# ============================================================

@app.get("/")
def read_root():
    return {"message": "VOLTIX SmartCharge ML API is running"}


# ============================================================
# 5. POST PREDICT ENDPOINT
# ============================================================

@app.post("/predict")
def predict(input_data: PredictionInput):
    # Derive historical features from ChargingRecords dataset
    features_dict = derive_historical_features(
        charger_id=input_data.ChargerID,
        hour=input_data.hour,
        day_of_week=input_data.day_of_week,
        month=input_data.month,
        charger_type=input_data.ChargerType,
        charger_company=input_data.ChargerCompany
    )

    if features_dict is None:
        raise HTTPException(
            status_code=404,
            detail=f"No historical records found for ChargerID {input_data.ChargerID}"
        )

    # Preserve exact feature order used during model training
    features_order = [
        "ChargerID",
        "ChargerType",
        "ChargerCompany",
        "hour",
        "day_of_week",
        "month",
        "PreviousDemand",
        "PreviousSessions",
        "HoursSincePrevious",
        "RecentAvgDemand",
        "SameHourAvgDemand"
    ]

    # Convert to DataFrame in exact feature order
    input_df = pd.DataFrame([features_dict])[features_order]

    # Generate prediction using pre-trained model
    prediction = model.predict(input_df)
    predicted_demand = float(prediction[0])

    return {"predictedDemand": round(predicted_demand, 2)}


# ============================================================
# 6. LOAD GENERALIZED DEMAND MODEL & NEW PREDICT-DEMAND ENDPOINT
# ============================================================

from historical_features import get_historical_features

demand_model = joblib.load("smartcharge_demand_model.pkl")


class DemandPredictionInput(BaseModel):
    Location: str = Field(..., min_length=1, description="Location category (e.g. public institution)")
    ChargerType: int = Field(..., ge=0, le=1, description="Charger type (0=Slow, 1=Fast)")
    target_datetime: str = Field(..., description="Target ISO datetime (e.g. 2022-08-01T07:00:00)")


@app.post("/predict-demand")
def predict_demand(input_data: DemandPredictionInput):
    # Parse target_datetime
    try:
        target_dt = pd.to_datetime(input_data.target_datetime)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid target_datetime format: {input_data.target_datetime}"
        )

    hour = int(target_dt.hour)
    day_of_week = int(target_dt.dayofweek)
    month = int(target_dt.month)

    # Derive leak-free historical demand features from historical_features layer
    hist_res = get_historical_features(
        location=input_data.Location,
        charger_type=input_data.ChargerType,
        target_datetime=target_dt
    )

    if not hist_res.get("available"):
        raise HTTPException(
            status_code=404,
            detail=hist_res.get("reason", "Insufficient historical data for this station context")
        )

    hist_features = hist_res["features"]

    # Exact 10-feature order expected by generalized demand model
    demand_features_dict = {
        "Location": input_data.Location,
        "ChargerType": input_data.ChargerType,
        "hour": hour,
        "day_of_week": day_of_week,
        "month": month,
        "PreviousDemand": hist_features["PreviousDemand"],
        "PreviousSessions": hist_features["PreviousSessions"],
        "HoursSincePrevious": hist_features["HoursSincePrevious"],
        "RecentAvgDemand": hist_features["RecentAvgDemand"],
        "SameHourAvgDemand": hist_features["SameHourAvgDemand"]
    }

    demand_features_order = [
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

    input_df = pd.DataFrame([demand_features_dict])[demand_features_order]

    # Generate prediction using pre-trained generalized model pipeline
    try:
        prediction = demand_model.predict(input_df)
        predicted_demand = float(prediction[0])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )

    return {
        "predictedDemand": round(predicted_demand, 2),
        "unit": "kWh",
        "location": input_data.Location,
        "chargerType": input_data.ChargerType,
        "targetDatetime": input_data.target_datetime
    }

