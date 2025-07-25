const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/chd_system";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  });

app.use(cors());
app.use(bodyParser.json());
const patientRoutes = require("./routes/patients");
const diagnosisRoutes = require("./routes/diagnosis");
const chatbotRoutes = require("./routes/chatbot");

app.use("/api/patients", patientRoutes);
app.use("/api/diagnosis", diagnosisRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("✅ Backend is healthy and running");
});
app.get("/", (req, res) => {
  res.send("🏥 CHD Node Backend is running ✅");
});

app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
