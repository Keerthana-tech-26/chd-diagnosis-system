const axios = require("axios");
const Diagnosis = require("../models/Diagnosis");
exports.saveDiagnosis = async (req, res) => {
  console.log("🛠️ Incoming data to /save:", req.body);
  const { patientName, inputData } = req.body;
  if (!inputData || !patientName) {
    return res.status(400).json({ error: "Missing input data or patient name" });
  }
  try {
    const flaskRes = await axios.post("http://localhost:5000/predict", inputData);
    const { prediction, probability } = flaskRes.data;
    const newDiagnosis = new Diagnosis({
      patientName,
      inputData,
      result: prediction,
      probability,
      timestamp: new Date(),
    });
    console.log("🧾 Diagnosis to be saved:", newDiagnosis);
    await newDiagnosis.save();
    res.json({
      message: "Diagnosis saved successfully ✅",
      result: prediction,
      probability,
    });
  } catch (error) {
    console.error("❌ Prediction or saving failed:", error);
    res.status(500).json({ error: error.message || "Unknown error occurred" });
  }
};
exports.getDiagnosisHistory = async (req, res) => {
  const { patientName } = req.params;
  if (!patientName) {
    return res.status(400).json({ error: "Missing patient name in request" });
  }
  try {
    const normalizedName = patientName.replace(/_/g, " ");
    const history = await Diagnosis.find({
      patientName: new RegExp("^" + normalizedName + "$", "i"), // case-insensitive exact match
    }).sort({ timestamp: -1 });
    return res.json(history);
  } catch (error) {
    console.error("❌ Error fetching diagnosis history:", error);
    res.status(500).json({ error: "Failed to fetch diagnosis history" });
  }
};
exports.deleteDiagnosis = async (req, res) => {
  try {
    const deleted = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Diagnosis not found" });
    } 
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete diagnosis:", err);
    res.status(500).json({ error: "Failed to delete diagnosis" });
  }
};
exports.getAllDiagnosis = async (req, res) => {
  try {
    const allData = await Diagnosis.find().sort({ timestamp: -1 });
    res.json(allData);
  } catch (err) {
    console.error("❌ Failed to fetch all diagnoses:", err);
    res.status(500).json({ error: "Failed to fetch all diagnoses" });
  }
};

