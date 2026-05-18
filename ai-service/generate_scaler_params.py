"""
generate_scaler_params.py
─────────────────────────
Run once to extract scaler parameters from the existing sklearn Pipeline pkl
files and save them into model/scaler_params.json.

NO training happens here — we are only reading parameters that were already
fitted and stored inside the pkl files.

Usage:
    python generate_scaler_params.py
"""
import os, json, joblib, numpy as np

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

REG_PKL = os.path.join(MODEL_DIR, "bizsim_model_sklearn.pkl")
CLS_PKL = os.path.join(MODEL_DIR, "bizsim_classifier_sklearn.pkl")
OUT     = os.path.join(MODEL_DIR, "scaler_params.json")

params = {}

# ── Regression scaler (MinMaxScaler) ──────────────────────────────────────────
print("Loading regression pipeline…")
reg = joblib.load(REG_PKL)
mm_scaler = reg.named_steps["scaler"]  # MinMaxScaler
params["regression"] = {
    "scaler_type":      "minmax",
    "data_min":         mm_scaler.data_min_.tolist(),
    "data_max":         mm_scaler.data_max_.tolist(),
    "scale_":           mm_scaler.scale_.tolist(),
    "min_":             mm_scaler.min_.tolist(),
    "feature_range":    list(mm_scaler.feature_range),
    # Keras model output is in [0,1]; multiply by this to get months
    "output_multiplier": 36
}
print(f"  data_min  : {params['regression']['data_min']}")
print(f"  data_max  : {params['regression']['data_max']}")

# ── Classifier scaler (StandardScaler) ────────────────────────────────────────
print("Loading classifier pipeline…")
cls_data = joblib.load(CLS_PKL)
cls_pipeline, cls_names = cls_data
std_scaler = cls_pipeline.named_steps["scaler"]  # StandardScaler
params["classification"] = {
    "scaler_type": "standard",
    "mean":        std_scaler.mean_.tolist(),
    "scale":       std_scaler.scale_.tolist(),
    "var":         std_scaler.var_.tolist(),
    "classes":     cls_names
}
print(f"  mean  : {params['classification']['mean']}")
print(f"  scale : {params['classification']['scale']}")
print(f"  classes: {cls_names}")

# ── Save ──────────────────────────────────────────────────────────────────────
with open(OUT, "w") as f:
    json.dump(params, f, indent=2)

print(f"\n[OK] scaler_params.json saved to: {OUT}")
