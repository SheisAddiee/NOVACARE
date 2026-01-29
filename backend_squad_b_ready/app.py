from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import logging

app = Flask(__name__)
CORS(app)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Load Models

def load_model(path, name):
    try:
        model = joblib.load(path)
        logger.info(f"{name} model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Failed to load {name} model: {e}")
        return None


heart_model = load_model(
    "models/heart_risk_rf.pkl",
    "Heart"
)

cardio_model = load_model(
    "models/cardio_risk_xgb.pkl",
    "Cardio"
)


# Heart Prediction

@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    if heart_model is None:
        return jsonify({"error": "Heart model not loaded"}), 500

    data = request.get_json()
    logger.info(f"Heart input: {data}")

    features = [
        data["Chest_Pain"],
        data["Shortness_of_Breath"],
        data["Fatigue"],
        data["Palpitations"],
        data["Dizziness"],
        data["Swelling"],
        data["High_BP"],
        data["Pain_Arms_Jaw_Back"],
        data["Cold_Sweats_Nausea"],
        data["High_Cholesterol"],
        data["Diabetes"],
        data["Smoking"],
        data["Obesity"],
        data["Sedentary_Lifestyle"],
        data["Family_History"],
        data["Chronic_Stress"],
        data["Gender"],
        data["Age"]
    ]

    prediction = heart_model.predict([features])[0]
    logger.info(f"Heart prediction: {prediction}")

    return jsonify({
        "model": "heart",
        "risk": int(prediction)
    })


# Cardio Prediction

@app.route("/predict/cardio", methods=["POST"])
def predict_cardio():
    if cardio_model is None:
        return jsonify({"error": "Cardio model not loaded"}), 500

    data = request.get_json()
    logger.info(f"Cardio input: {data}")

    height_m = data["height"] / 100
    bmi = data["weight"] / (height_m ** 2)

    features = [
        data["age_years"],
        data["gender"],
        data["height"],
        data["weight"],
        data["ap_hi"],
        data["ap_lo"],
        data["cholesterol"],
        data["gluc"],
        data["smoke"],
        data["alco"],
        data["active"],
        bmi
    ]

    prediction = cardio_model.predict([features])[0]
    logger.info(f"Cardio prediction: {prediction}")

    return jsonify({
        "model": "cardio",
        "risk": int(prediction)
    })



# Run App
app.run()
