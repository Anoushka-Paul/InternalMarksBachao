import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5001;

app.use(express.json());

app.post("/ai/test", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: data });
    }

    res.json({
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`AI backend running on port ${port}`);
});