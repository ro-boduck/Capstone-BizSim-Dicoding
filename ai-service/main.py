"""
BizSim — FastAPI AI Inference Service (Keras Primary)
──────────────────────────────────────────────────────
Primary  : TensorFlow Keras models (bizsim_model.keras + bizsim_classifier.keras)
           Inputs scaled using scaler_params.json extracted from fitted sklearn scalers.
Fallback : sklearn RandomForest Pipelines (pkl files)
Safety   : Pure heuristic financial calculation
"""

import os
import json
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(title="BizSim AI Service", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Paths ────────────────────────────────────────────────────────────────────
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

SCALER_JSON  = os.path.join(MODEL_DIR, "scaler_params.json")
REG_KERAS    = os.path.join(MODEL_DIR, "bizsim_model.keras")
CLS_KERAS    = os.path.join(MODEL_DIR, "bizsim_classifier.keras")
REG_PKL      = os.path.join(MODEL_DIR, "bizsim_model_sklearn.pkl")
CLS_PKL      = os.path.join(MODEL_DIR, "bizsim_classifier_sklearn.pkl")

# ─── Global State ─────────────────────────────────────────────────────────────
keras_reg   = None
keras_cls   = None
skl_reg     = None
skl_cls     = None
skl_names   = ["Critical", "Elite", "Growth", "Struggling"]
scaler_cfg  = {}         # loaded from scaler_params.json
MODE        = "heuristic"

# ─── Startup ──────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def load_models():
    global keras_reg, keras_cls, skl_reg, skl_cls, skl_names, scaler_cfg, MODE

    # 1. Load scaler parameters (always needed for Keras)
    try:
        with open(SCALER_JSON) as f:
            scaler_cfg = json.load(f)
        print("[OK] scaler_params.json loaded")
    except Exception as e:
        print(f"[WARN] Could not load scaler_params.json: {e}")

    # 2. Try TensorFlow Keras (primary)
    keras_ok = False
    try:
        import tensorflow as tf
        print(f"[INFO] TensorFlow {tf.__version__} detected")

        try:
            keras_reg = tf.keras.models.load_model(REG_KERAS)
            print("[OK] Keras regression model loaded")
        except Exception as e:
            print(f"[WARN] Keras regression load failed: {e}")

        try:
            keras_cls = tf.keras.models.load_model(CLS_KERAS)
            print("[OK] Keras classifier model loaded")
            keras_ok = True
        except Exception as e:
            print(f"[WARN] Keras classifier load failed: {e}")

    except ImportError:
        print("[INFO] TensorFlow not installed — using sklearn fallback")

    if keras_reg is not None and keras_cls is not None:
        MODE = "keras"
        print("[INFO] Running in KERAS mode ✓")
        return

    # 3. Fallback: sklearn Pipelines
    skl_ok = False
    try:
        skl_reg = joblib.load(REG_PKL)
        print("[OK] sklearn regression pipeline loaded")
    except Exception as e:
        print(f"[WARN] sklearn regression load failed: {e}")

    try:
        cls_data = joblib.load(CLS_PKL)
        if isinstance(cls_data, tuple):
            skl_cls, skl_names = cls_data
        else:
            skl_cls = cls_data
        print(f"[OK] sklearn classifier pipeline loaded | classes: {skl_names}")
        skl_ok = True
    except Exception as e:
        print(f"[WARN] sklearn classifier load failed: {e}")

    if skl_reg is not None or skl_ok:
        MODE = "sklearn"
        print("[INFO] Running in SKLEARN fallback mode")
        return

    print("[WARN] No AI models loaded — pure heuristic mode")
    MODE = "heuristic"


# ─── Schemas ──────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    modal_awal:             float
    biaya_tetap_bulanan:    float
    biaya_variabel_bulanan: float
    pendapatan_bulanan:     float
    # Classifier context (optional — sensible defaults for UMKM)
    transaction_count:      float = 150.0
    business_tenure_months: float = 24.0
    digital_adoption_score: float = 3.5
    location:               str   = "Med"   # "Low" | "Med" | "High"
    repeat_order_rate:      float = 20.0
    avg_rating:             float = 4.3
    review_volatility:      float = 0.35
    sentiment_score:        float = 0.0


class PredictResponse(BaseModel):
    predicted_runway_months: int
    burn_rate_monthly:       float
    business_class:          str
    class_probabilities:     dict
    confidence_note:         str
    model_mode:              str


# ─── Prediction Endpoint ──────────────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    burn_rate = (
        req.biaya_tetap_bulanan
        + req.biaya_variabel_bulanan
        - req.pendapatan_bulanan
    )

    months  = _predict_runway(req, burn_rate)
    b_class, probs = _predict_class(req, months, burn_rate)

    notes = {
        "keras":     "Prediksi menggunakan TensorFlow Keras Neural Network — dilatih pada 150.000 data UMKM.",
        "sklearn":   "Prediksi menggunakan Random Forest Pipeline (scikit-learn) — dilatih pada 150.000 data UMKM.",
        "heuristic": "⚠ Model AI tidak tersedia — hasil estimasi heuristik finansial.",
    }

    return PredictResponse(
        predicted_runway_months=months,
        burn_rate_monthly=round(burn_rate, 2),
        business_class=b_class,
        class_probabilities=probs,
        confidence_note=notes.get(MODE, ""),
        model_mode=MODE,
    )


