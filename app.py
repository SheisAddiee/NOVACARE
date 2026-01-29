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


# Cardio Prediction (Updated Safe Version)
@app.route("/predict/cardio", methods=["POST"])
def predict_cardio():
    try:
        if cardio_model is None:
            return jsonify({"error": "Cardio model not loaded"}), 500

        data = request.get_json()
        logger.info(f"Cardio input: {data}")

        # Check for missing keys
        required_keys = ["age_years", "gender", "height", "weight",
                         "ap_hi", "ap_lo", "cholesterol", "gluc",
                         "smoke", "alco", "active"]
        for key in required_keys:
            if key not in data:
                return jsonify({"error": f"Missing key: {key}"}), 400

        # Convert inputs to proper types
        height_m = float(data["height"]) / 100
        weight = float(data["weight"])
        bmi = weight / (height_m ** 2)

        features = [
            float(data["age_years"]),
            int(data["gender"]),
            float(data["height"]),
            float(data["weight"]),
            float(data["ap_hi"]),
            float(data["ap_lo"]),
            int(data["cholesterol"]),
            int(data["gluc"]),
            int(data["smoke"]),
            int(data["alco"]),
            int(data["active"]),
            bmi
        ]

        prediction = cardio_model.predict([features])[0]
        logger.info(f"Cardio prediction: {prediction}")

        return jsonify({
            "model": "cardio",
            "risk": int(prediction)
        })

    except Exception as e:
        logger.error(f"Cardio prediction error: {e}")
        return jsonify({"error": str(e)}), 500



# Run App
app.run()
