import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ Groq connection
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/analyze", async (req, res) => {
  try {
    const userData = req.body;

    console.log("Received data:", userData);

    const prompt = `
The user details are:
Name: ${userData.name}
Subjects Interested: ${userData.subjects}
Likes Problem Solving: ${userData.problemSolving}
Work Style Preference: ${userData.workStyle}

Suggest 3 suitable career paths and explain briefly.
`;

    const response = await openai.chat.completions.create({
     model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a career guidance expert." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    res.json({
      success: true,
      result: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
