import express from "express";
import Trade from "../models/Trade.js";
import axios from "axios";
import authenticateToken from "../middleware/auth.js";
// import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY;

router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const trades = await Trade.find({ user: userId });

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
      const resp = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
          symbol,
          token: process.env.FINNHUB_KEY,
        },
      });

      const currentPrice = resp.data.c;
      const data = summary[symbol];

      results.push({
        symbol,
        quantity: data.quantity,
        avgBuyPrice: data.total / data.quantity,
        currentPrice,
        invested: data.total,
        currentValue: currentPrice * data.quantity,
        pl: currentPrice * data.quantity - data.total,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("Error in /summary", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.id });

    const portfolio = {};
    trades.forEach((trade) => {
      const s = trade.symbol.toUpperCase();
      if (!portfolio[s]) {
        portfolio[s] = { quantity: 0, invested: 0 };
      }

      if (trade.type === "buy") {
        portfolio[s].quantity += trade.quantity;
        portfolio[s].invested += trade.quantity * trade.price;
      } else {
        portfolio[s].quantity -= trade.quantity;
        portfolio[s].invested -= trade.quantity * portfolio[s].invested / (portfolio[s].quantity + trade.quantity);
      }
    });

    let totalInvested = 0, currentValue = 0, detailedAssets = [];

    for (let symbol in portfolio) {
      const res = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_TOKEN}`
      );
      const currentPrice = res.data.c;
      const { quantity, invested } = portfolio[symbol];
      if (quantity <= 0) continue;

      const value = quantity * currentPrice;
      totalInvested += invested;
      currentValue += value;

      detailedAssets.push({
        name: symbol,
        quantity,
        price: invested / quantity,
        current: currentPrice,
        pl: value - invested,
      });
    }

    res.json({
      assets: detailedAssets,
      totalInvested,
      currentValue,
      profitLoss: currentValue - totalInvested,
    });
  } catch (err) {
    console.error("Portfolio Error:", err);
    res.status(500).json({ message: "Error fetching portfolio" });
  }
});

export default router;
