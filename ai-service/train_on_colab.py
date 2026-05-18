# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  BizSim — Google Colab Training Script                                  ║
# ║  Run this entirely on Google Colab (free T4 GPU).                       ║
# ║                                                                          ║
# ║  At the end it downloads:                                                ║
# ║    • bizsim_model.keras          (Keras regression model)               ║
# ║    • bizsim_classifier.keras     (Keras classification model)           ║
# ║    • scaler_params.json          (scaler min/max/mean/std)              ║
# ║                                                                          ║
# ║  Place all 3 files in:  ai-service/model/                               ║
# ╚══════════════════════════════════════════════════════════════════════════╝

# ── Cell 1: Install & Imports ─────────────────────────────────────────────────
# !pip install -q tensorflow pandas scikit-learn

import json
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder
from sklearn.metrics import mean_absolute_error, accuracy_score
from google.colab import files

print(f"TensorFlow {tf.__version__}")

# ── Cell 2: Upload datasets ───────────────────────────────────────────────────
# Upload both CSV files when prompted:
#   1. umkm_dataset.csv          (for regression — 5 columns)
#   2. synthetic_umkm_data.csv   (for classification — 15 columns)

uploaded = files.upload()

# ── Cell 3: Load datasets ─────────────────────────────────────────────────────
# Regression dataset: modal_awal, biaya_tetap_bulanan, biaya_variabel_bulanan,
#                     pendapatan_bulanan → bulan_ketahanan
df_reg = pd.read_csv("umkm_dataset.csv")
print("Regression dataset shape:", df_reg.shape)
print(df_reg.head(3))

# Classification dataset
df_cls = pd.read_csv("synthetic_umkm_data.csv")
print("\nClassification dataset shape:", df_cls.shape)
print(df_cls.head(3))

# ── Cell 4: Prepare Regression Data ───────────────────────────────────────────
REG_FEATURES = ["modal_awal", "biaya_tetap_bulanan", "biaya_variabel_bulanan", "pendapatan_bulanan"]
REG_TARGET   = "bulan_ketahanan"

X_reg = df_reg[REG_FEATURES].values.astype(np.float64)
y_reg = df_reg[REG_TARGET].values.astype(np.float64)

# Scale features with MinMaxScaler
reg_scaler = MinMaxScaler()
X_reg_sc = reg_scaler.fit_transform(X_reg)

# Normalize target to [0, 1] with max = 36 months
OUTPUT_MAX_MONTHS = 36.0
y_reg_norm = np.clip(y_reg / OUTPUT_MAX_MONTHS, 0.0, 1.0)

X_tr_r, X_val_r, y_tr_r, y_val_r = train_test_split(X_reg_sc, y_reg_norm, test_size=0.15, random_state=42)
print(f"Regression train: {X_tr_r.shape}, val: {X_val_r.shape}")

# ── Cell 5: Build & Train Regression Model ────────────────────────────────────
tf.random.set_seed(42)

reg_model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(4,)),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.15),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(1, activation="sigmoid"),   # output in [0,1]
], name="bizsim_regression")

reg_model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="mse",
    metrics=["mae"]
)
reg_model.summary()

callbacks_reg = [
    tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True, monitor="val_mae"),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5, verbose=1),
]

history_reg = reg_model.fit(
    X_tr_r, y_tr_r,
    validation_data=(X_val_r, y_val_r),
    epochs=100,
    batch_size=256,
    callbacks=callbacks_reg,
    verbose=1,
)

# Evaluate
y_pred_norm = reg_model.predict(X_val_r).flatten()
y_pred_months = np.clip(np.round(y_pred_norm * OUTPUT_MAX_MONTHS), 0, OUTPUT_MAX_MONTHS)
y_val_months  = np.clip(np.round(y_val_r * OUTPUT_MAX_MONTHS), 0, OUTPUT_MAX_MONTHS)
mae_months = mean_absolute_error(y_val_months, y_pred_months)
print(f"\n✅ Regression MAE: {mae_months:.2f} months")

# ── Cell 6: Prepare Classification Data ───────────────────────────────────────
CLS_FEATURES = [
    "Monthly_Revenue", "Net_Profit_Margin (%)", "Burn_Rate_Ratio",
    "Transaction_Count", "Avg_Historical_Rating", "Review_Volatility",
    "Business_Tenure_Months", "Repeat_Order_Rate (%)",
    "Digital_Adoption_Score", "Location_Competitiveness", "Sentiment_Score",
]
CLS_TARGET = "Class"

