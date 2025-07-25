from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from data_processor import load_and_preprocess_data
import joblib
import os
X_train_raw, X_test_raw, y_train, y_test, scaler = load_and_preprocess_data("data/cardio.csv")

joblib.dump(X_train_raw.columns.tolist(), "models/model_features.pkl")

X_train = scaler.transform(X_train_raw)
X_test = scaler.transform(X_test_raw)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model trained with accuracy: {accuracy:.4f}")
print("📊 Classification Report:\n", classification_report(y_test, y_pred))

joblib.dump(model, "models/trained_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
print("✅ Model and scaler saved in models")
