import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "data", "ChargingRecords.csv")

_station_hour = None

def _init_station_hour():
    global _station_hour
    if _station_hour is not None:
        return _station_hour

    usecols = ["Location", "ChargerType", "StartDatetime", "Demand"]
    df = pd.read_csv(csv_path, usecols=usecols)
    df["StartDatetime"] = pd.to_datetime(df["StartDatetime"])
    df["date"] = df["StartDatetime"].dt.date
    df["hour"] = df["StartDatetime"].dt.hour.astype(np.int8)

    _station_hour = (
        df.groupby(["Location", "ChargerType", "date", "hour"], as_index=False)
          .agg(
              Sessions=("Demand", "count"),
              TotalDemand=("Demand", "sum"),
              AvgDemand=("Demand", "mean")
          )
    )

    _station_hour["date"] = pd.to_datetime(_station_hour["date"])
    _station_hour["datetime"] = (
        _station_hour["date"] + pd.to_timedelta(_station_hour["hour"], unit="h")
    )
    _station_hour["hour"] = _station_hour["datetime"].dt.hour.astype(np.int8)
    _station_hour["day_of_week"] = _station_hour["datetime"].dt.dayofweek.astype(np.int8)
    _station_hour["month"] = _station_hour["datetime"].dt.month.astype(np.int8)

    _station_hour = _station_hour.sort_values(["Location", "ChargerType", "datetime"]).reset_index(drop=True)
    return _station_hour


def get_historical_features(location: str, charger_type: int, target_datetime):
    """
    Retrieves leak-free historical demand features for a given Location, ChargerType,
    and target_datetime strictly from past observations before target_datetime.
    """
    station_hour_df = _init_station_hour()
    target_dt = pd.to_datetime(target_datetime)
    if hasattr(target_dt, "tzinfo") and target_dt.tzinfo is not None:
        target_dt = target_dt.tz_localize(None)

    past_records = station_hour_df[
        (station_hour_df["Location"] == location) &
        (station_hour_df["ChargerType"] == charger_type) &
        (station_hour_df["datetime"] < target_dt)
    ].sort_values("datetime")

    if past_records.empty:
        return {
            "available": False,
            "reason": f"No historical records found for Location='{location}' and ChargerType={charger_type} prior to {target_dt}"
        }

    latest = past_records.iloc[-1]

    previous_demand = float(latest["TotalDemand"])
    previous_sessions = float(latest["Sessions"])
    previous_datetime = latest["datetime"]
    hours_since_previous = float((target_dt - previous_datetime).total_seconds() / 3600.0)

    recent_records = past_records.tail(3)
    recent_avg_demand = float(recent_records["TotalDemand"].mean())

    target_hour = target_dt.hour
    same_hour_past = past_records[past_records["hour"] == target_hour]

    if not same_hour_past.empty:
        same_hour_avg_demand = float(same_hour_past["TotalDemand"].mean())
    else:
        same_hour_avg_demand = recent_avg_demand

    return {
        "available": True,
        "features": {
            "PreviousDemand": previous_demand,
            "PreviousSessions": previous_sessions,
            "HoursSincePrevious": hours_since_previous,
            "RecentAvgDemand": recent_avg_demand,
            "SameHourAvgDemand": same_hour_avg_demand
        }
    }
