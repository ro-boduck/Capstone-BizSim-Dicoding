"""Check classifier feature count and test with proper input."""
import sys, os, joblib, numpy as np
sys.path.insert(0, os.path.dirname(__file__))

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

cls_tuple = joblib.load(os.path.join(MODEL_DIR, "bizsim_classifier_sklearn.pkl"))
cls_pipeline, class_names = cls_tuple
print(f"Classes: {class_names}")
print(f"Pipeline: {cls_pipeline}")
print(f"n_features_in: {cls_pipeline.n_features_in_}")
scaler = cls_pipeline.named_steps['scaler']
print(f"Scaler n_features_in: {scaler.n_features_in_}")
print(f"Scaler mean_: {scaler.mean_}")
print(f"Scaler scale_: {scaler.scale_}")

# Test with 11 numeric features (no Location_Competitiveness string)
# Based on CLASS_FEATURES: Monthly_Revenue, Net_Profit_Margin, Burn_Rate_Ratio, 
# Transaction_Count, Avg_Historical_Rating, Review_Volatility,
# Business_Tenure_Months, Repeat_Order_Rate, Digital_Adoption_Score, 
# Location_Competitiveness (encoded?), Sentiment_Score

# Try encoding Location_Competitiveness as 0=Low, 1=Med, 2=High
X = np.array([[25000000, 22.7, 0.8, 150, 4.5, 0.3, 24, 25.0, 3.5, 0, 0.0]])
try:
    pred = cls_pipeline.predict(X)
    proba = cls_pipeline.predict_proba(X)
    print(f"Predict: {pred}")
    print(f"Proba: {proba}")
    print(f"Classes: {class_names}")
except Exception as e:
    print(f"Failed: {e}")
