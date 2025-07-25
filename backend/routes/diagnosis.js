const express = require("express");
const router = express.Router();
const diagnosisController = require("../controllers/diagnosisController");
const Diagnosis = require("../models/Diagnosis");
const Chat = require("../models/Chat");
router.post("/save", diagnosisController.saveDiagnosis);
router.get("/history/:patientName", diagnosisController.getDiagnosisHistory);
router.get("/", diagnosisController.getAllDiagnosis);
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Diagnosis.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Diagnosis not found" });
    }
    const patientName = deleted.patientName;
    await Chat.deleteMany({ patientId: patientName });
    res.json({ message: "Deleted successfully along with related chat history." });
  } catch (err) {
    console.error("Failed to delete diagnosis:", err);
    res.status(500).json({ error: "Failed to delete diagnosis" });
  }
});
module.exports = router;
