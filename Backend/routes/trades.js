import express from 'express';
import Trade from '../models/Trade.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Create a trade (Buy/Sell)
router.post("/", authenticateToken, async (req, res) => {
  const { symbol, quantity, price, type } = req.body;
  console.log("Cookies:", req.cookies);
  console.log("Decoded User:", req.user);
  if (!symbol || !quantity || !price || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const trade = new Trade({
      userId: req.user.id,
      symbol: symbol.toUpperCase(),
      quantity,
      price,
      type
    });
    await trade.save();
    res.status(201).json({ message: "Trade recorded", trade });
  } catch (err) {
    console.error("Trade Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's trade history
router.get("/", authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    console.error("Trade Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
