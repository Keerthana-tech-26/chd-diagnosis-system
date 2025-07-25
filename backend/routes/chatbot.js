const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Diagnosis = require("../models/Diagnosis");
router.post("/", async (req, res) => {
  const { message, patientId } = req.body;
  let reply = "🤖 Sorry, I didn't understand that.";

  if (message.toLowerCase().includes("risk")) {
    const latest = await Diagnosis.findOne({ patientId }).sort({ timestamp: -1 });

    if (latest) {
      const percent = (latest.probability * 100).toFixed(1);
      if (latest.prediction === 1) {
        reply = `⚠️ You may be at risk of coronary heart disease. 📊 Confidence: ${percent}% 🔄 Recommendations: • Visit a cardiologist • Follow a heart-healthy diet • Exercise regularly • Avoid smoking/alcohol • Track blood pressure & cholesterol`;
      } else {
        reply = `✅ You are not at risk of CHD. Confidence: ${percent}% 🌿 Maintain a healthy lifestyle.`;
      }
    } else {
      reply = "📄 No diagnosis found for you yet. Please complete a prediction first.";
    }
  }
  await Chat.create({ message, reply, patientId });
  res.json({ reply });
});
router.get("/history/:patientId", async (req, res) => {
  try {
    const chats = await Chat.find({ patientId: req.params.patientId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("Failed to fetch chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});
module.exports = router;
