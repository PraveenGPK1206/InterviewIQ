import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from './routes/userRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import candidateInterviewRoutes from './routes/candidateInterviewRoutes.js';
import cors from "cors";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

import { connectRedis } from "./config/redis.js"

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use("/api/users", userRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/candidate-interviews", candidateInterviewRoutes);




app.post("/api/genai", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const { GoogleGenAI } = await import("@google/genai");

    const genAI = new GoogleGenAI({
      apiKey: process.env.GENAI_API_KEY,
    });

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash", // ✅ FREE + FAST
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.message || err);
    res.status(500).json({ message: "AI error" });
  }
});




app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error"
  });
});


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // crash fast so nodemon restarts
  }
};

app.listen(8800, async () => {
  await connect();

  await connectRedis();

  console.log("server started");
});