df_cls = df_cls.dropna(subset=CLS_FEATURES + [CLS_TARGET])
df_cls[CLS_FEATURES] = df_cls[CLS_FEATURES].fillna(0)

# Encode Location_Competitiveness (Low/Med/High → numeric)
loc_map = {"Low": 0, "Med": 1, "High": 2}
df_cls["Location_Competitiveness"] = df_cls["Location_Competitiveness"].map(loc_map).fillna(1)

X_cls = df_cls[CLS_FEATURES].values.astype(np.float64)
y_cls_raw = df_cls[CLS_TARGET].values

# Encode class labels
le = LabelEncoder()
y_cls = le.fit_transform(y_cls_raw)
CLASS_NAMES = list(le.classes_)
N_CLASSES   = len(CLASS_NAMES)
print(f"Classes: {CLASS_NAMES}")

# Scale features with StandardScaler
cls_scaler = StandardScaler()
X_cls_sc = cls_scaler.fit_transform(X_cls)
y_cls_oh  = tf.keras.utils.to_categorical(y_cls, N_CLASSES)

X_tr_c, X_val_c, y_tr_c, y_val_c = train_test_split(X_cls_sc, y_cls_oh, test_size=0.15, random_state=42, stratify=y_cls)
print(f"Classification train: {X_tr_c.shape}, val: {X_val_c.shape}")

# ── Cell 7: Build & Train Classification Model ────────────────────────────────
tf.random.set_seed(42)

cls_model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(11,)),
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.25),
    tf.keras.layers.Dense(64, activation="relu"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dropout(0.15),
    tf.keras.layers.Dense(32, activation="relu"),
    tf.keras.layers.Dense(N_CLASSES, activation="softmax"),
], name="bizsim_classifier")

cls_model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)
cls_model.summary()

callbacks_cls = [
    tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True, monitor="val_accuracy"),
    tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5, verbose=1),
]

history_cls = cls_model.fit(
    X_tr_c, y_tr_c,
    validation_data=(X_val_c, y_val_c),
    epochs=100,
    batch_size=256,
    callbacks=callbacks_cls,
    verbose=1,
)

# Evaluate
y_pred_cls = np.argmax(cls_model.predict(X_val_c), axis=1)
y_true_cls = np.argmax(y_val_c, axis=1)
acc = accuracy_score(y_true_cls, y_pred_cls)
print(f"\n✅ Classifier Accuracy: {acc:.4f} ({acc*100:.2f}%)")
print(f"Classes: {CLASS_NAMES}")

# ── Cell 8: Save Models & Scaler Params ───────────────────────────────────────
# Save Keras models
reg_model.save("bizsim_model.keras")
cls_model.save("bizsim_classifier.keras")
print("[OK] Keras models saved")

# Save scaler parameters to JSON (this is what FastAPI needs)
scaler_params = {
    "regression": {
        "scaler_type":       "minmax",
        "data_min":          reg_scaler.data_min_.tolist(),
        "data_max":          reg_scaler.data_max_.tolist(),
        "scale_":            reg_scaler.scale_.tolist(),
        "min_":              reg_scaler.min_.tolist(),
        "feature_range":     list(reg_scaler.feature_range),
        "output_multiplier": OUTPUT_MAX_MONTHS,
        "features":          REG_FEATURES,
    },
    "classification": {
        "scaler_type": "standard",
        "mean":        cls_scaler.mean_.tolist(),
        "scale":       cls_scaler.scale_.tolist(),
        "var":         cls_scaler.var_.tolist(),
        "classes":     CLASS_NAMES,
        "features":    CLS_FEATURES,
        "loc_map":     loc_map,
    }
}

with open("scaler_params.json", "w") as f:
    json.dump(scaler_params, f, indent=2)
print("[OK] scaler_params.json saved")

# ── Cell 9: Download Files ─────────────────────────────────────────────────────
# This will trigger browser downloads for all 3 files.
# Place them in:  BizSim/ai-service/model/
files.download("bizsim_model.keras")
files.download("bizsim_classifier.keras")
files.download("scaler_params.json")

print("\n✅ Done! Place the 3 downloaded files in ai-service/model/")
print("   Then restart the FastAPI server.")
