const FLASK_BASE = "http://localhost:5000";
const NODE_BASE = "http://localhost:4000";
export async function getPrediction(patientData) {
  try {
    const response = await fetch(`${FLASK_BASE}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });
    return await response.json();
  } catch (error) {
    console.error("Prediction error:", error);
    return { error: "Failed to fetch prediction" };
  }
}
export async function saveDiagnosis(diagnosisData) {
  try {
    const response = await fetch(`${NODE_BASE}/api/diagnosis/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(diagnosisData),
    });
    return await response.json();
  } catch (error) {
    console.error("Save diagnosis error:", error);
    return { error: "Failed to save diagnosis" };
  }
}
export async function getDiagnosisHistory(patientName) {
  try {
    const response = await fetch(`${NODE_BASE}/api/diagnosis/history/${patientName}`);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    } else {
      console.error("Unexpected history data:", data);
      return [];
    }
  } catch (error) {
    console.error("Get history error:", error);
    return [];
  }
}
export async function deleteDiagnosisById(id) {
  try {
    const response = await fetch(`${NODE_BASE}/api/diagnosis/delete/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Delete diagnosis error:", error);
    return { error: "Failed to delete diagnosis" };
  }
}
