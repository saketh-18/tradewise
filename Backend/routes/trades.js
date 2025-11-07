import express from 'express';
import Trade from '../models/Trade.js';
import authenticateToken from '../middleware/auth.js';
import axios from "axios";
import mongoose from "mongoose";

const router = express.Router();

// Create a trade (Buy/Sell)
router.post("/", authenticateToken, async (req, res) => {
  const { symbol, quantity, price, type } = req.body;
  // console.log("Cookies:", req.cookies);
  // console.log("Decoded User:", req.user);
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

// GET /api/trades/summary
router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const trades = await Trade.find({ userId });
    const summary = {};
    for (let trade of trades) {
      if (!summary[trade.symbol]) {
        summary[trade.symbol] = { quantity: 0, total: 0 };
      }

      const multiplier = trade.type === "buy" ? 1 : -1;
      summary[trade.symbol].quantity += trade.quantity * multiplier;
      summary[trade.symbol].total += trade.price * trade.quantity * multiplier;
    }

    const results = [];
    for (let symbol in summary) {
      const position = summary[symbol];
      if (position.quantity === 0) continue; // skip sold-out positions

      const priceRes = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
          symbol,
          token: process.env.FINNHUB_API_KEY,
        },
      });

      const currentPrice = priceRes.data.c;
      const invested = position.total;
      const currentValue = currentPrice * position.quantity;

      results.push({
        symbol,
        quantity: position.quantity,
        avgBuyPrice: invested / position.quantity,
        currentPrice,
        invested,
        currentValue,
        pl: currentValue - invested,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Error in /summary:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/debug/all", async (req, res) => {
  const id = req.query.id;
  console.log("Received userId:", id);

  if (!id) return res.status(400).json({ message: "Missing user ID" });

  try {
    const objectId = new mongoose.Types.ObjectId(id);
    const trades = await Trade.find({ userId: objectId });
    console.log("Trades found:", trades);
    res.json(trades);
  } catch (err) {
    console.error("Error fetching trades:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's current holdings (open positions)
router.get("/holdings", authenticateToken, async (req, res) => {
  // console.log("Cookies received:", req.cookies);
  // console.log("Decoded user:", req.user);

  try {
    // Convert userId string to ObjectId for proper MongoDB matching
    // The userId from JWT is a string, but the database stores it as ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const holdings = await Trade.aggregate([
      { $match: { userId } },

      {
        $group: {
          _id: "$symbol",
          totalBought: {
            $sum: { $cond: [{ $eq: ["$type", "buy"] }, "$quantity", 0] },
          },
          totalSold: {
            $sum: { $cond: [{ $eq: ["$type", "sell"] }, "$quantity", 0] },
          },
        },
      },
      {
        $project: {
          symbol: "$_id",
          netQuantity: { $subtract: ["$totalBought", "$totalSold"] },
          _id: 0,
        },
      },
      { $match: { netQuantity: { $ne: 0 } } }, // only active holdings
    ]);

    res.json(holdings);
  } catch (err) {
    console.error("Error in /holdings:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Helper function to calculate realized P&L using FIFO method
function calculateRealizedPL(trades) {
  let realizedPL = 0;
  const buyQueue = []; // FIFO queue for buy trades

  // Sort trades by date to process in chronological order
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));

  for (const trade of sortedTrades) {
    if (trade.type === "buy") {
      buyQueue.push({
        quantity: trade.quantity,
        price: trade.price,
        date: trade.date,
      });
    } else if (trade.type === "sell") {
      let remainingSellQty = trade.quantity;
      const sellPrice = trade.price;

      while (remainingSellQty > 0 && buyQueue.length > 0) {
        const buyTrade = buyQueue[0];
        const qtyToMatch = Math.min(remainingSellQty, buyTrade.quantity);

        // Calculate P&L for this matched portion
        const pl = (sellPrice - buyTrade.price) * qtyToMatch;
        realizedPL += pl;

        // Update quantities
        remainingSellQty -= qtyToMatch;
        buyTrade.quantity -= qtyToMatch;

        // Remove buy trade if fully matched
        if (buyTrade.quantity === 0) {
          buyQueue.shift();
        }
      }
    }
  }

  return realizedPL;
}

// Get total realized P&L
router.get("/realized-pl", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const trades = await Trade.find({ userId }).sort({ date: 1 });
    
    const realizedPL = calculateRealizedPL(trades);

    res.json({ realizedPL });
  } catch (err) {
    console.error("Error calculating realized P&L:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Exit a position (sell shares you own)
router.post("/exit", authenticateToken, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    if (!symbol || !quantity) {
      return res.status(400).json({ message: "Symbol and quantity required" });
    }

    // Fetch live market price from Finnhub
    const priceRes = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol,
        token: process.env.FINNHUB_API_KEY,
      },
    });

    const marketPrice = priceRes.data.c;
    if (!marketPrice) {
      return res
        .status(400)
        .json({ message: "Unable to fetch current market price" });
    }

    // Get all trades for this symbol to calculate realized P&L for this exit
    const allTrades = await Trade.find({ userId, symbol: symbol.toUpperCase() }).sort({ date: 1 });
    
    // Record a sell trade to exit
    const trade = new Trade({
      userId,
      symbol: symbol.toUpperCase(),
      quantity,
      price: marketPrice,
      type: "sell",
    });

    await trade.save();

    // Calculate realized P&L for this specific exit using FIFO
    const tradesWithNewSell = [...allTrades, trade];
    const realizedPLBefore = calculateRealizedPL(allTrades);
    const realizedPLAfter = calculateRealizedPL(tradesWithNewSell);
    const realizedPLForThisExit = realizedPLAfter - realizedPLBefore;

    res.status(201).json({
      message: `Exited ${quantity} of ${symbol} at ${marketPrice}`,
      trade,
      realizedPL: realizedPLForThisExit,
    });
  } catch (err) {
    console.error("Error in /exit:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// router.get("/debug/all", async (req, res) => {
//   const allTrades = await Trade.find(); // no filter
//   res.json(allTrades);
// });



export default router;
