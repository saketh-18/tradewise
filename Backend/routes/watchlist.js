import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's watchlist
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("watchlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    console.error("Get Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a symbol to the watchlist
router.post("/", authenticateToken, async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ message: "No symbol provided" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (!user.watchlist.includes(symbol.toUpperCase())) {
      user.watchlist.push(symbol.toUpperCase());
      await user.save();
      return res.json({ message: "Symbol added", watchlist: user.watchlist });
    } else {
      return res.status(400).json({ message: "Symbol already exists in watchlist" });
    }
  } catch (err) {
    console.error("Add Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove a symbol from the watchlist
router.delete("/:symbol", authenticateToken, async (req, res) => {
  const { symbol } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchlist = user.watchlist.filter(s => s !== symbol.toUpperCase());
    await user.save();
    res.json({ message: "Symbol removed", watchlist: user.watchlist });
  } catch (err) {
    console.error("Remove Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
