import pandas as pd
import numpy as np

# Pre-load raw dataset and compute station-hour aggregation by Location & ChargerType
_raw_df = pd.read_csv("data/ChargingRecords.csv")
_raw_df["StartDatetime"] = pd.to_datetime(_raw_df["StartDatetime"])
_raw_df["date"] = _raw_df["StartDatetime"].dt.date
_raw_df["hour"] = _raw_df["StartDatetime"].dt.hour

# Station-hour aggregation
_station_hour = (
    _raw_df.groupby(["Location", "ChargerType", "date", "hour"])
           .agg(
               Sessions=("Demand", "count"),
               TotalDemand=("Demand", "sum"),
               AvgDemand=("Demand", "mean")
           )
           .reset_index()
)

_station_hour["date"] = pd.to_datetime(_station_hour["date"])
_station_hour["datetime"] = (
    _station_hour["date"] + pd.to_timedelta(_station_hour["hour"], unit="h")
)
_station_hour["hour"] = _station_hour["datetime"].dt.hour
_station_hour["day_of_week"] = _station_hour["datetime"].dt.dayofweek
_station_hour["month"] = _station_hour["datetime"].dt.month

_station_hour = _station_hour.sort_values(["Location", "ChargerType", "datetime"]).reset_index(drop=True)


def get_historical_features(location: str, charger_type: int, target_datetime):
    """
    Retrieves leak-free historical demand features for a given Location, ChargerType,
    and target_datetime strictly from past observations before target_datetime.
    """
    target_dt = pd.to_datetime(target_datetime)
    if hasattr(target_dt, "tzinfo") and target_dt.tzinfo is not None:
        target_dt = target_dt.tz_localize(None)

    # Filter strictly for past records before target_dt matching Location and ChargerType
    past_records = _station_hour[
        (_station_hour["Location"] == location) &
        (_station_hour["ChargerType"] == charger_type) &
        (_station_hour["datetime"] < target_dt)
    ].sort_values("datetime")

    if past_records.empty:
        return {
            "available": False,
            "reason": f"No historical records found for Location='{location}' and ChargerType={charger_type} prior to {target_dt}"
        }

    # Latest past record
    latest = past_records.iloc[-1]

    previous_demand = float(latest["TotalDemand"])
    previous_sessions = float(latest["Sessions"])
    previous_datetime = latest["datetime"]
    hours_since_previous = float((target_dt - previous_datetime).total_seconds() / 3600.0)

    # Recent average demand (3-observation rolling mean of TotalDemand from past records)
    recent_records = past_records.tail(3)
    recent_avg_demand = float(recent_records["TotalDemand"].mean())

    # Same hour average demand (mean of TotalDemand for past records matching target hour)
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
