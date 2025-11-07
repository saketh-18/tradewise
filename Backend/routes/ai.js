import express from "express";
const router = express.Router();
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
// Initialize the client. It will automatically look for GEMINI_API_KEY in process.env
const ai = new GoogleGenAI({});

router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }

  try {
    const newsResponse = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2025-01-15&to=2025-06-20&token=${FINNHUB_API_KEY}`
    );
    const newsData = newsResponse.data;

    const newsText = newsData
      .slice(0, 10)
      .map((item, index) => `${index + 1}. ${item.headline} (${item.source})`)
      .join("\n");

    // --- 2. Construct the Prompt and Schema ---
    const prompt = `Analyze the following news headlines for ${symbol} and 
    provide a concise market insight. Your response MUST STRICTLY ADHERE to 
    the JSON schema provided in the configuration.
        
        **News Headlines:**
        ${newsText}
        
        If no news is provided that means that is other than US Stock and we have no news available , Give data based on your analysis, dont specify that no news is provided
        `;


    // Define the desired JSON schema
const WIDGET_INSIGHTS_SCHEMA = {
    type: "object",
    properties: {
        Sentiment: { 
            type: "string", 
            description: "Strictly 'Bullish', 'Bearish', or 'Neutral' or other thing in under 5 words." 
        },
        Summary: { 
            type: "string", 
            description: "A one-sentence summary (max 150 characters) of the primary market implication. MUST be very brief." 
        },
        ConfidencePct: { 
            type: "string", 
            description: "A percentage value (e.g., 85%) representing confidence." 
        },
        PrimaryDriver: {
            type: "string",
            description: "The main factor influencing the stock (e.g., 'AI Strategy', 'Lawsuit Risk'). Max 3 words."
        },
        // We'll keep the trading interval simple for a widget
        TradeInterval: {
            type: "string",
            description: "Short-term (0-3 months), Medium-term (3-12 months), or Long-term (1+ year)."
        }
    },
    required: ["Sentiment", "Summary", "ConfidencePct", "PrimaryDriver", "TradeInterval"]
};

    // --- 3. Call the Gemini API ---
const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            temperature: 0.1, 
            responseMimeType: "application/json", // ENFORCE JSON
            responseSchema: WIDGET_INSIGHTS_SCHEMA, // ENFORCE STRUCTURE
        }
    });

    const aiResult = response.text.trim();

    res.json({ symbol, insights: aiResult });
  } catch (error) {
    console.error("Gemini AI integration error:", error);
    res.status(500).json({ message: "Error fetching AI insights." });
  }
});

export default router;