# ─── Regression ───────────────────────────────────────────────────────────────
def _predict_runway(req: PredictRequest, burn_rate: float) -> int:
    """Predict cash runway in months."""

    # Financial heuristic baseline (used as override for cashflow-positive cases)
    if burn_rate > 0 and req.modal_awal > 0:
        heuristic = max(0, min(int(req.modal_awal / burn_rate), 60))
    else:
        heuristic = 60  # cashflow positive → no burndown

    # ── Keras primary ───────────────────────────────────────────────────────
    if MODE == "keras" and keras_reg is not None and scaler_cfg.get("regression"):
        try:
            cfg      = scaler_cfg["regression"]
            data_min = np.array(cfg["data_min"], dtype=np.float64)
            data_max = np.array(cfg["data_max"], dtype=np.float64)
            out_mult = float(cfg.get("output_multiplier", 36))

            X_raw = np.array([[
                req.modal_awal,
                req.biaya_tetap_bulanan,
                req.biaya_variabel_bulanan,
                req.pendapatan_bulanan,
            ]], dtype=np.float64)

            # MinMaxScaler: X_scaled = (X - min) / (max - min)
            X_scaled = (X_raw - data_min) / (data_max - data_min + 1e-9)
            X_scaled = np.clip(X_scaled, 0.0, 1.0).astype(np.float32)

            y_norm = float(keras_reg.predict(X_scaled, verbose=0)[0][0])
            y_norm = float(np.clip(y_norm, 0.0, 1.0))
            months = int(round(y_norm * out_mult))

            # If cashflow is positive and model returns max, trust heuristic
            if burn_rate <= 0 and months >= out_mult:
                return heuristic
            return max(0, min(months, 60))

        except Exception as e:
            print(f"[WARN] Keras regression predict failed: {e}")

    # ── sklearn fallback ────────────────────────────────────────────────────
    if skl_reg is not None:
        try:
            X = np.array([[
                req.modal_awal,
                req.biaya_tetap_bulanan,
                req.biaya_variabel_bulanan,
                req.pendapatan_bulanan,
            ]], dtype=np.float64)
            pred   = float(skl_reg.predict(X)[0])
            months = max(0, min(int(round(pred)), 60))
            if burn_rate <= 0 and months >= 36:
                return heuristic
            return months
        except Exception as e:
            print(f"[WARN] sklearn regression predict failed: {e}")

    return heuristic


# ─── Classification ───────────────────────────────────────────────────────────

# Location_Competitiveness encoding: use median numeric values from training data
LOCATION_ENCODE = {"Low": 7, "Med": 9, "High": 12}

