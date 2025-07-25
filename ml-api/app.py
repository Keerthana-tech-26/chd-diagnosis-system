from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)
model = joblib.load("models/trained_model.pkl")
scaler = joblib.load("models/scaler.pkl")
model_features = joblib.load("models/model_features.pkl")

@app.route("/predict", methods=["POST"])

def predict():
    try:
        input_data = request.get_json()
        print("📥 Incoming JSON:", input_data)
        input_df = pd.DataFrame([input_data])

        missing_cols = set(model_features) - set(input_df.columns)
        if missing_cols:
            return jsonify({"error": f"Missing input fields: {missing_cols}"}), 400

        input_df = input_df[model_features]
        scaled_input = scaler.transform(input_df)
        prediction = model.predict(scaled_input)[0]
        probability = model.predict_proba(scaled_input)[0][prediction]

        return jsonify({
            "prediction": int(prediction),
            "probability": float(probability)
        })

    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        return jsonify({"error": str(e)}), 400
