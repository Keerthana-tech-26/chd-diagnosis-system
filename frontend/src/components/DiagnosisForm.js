import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPrediction } from "../services/api";
export default function DiagnosisForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: "",
    Age: "",
    Sex: "M",
    ChestPainType: "ATA",
    RestingBP: "",
    Cholesterol: "1",
    FastingBS: "0",
    RestingECG: "Normal",
    MaxHR: "",
    ExerciseAngina: "N",
    Oldpeak: "",
    ST_Slope: "Up",
    Height: "",
    Weight: "",
    Smoke: "0",
    Alco: "0",
    Active: "1"
  });
  useEffect(() => {
    const name = localStorage.getItem("chd_patient");
    if (name) {
      setFormData((prev) => ({ ...prev, patientName: name }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName.trim()) {
      alert("Please enter the patient name.");
      return;
    }
    const requiredFields = ["Age", "RestingBP", "Height", "Weight", "MaxHR", "Oldpeak"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }
    const patientId = formData.patientName.trim().toLowerCase().replace(/\s+/g, "_");
    localStorage.setItem("chd_patient", patientId);
    const mappedData = {
      age: parseInt(formData.Age) * 365,
      gender: formData.Sex === "M" ? 2 : 1,
      height: parseInt(formData.Height),
      weight: parseInt(formData.Weight),
      ap_hi: parseInt(formData.RestingBP),
      ap_lo: 80,
      cholesterol: parseInt(formData.Cholesterol),
      gluc: formData.FastingBS === "1" ? 2 : 1,
      smoke: parseInt(formData.Smoke),
      alco: parseInt(formData.Alco),
      active: parseInt(formData.Active)
    };
    try {
      const response = await fetch("http://localhost:4000/api/diagnosis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientId,
          inputData: mappedData
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Prediction failed");
      localStorage.setItem("chd_result", JSON.stringify(result));
      navigate("/results");
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Prediction failed. Please check your input or try again.");
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h2>CHD Diagnosis Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient Name:
            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
          </label>
        </div>
        <div>
          <label>Age:
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} />
          </label>
        </div>
        <div>
          <label>Sex:
            <select name="Sex" value={formData.Sex} onChange={handleChange}>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
        </div>
        <div>
          <label>Chest Pain Type:
            <select name="ChestPainType" value={formData.ChestPainType} onChange={handleChange}>
              <option value="TA">Typical Angina</option>
              <option value="ATA">Atypical Angina</option>
              <option value="NAP">Non-anginal Pain</option>
              <option value="ASY">Asymptomatic</option>
            </select>
          </label>
        </div>
        <div><label>RestingBP: <input type="number" name="RestingBP" value={formData.RestingBP} onChange={handleChange} /></label></div>
        <div>
          <label>Cholesterol:
            <select name="Cholesterol" value={formData.Cholesterol} onChange={handleChange}>
              <option value={1}>Normal</option>
              <option value={2}>Above Normal</option>
              <option value={3}>Well Above Normal</option>
            </select>
          </label>
        </div>
        <div>
          <label>FastingBS:
            <select name="FastingBS" value={formData.FastingBS} onChange={handleChange}>
              <option value={0}>No (≤ 120 mg/dl)</option>
              <option value={1}>Yes (&gt; 120 mg/dl)</option>
            </select>
          </label>
        </div>
        <div><label>MaxHR: <input type="number" name="MaxHR" value={formData.MaxHR} onChange={handleChange} /></label></div>
        <div><label>Oldpeak: <input type="number" step="0.1" name="Oldpeak" value={formData.Oldpeak} onChange={handleChange} /></label></div>
        <div><label>Height (cm): <input type="number" name="Height" value={formData.Height} onChange={handleChange} /></label></div>
        <div><label>Weight (kg): <input type="number" name="Weight" value={formData.Weight} onChange={handleChange} /></label></div>
        <div>
          <label>Smoker:
            <select name="Smoke" value={formData.Smoke} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>
        </div>
        <div>
          <label>Alcohol:
            <select name="Alco" value={formData.Alco} onChange={handleChange}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </label>
        </div>
        <div>
          <label>Physically Active:
            <select name="Active" value={formData.Active} onChange={handleChange}>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </label>
        </div>
        <button type="submit">Predict</button>
      </form>
    </div>
  );
}
