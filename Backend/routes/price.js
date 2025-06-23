// import dotenv from 'dotenv';
// dotenv.config();
import express from "express";
import axios from "axios";
// import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_URL = "https://finnhub.io/api/v1/quote";
// console.log(FINNHUB_API_KEY); 
// Get current price for a symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const response = await axios.get(`${FINNHUB_URL}?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const price = response.data.c;
    if (!price) return res.status(404).json({ message: "Invalid symbol" });
    res.json({ symbol, price });
  } catch (err) { 
    console.error("Price Fetch Error:", err);
    res.status(500).json({ message: "Error fetching price" });
  }
});

export default router;
