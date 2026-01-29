import pandas as pd
import numpy as np

# -----------------------------
# Handshake Input Validation
# -----------------------------
def handshake_check_input_cardio(
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
# Medical Sanity Checks
# -----------------------------
def cardio_sanity_checks(X: pd.DataFrame) -> None:
    if (X["age_years"] < 0).any() or (X["age_years"] > 130).any():
        raise ValueError("Age out of expected range (0–120 years).")

    if (X["height"] < 100).any() or (X["height"] > 250).any():
        raise ValueError("Height out of expected range (120–220 cm).")

    if (X["weight"] < 20).any() or (X["weight"] > 300).any():
        raise ValueError("Weight out of expected range (30–200 kg).")

    if (X["ap_hi"] < 60).any() or (X["ap_hi"] > 300).any():
        raise ValueError("Systolic BP out of range (70–250).")

    if (X["ap_lo"] < 30).any() or (X["ap_lo"] > 200).any():
        raise ValueError("Diastolic BP out of range (40–160).")

    if not X["cholesterol"].isin([1, 2, 3]).all():
        raise ValueError("Cholesterol must be 1, 2, or 3.")

    if not X["gluc"].isin([1, 2, 3]).all():
        raise ValueError("Glucose must be 1, 2, or 3.")

# -----------------------------
# Cardio Prediction Function
# -----------------------------
def cardio_risk_predict(model, X_new, expected_columns, threshold=0.4):

    """
    Returns:
    0 -> No cardiovascular risk
    1 -> Cardiovascular risk detected
    """
    X_checked = handshake_check_input_cardio(X_new, expected_columns)
    cardio_sanity_checks(X_checked)
    risk_prob = model.predict_proba(X_checked)[:, 1]
    risk_pred = (risk_prob >= threshold).astype(int)
    return pd.DataFrame({
        "cardio_risk_probability": risk_prob,
        "cardio_risk_prediction": risk_pred
    })
