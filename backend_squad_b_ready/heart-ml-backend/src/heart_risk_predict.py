import pandas as pd
import numpy as np

# -----------------------------
# Handshake Input Validation
# -----------------------------

def handshake_check_input_heart(
    X_new: pd.DataFrame, 
    expected_columns: list[str]
    ) -> pd.DataFrame:
    if not isinstance(X_new, pd.DataFrame):
        raise TypeError("Input must be a pandas DataFrame.")

    missing = [c for c in expected_columns if c not in X_new.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    extra = [c for c in X_new.columns if c not in expected_columns]
    if extra:
        raise ValueError(f"Unexpected extra columns: {extra}")

    X_checked = X_new[expected_columns].copy()

    if X_checked.isna().any().any():
        raise ValueError("Missing values detected in input.")

    for col in expected_columns:
        if not np.issubdtype(X_checked[col].dtype, np.number):
            X_checked[col] = pd.to_numeric(X_checked[col], errors="raise")

    return X_checked

# -----------------------------
# Heart Risk Prediction
# -----------------------------
def predict_heart_risk(model, X_new, expected_columns, threshold=0.4):
    
    X_checked = handshake_check_input_heart(X_new, expected_columns)
    risk_prob = model.predict_proba(X_checked)[:, 1]
    risk_pred = (risk_prob >= threshold).astype(int)

    return pd.DataFrame({
        "heart_risk_probability": risk_prob,
        "heart_risk_prediction": risk_pred
    })

    """
    Returns:
    - heart_risk_probability
    - heart_risk_prediction (0 or 1)
    """
