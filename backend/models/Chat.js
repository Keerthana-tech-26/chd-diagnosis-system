const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: false,
    default: "general",
  },
  message: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
