const axios = require("axios");
const Chat = require("../models/Chat");
const Diagnosis = require("../models/Diagnosis");

exports.chatbotReply = async (req, res) => {
  const userMessage = req.body.message?.toLowerCase() || "";

  if (!userMessage) {
    return res.status(400).json({ reply: "Please ask something!" });
  }

  let reply = "";

  try {
    if (userMessage.includes("risk") || userMessage.includes("predict")) {
      const latestDiagnosis = await Diagnosis.findOne().sort({ timestamp: -1 });

      if (!latestDiagnosis) {
        reply = "📄 No diagnosis found yet. Please complete a prediction first.";
      } else {
        const { result, probability } = latestDiagnosis;

        if (parseInt(result) === 1) {
          reply =
            `⚠️ You may be at risk of coronary heart disease.\n` +
            `📊 Confidence: ${(probability * 100).toFixed(1)}%\n\n` +
            `🩺 Recommendations:\n` +
            `• Visit a cardiologist\n` +
            `• Follow a heart-healthy diet\n` +
            `• Exercise regularly\n` +
            `• Avoid smoking/alcohol\n` +
            `• Track blood pressure & cholesterol`;
        } else {
          reply =
            `✅ You are not at risk of CHD according to our latest diagnosis.\n` +
            `📊 Confidence: ${(probability * 100).toFixed(1)}%\n\n` +
            `💡 Still, maintain a healthy lifestyle!`;
        }
      }
    } else {
      reply = "🤖 I'm focused on heart disease risk. Ask me: 'Am I at risk?'";
    }
    await Chat.create({
      patientId: "general",
      message: userMessage,
      reply,
      timestamp: new Date(),
    });

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    res.status(500).json({ reply: "⚠️ Error generating response." });
  }
};
exports.getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ patientId: "general" }).sort({ timestamp: 1 });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};
