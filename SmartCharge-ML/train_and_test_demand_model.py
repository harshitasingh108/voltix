import joblib
import pandas as pd
import numpy as np

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


# ============================================================
# 1. LOAD DATA
# ============================================================
print("============================================================")
print("1. LOADING & INSPECTING DATASET")
print("============================================================")

df = pd.read_csv("data/ChargingRecords.csv")
print("Raw records count:", len(df))

# ============================================================
# 2. CONVERT DATETIME & AGGREGATE
# ============================================================
df["StartDatetime"] = pd.to_datetime(df["StartDatetime"])
df["date"] = df["StartDatetime"].dt.date
df["hour"] = df["StartDatetime"].dt.hour

# Station-level general aggregation (by Location and ChargerType)
# ChargerID and ChargerCompany are REMOVED from the aggregation key and features
station_hour = (
    df.groupby(["Location", "ChargerType", "date", "hour"])
      .agg(
          Sessions=("Demand", "count"),
          TotalDemand=("Demand", "sum"),
          AvgDemand=("Demand", "mean")
      )
      .reset_index()
)

station_hour["date"] = pd.to_datetime(station_hour["date"])
station_hour["datetime"] = (
    station_hour["date"] + pd.to_timedelta(station_hour["hour"], unit="h")
)

# Extract general temporal features
station_hour["hour"] = station_hour["datetime"].dt.hour
station_hour["day_of_week"] = station_hour["datetime"].dt.dayofweek
station_hour["month"] = station_hour["datetime"].dt.month

# Sort chronologically by (Location, ChargerType, datetime) for feature generation
station_hour = station_hour.sort_values(["Location", "ChargerType", "datetime"]).reset_index(drop=True)


# ============================================================
# 3. LEAK-FREE HISTORICAL FEATURE GENERATION
# ============================================================
print("\n============================================================")
print("2. COMPUTING LEAK-FREE HISTORICAL FEATURES")
print("============================================================")

# Group by general station features (Location + ChargerType)
grp = station_hour.groupby(["Location", "ChargerType"])

# Previous observed session count (shifted by 1)
station_hour["PreviousSessions"] = grp["Sessions"].shift(1)

# Previous observed total demand (shifted by 1)
station_hour["PreviousDemand"] = grp["TotalDemand"].shift(1)

# Previous observed datetime (shifted by 1)
station_hour["PreviousDatetime"] = grp["datetime"].shift(1)

# Hours gap since previous record
station_hour["HoursSincePrevious"] = (
    (station_hour["datetime"] - station_hour["PreviousDatetime"]).dt.total_seconds() / 3600
)

# Recent average demand (3-period rolling mean of PreviousDemand)
station_hour["RecentAvgDemand"] = (
    grp["PreviousDemand"]
    .rolling(window=3, min_periods=1)
    .mean()
    .reset_index(level=[0, 1], drop=True)
    .sort_index()
)

# Same hour average demand (expanding mean of PreviousDemand for same hour)
station_hour["SameHourAvgDemand"] = (
    station_hour.groupby(["Location", "ChargerType", "hour"])["PreviousDemand"]
    .expanding()
    .mean()
    .reset_index(level=[0, 1, 2], drop=True)
    .sort_index()
)

# Drop rows with NaN in historical features (first record of each group)
model_data = station_hour.dropna(
    subset=[
        "PreviousSessions",
        "PreviousDemand",
        "HoursSincePrevious",
        "RecentAvgDemand",
        "SameHourAvgDemand"
    ]
).copy()

# Ensure dataset is sorted strictly chronologically before train/test split
model_data = model_data.sort_values("datetime").reset_index(drop=True)

print("Records after removing initial lag NaNs:", len(model_data))


# ============================================================
# 4. DEFINE FEATURES & TARGET
# ============================================================
categorical_features = ["Location", "ChargerType"]
numerical_features = [
    "hour",
    "day_of_week",
    "month",
    "PreviousDemand",
    "PreviousSessions",
    "HoursSincePrevious",
    "RecentAvgDemand",
    "SameHourAvgDemand"
]

