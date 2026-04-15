require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

console.log("--- THE NEW OPENROUTER CODE IS RUNNING ---");

const app = express();
app.use(cors());
app.use(express.json());

// 1. We read the key from your .env file
const OPENROUTER_API_KEY = process.env.GEMINI_API_KEY;

// 2. We use the OpenRouter API URL
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

app.post("/api/getQuote", async (req, res) => {
  try {
    
    // 3. We build a request body in the OpenRouter format
    const requestBody = {
      model: "google/gemini-2.5-pro", // This is the model name on OpenRouter // This is the model name on OpenRouter
      messages: [
        {
          role: "user",
          content: "Give me a short motivational quote only. No attribution."
        }
      ]
    };

    // 4. We send the API key as a 'Bearer' token in the headers
    const response = await axios.post(
      OPENROUTER_URL,
      requestBody,
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000" // Required by OpenRouter
        }
      }
    );

    // 5. We parse the response from the OpenRouter format
    const quote = response.data?.choices?.[0]?.message?.content;

    if (!quote) {
      console.error("Could not parse quote from API response:", response.data);
      return res.status(500).json({ error: "No quote received from API" });
    }
    
    const cleanedQuote = quote.trim().replace(/^"|"$/g, '');
    res.json({ quote: cleanedQuote });

  } catch (error) {
    
    console.error("Error calling OpenRouter API:", error.response?.data || error.message);
    
    res.status(500).json({ error: "Failed to generate quote" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
