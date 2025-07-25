const mongoose = require("mongoose");
const diagnosisSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  inputData: { type: Object, required: true },
  result: { type: String, required: true },
  probability: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Diagnosis", diagnosisSchema);