feature_cols = categorical_features + numerical_features
target_col = "TotalDemand"

X = model_data[feature_cols]
y = model_data[target_col]

print("\nFeatures used:", feature_cols)
print("Removed dataset-specific IDs: ChargerID, ChargerCompany")
print("Target column:", target_col)


# ============================================================
# 5. CHRONOLOGICAL TRAIN / TEST SPLIT (NO RANDOM SHUFFLE)
# ============================================================
split_index = int(len(model_data) * 0.8)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 6. BASELINE MODEL EVALUATION
# ============================================================
baseline_pred = y_train.mean()
baseline_preds = np.full_like(y_test, fill_value=baseline_pred, dtype=float)

baseline_mae = mean_absolute_error(y_test, baseline_preds)
baseline_rmse = np.sqrt(mean_squared_error(y_test, baseline_preds))

print("\n============================================================")
print("3. BASELINE EVALUATION (MEAN PREDICTION)")
print("============================================================")
print("Baseline Mean Prediction:", round(baseline_pred, 4))
print("Baseline MAE:", round(baseline_mae, 4))
print("Baseline RMSE:", round(baseline_rmse, 4))


# ============================================================
# 7. BUILD PIPELINE WITH ONE-HOT ENCODING & RANDOM FOREST
# ============================================================
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features),
        ("num", "passthrough", numerical_features)
    ]
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        random_state=42,
        n_jobs=-1
    ))
])

print("\n============================================================")
print("4. TRAINING RANDOM FOREST PIPELINE")
print("============================================================")

pipeline.fit(X_train, y_train)
print("Pipeline training completed successfully!")


# ============================================================
# 8. EVALUATE RANDOM FOREST PIPELINE
# ============================================================
rf_preds = pipeline.predict(X_test)

rf_mae = mean_absolute_error(y_test, rf_preds)
rf_rmse = np.sqrt(mean_squared_error(y_test, rf_preds))

print("\n============================================================")
print("5. RANDOM FOREST EVALUATION RESULTS")
print("============================================================")
print("Random Forest MAE:", round(rf_mae, 4))
print("Random Forest RMSE:", round(rf_rmse, 4))

print("\n--- COMPARISON ---")
print(f"Baseline MAE:      {baseline_mae:.4f}  -->  RF MAE:      {rf_mae:.4f}  (Improvement: {((baseline_mae - rf_mae) / baseline_mae) * 100:.2f}%)")
print(f"Baseline RMSE:     {baseline_rmse:.4f}  -->  RF RMSE:     {rf_rmse:.4f}  (Improvement: {((baseline_rmse - rf_rmse) / baseline_rmse) * 100:.2f}%)")


# ============================================================
# 9. SAVE NEW MODEL PIPELINE
# ============================================================
model_filename = "smartcharge_demand_model.pkl"
joblib.dump(pipeline, model_filename)
print(f"\nSaved new model pipeline to: {model_filename}")


# ============================================================
# 10. VERIFY MODEL LOADING AND TEST INFERENCE
# ============================================================
print("\n============================================================")
print("6. VERIFYING SAVED MODEL & INFERENCE")
print("============================================================")

loaded_pipeline = joblib.load(model_filename)
print("Saved pipeline loaded successfully!")

# Pick a test sample row
sample_input = X_test.iloc[[0]]
sample_actual = y_test.iloc[0]
sample_pred = loaded_pipeline.predict(sample_input)[0]

print("\nTest Sample Input (Raw Dataframe before pipeline transform):")
print(sample_input.to_dict(orient="records")[0])
print(f"\nActual Total Demand:    {sample_actual:.2f} kWh")
print(f"Predicted Total Demand: {sample_pred:.2f} kWh")
print("\nModel verification test PASSED!")
