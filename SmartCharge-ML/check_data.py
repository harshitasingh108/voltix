import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ============================================================
# 1. LOAD DATA
# ============================================================

df = pd.read_csv("data/ChargingRecords.csv")

print("Original dataset shape:", df.shape)


# ============================================================
# 2. CONVERT DATETIME
# ============================================================

df["StartDatetime"] = pd.to_datetime(df["StartDatetime"])

df["date"] = df["StartDatetime"].dt.date
df["hour"] = df["StartDatetime"].dt.hour


# ============================================================
# 3. STATION-HOUR AGGREGATION
# ============================================================

station_hour = (
    df.groupby(["ChargerID", "ChargerCompany", "Location", "ChargerType", "date", "hour"])
      .agg(
          Sessions=("Demand", "count"),
          TotalDemand=("Demand", "sum"),
          AvgDemand=("Demand", "mean")
      )
      .reset_index()
)


# ============================================================
# 4. CREATE DATETIME
# ============================================================

station_hour["date"] = pd.to_datetime(station_hour["date"])

station_hour["datetime"] = (
    station_hour["date"]
    + pd.to_timedelta(station_hour["hour"], unit="h")
)


# ============================================================
# 5. TIME FEATURES
# ============================================================

station_hour["hour"] = station_hour["datetime"].dt.hour

station_hour["day_of_week"] = (
    station_hour["datetime"].dt.dayofweek
)

station_hour["month"] = (
    station_hour["datetime"].dt.month
)


# ============================================================
# 6. SORT BY CHARGER + TIME
# ============================================================

station_hour = station_hour.sort_values(
    ["ChargerID", "datetime"]
).reset_index(drop=True)


# ============================================================
# 7. HISTORICAL FEATURES
# ============================================================

# Previous observed session count
station_hour["PreviousSessions"] = (
    station_hour
    .groupby("ChargerID")["Sessions"]
    .shift(1)
)


# Previous observed total demand
station_hour["PreviousDemand"] = (
    station_hour
    .groupby("ChargerID")["TotalDemand"]
    .shift(1)
)


# Recent average demand (rolling average of past observed demand)
station_hour["RecentAvgDemand"] = (
    station_hour
    .groupby("ChargerID")["PreviousDemand"]
    .rolling(window=3, min_periods=1)
    .mean()
    .reset_index(level=0, drop=True)
)


# Same hour average demand (expanding average of past observed demand for same hour)
station_hour["SameHourAvgDemand"] = (
    station_hour
    .groupby(["ChargerID", "hour"])["PreviousDemand"]
    .expanding()
    .mean()
    .reset_index(level=[0, 1], drop=True)
    .sort_index()
)


# Previous observed datetime
station_hour["PreviousDatetime"] = (
    station_hour
    .groupby("ChargerID")["datetime"]
    .shift(1)
)


# ============================================================
# 8. TIME GAP
# ============================================================

station_hour["HoursSincePrevious"] = (
    (
        station_hour["datetime"]
        - station_hour["PreviousDatetime"]
    ).dt.total_seconds() / 3600
)


# ============================================================
# 9. REMOVE FIRST RECORD OF EACH CHARGER
# ============================================================

model_data = station_hour.dropna(
    subset=[
        "PreviousSessions",
        "PreviousDemand",
        "HoursSincePrevious",
        "RecentAvgDemand",
        "SameHourAvgDemand"
    ]
).copy()


# ============================================================
# 10. FEATURES
# ============================================================

features = [
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


X = model_data[features]

# Target
y = model_data["TotalDemand"]


# ============================================================
# 11. TIME-BASED TRAIN / TEST SPLIT
# ============================================================

# Sort entire dataset chronologically before splitting
model_data = model_data.sort_values(
    "datetime"
).reset_index(drop=True)

X = model_data[features]
y = model_data["TotalDemand"]

split_index = int(len(model_data) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print("\n============================================================")
print("TRAIN / TEST SPLIT")
print("============================================================")

print("Training records:", len(X_train))
print("Testing records:", len(X_test))


# ============================================================
# 12. BASELINE
# ============================================================

baseline_prediction = y_train.mean()

baseline_predictions = [
    baseline_prediction
] * len(y_test)


baseline_mae = mean_absolute_error(
    y_test,
    baseline_predictions
)


baseline_rmse = mean_squared_error(
    y_test,
    baseline_predictions
) ** 0.5


print("\n============================================================")
print("BASELINE MODEL")
print("============================================================")

print("Baseline prediction:", baseline_prediction)
print("Baseline MAE:", baseline_mae)
print("Baseline RMSE:", baseline_rmse)


# ============================================================
# 13. RANDOM FOREST MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=40,
    random_state=42,
    n_jobs=-1,
    max_depth=10
)


# ============================================================
# 14. TRAIN
# ============================================================

print("\n============================================================")
print("TRAINING RANDOM FOREST")
print("============================================================")

model.fit(X_train, y_train)

print("Training completed!")


# ============================================================
# SAVE AND TEST MODEL
# ============================================================

joblib.dump(model, "smartcharge_model.pkl", compress=3)
print("Model saved successfully: smartcharge_model.pkl")

loaded_model = joblib.load("smartcharge_model.pkl")
print("Saved model loaded successfully!")

loaded_predictions = loaded_model.predict(X_test)
print("Saved model prediction test passed!")


# ============================================================
# 15. PREDICTION
# ============================================================

predictions = model.predict(X_test)


# ============================================================
# 16. MODEL PERFORMANCE
# ============================================================

mae = mean_absolute_error(
    y_test,
    predictions
)


rmse = mean_squared_error(
    y_test,
    predictions
) ** 0.5


print("\n============================================================")
print("RANDOM FOREST PERFORMANCE")
print("============================================================")

print("MAE:", mae)
print("RMSE:", rmse)


# ============================================================
# 17. COMPARISON
# ============================================================

print("\n============================================================")
print("BASELINE VS RANDOM FOREST")
print("============================================================")

print(
    "Baseline MAE:",
    round(baseline_mae, 4)
)

print(
    "Random Forest MAE:",
    round(mae, 4)
)

print(
    "Baseline RMSE:",
    round(baseline_rmse, 4)
)

print(
    "Random Forest RMSE:",
    round(rmse, 4)
)


# ============================================================
# 18. SAMPLE PREDICTIONS
# ============================================================

results = model_data.iloc[
    split_index:
].copy()

results["PredictedDemand"] = predictions

print("\n============================================================")
print("SAMPLE PREDICTIONS")
print("============================================================")

print(
    results[
        [
            "ChargerID",
            "datetime",
            "hour",
            "day_of_week",
            "TotalDemand",
            "PreviousSessions",
            "PreviousDemand",
            "HoursSincePrevious",
            "RecentAvgDemand",
            "SameHourAvgDemand",
            "PredictedDemand"
        ]
    ].head(20).to_string(index=False)
)


# ============================================================
# 19. FEATURE IMPORTANCE
# ============================================================

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    "Importance",
    ascending=False
)


print("\n============================================================")
print("FEATURE IMPORTANCE")
print("============================================================")

print(
    importance.to_string(index=False)
)