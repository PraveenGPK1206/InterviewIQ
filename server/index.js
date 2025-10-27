import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/userRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import candidateInterviewRoutes from './routes/candidateInterviewRoutes.js';
import cors from "cors";


const app = express();
app.use(express.json());
dotenv.config();
app.use(cors({
    origin: '*', 
    credentials: true, 
  }));
app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/candidate-interviews', candidateInterviewRoutes);
app.use((err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    });
});


app.post('/api/genai', async (req, res) => {
  const { message } = req.body;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey: process.env.REACT_APP_GENAI_API_KEY });
  
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          type: "text",
          text: message
        }]
    });
    const reply=response.text;
    res.json({reply});

  } catch (error) {
    console.error('Error from Gemini AI:', error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini AI' });
  }
});


const connect=() =>{
    mongoose.connect(process.env.MONGO).then(()=>{
        console.log("connnected to db");
    }).catch((err)=>{
        throw err;
    });
};
app.listen(8800,()=>{
     connect();
    console.log("server started");
})
