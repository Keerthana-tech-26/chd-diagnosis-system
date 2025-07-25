import React from "react";
import { useNavigate } from "react-router-dom";

export default function ResultsDisplay() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("chd_patient")?.replace(/_/g, " ") || "Unknown";
  const result = JSON.parse(localStorage.getItem("chd_result"));

  if (!result || typeof result.result === "undefined" || typeof result.probability === "undefined") {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h2>⚠️ No prediction result found.</h2>
        <p>Please return to the form and complete a diagnosis first.</p>
        <button onClick={() => navigate("/")}>Back to Form</button>
      </div>
    );
  }

  const { result: prediction, probability } = result;

  const message =
    prediction === 1
      ? `⚠️ You are at risk of CHD. Follow precautions and consider consulting a cardiologist.`
      : `✅ You are not at risk of CHD. Keep maintaining a healthy lifestyle!`;

  const handleNext = () => {
    navigate("/history");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧪 Prediction Result</h2>
      <p><strong>Patient:</strong> {patientName}</p>
      <p><strong>Prediction:</strong> {prediction === 1 ? "At Risk of Heart Disease" : "Not at Risk"}</p>
      <p><strong>Confidence:</strong> {(probability * 100).toFixed(2)}%</p>
      <p><strong>Assistant:</strong> {message}</p>
      <button onClick={handleNext}>Next →</button>
    </div>
  );
}