def _build_cls_features(req: PredictRequest, burn_rate: float) -> np.ndarray:
    """Build the 11 numeric classifier features from user inputs."""
    revenue = req.pendapatan_bulanan
    profit_margin = (
        (revenue - req.biaya_tetap_bulanan - req.biaya_variabel_bulanan) / revenue * 100
        if revenue > 0 else -100.0
    )
    burn_ratio = (
        (req.biaya_tetap_bulanan + req.biaya_variabel_bulanan) / revenue
        if revenue > 0 else 2.0
    )
    loc_num = float(LOCATION_ENCODE.get(req.location, 9))

    return np.array([[
        revenue,                     # Monthly_Revenue
        profit_margin,               # Net_Profit_Margin (%)
        burn_ratio,                  # Burn_Rate_Ratio
        req.transaction_count,       # Transaction_Count
        req.avg_rating,              # Avg_Historical_Rating
        req.review_volatility,       # Review_Volatility
        req.business_tenure_months,  # Business_Tenure_Months
        req.repeat_order_rate,       # Repeat_Order_Rate (%)
        req.digital_adoption_score,  # Digital_Adoption_Score
        loc_num,                     # Location_Competitiveness
        req.sentiment_score,         # Sentiment_Score
    ]], dtype=np.float64)


def _predict_class(req: PredictRequest, months: int, burn_rate: float):
    """Predict business class and probability distribution."""
    X_raw = _build_cls_features(req, burn_rate)

    # ── Keras primary ───────────────────────────────────────────────────────
    if MODE == "keras" and keras_cls is not None and scaler_cfg.get("classification"):
        try:
            cfg   = scaler_cfg["classification"]
            mean  = np.array(cfg["mean"],  dtype=np.float64)
            scale = np.array(cfg["scale"], dtype=np.float64)
            names = cfg.get("classes", skl_names)

            # StandardScaler: X_scaled = (X - mean) / scale
            X_scaled = ((X_raw - mean) / (scale + 1e-9)).astype(np.float32)

            proba   = keras_cls.predict(X_scaled, verbose=0)[0]
            idx     = int(np.argmax(proba))
            b_class = names[idx]
            probs   = {names[i]: round(float(proba[i]), 4) for i in range(len(names))}
            return b_class, probs

        except Exception as e:
            print(f"[WARN] Keras classifier predict failed: {e}")

    # ── sklearn fallback ────────────────────────────────────────────────────
    if skl_cls is not None:
        try:
            raw_pred = skl_cls.predict(X_raw)[0]
            proba    = skl_cls.predict_proba(X_raw)[0]
            # RF returns string labels when trained on strings; int index otherwise
            if isinstance(raw_pred, (int, np.integer)):
                b_class = skl_names[int(raw_pred)] if int(raw_pred) < len(skl_names) else "Unknown"
            else:
                b_class = str(raw_pred)
            probs = {skl_names[i]: round(float(proba[i]), 4) for i in range(len(skl_names))}
            return b_class, probs
        except Exception as e:
            print(f"[WARN] sklearn classifier predict failed: {e}")

    return _heuristic_class(months)


def _heuristic_class(months: int):
    if months <= 3:
        return "Critical",  {"Critical": 0.92, "Struggling": 0.07, "Growth": 0.01, "Elite": 0.00}
    if months <= 12:
        return "Struggling", {"Critical": 0.12, "Struggling": 0.78, "Growth": 0.09, "Elite": 0.01}
    if months <= 24:
        return "Growth",    {"Critical": 0.01, "Struggling": 0.14, "Growth": 0.81, "Elite": 0.04}
    return     "Elite",     {"Critical": 0.00, "Struggling": 0.01, "Growth": 0.09, "Elite": 0.90}


# ─── Health Endpoint ──────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":             "ok",
        "mode":               MODE,
        "keras_reg_loaded":   keras_reg is not None,
        "keras_cls_loaded":   keras_cls is not None,
        "sklearn_reg_loaded": skl_reg is not None,
        "sklearn_cls_loaded": skl_cls is not None,
        "scaler_loaded":      bool(scaler_cfg),
    }


# ─── Local dev runner ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
