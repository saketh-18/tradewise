import express from "express";
import Trade from "../models/Trade.js";
import axios from "axios";
import authenticateToken from "../middleware/auth.js";
import { getIndianStockPrice } from '../utils/priceHelper.js';
// import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Sort trades by date to process chronologically
    const trades = await Trade.find({ userId }).sort({ date: 1 });

    const summary = {};
    for (let trade of trades) {
      const symbol = trade.symbol.toUpperCase();
      if (!summary[symbol]) {
        summary[symbol] = { quantity: 0, total: 0 };
      }

      if (trade.type === "buy") {
        // Buy: add to quantity and total invested
        summary[symbol].quantity += trade.quantity;
        summary[symbol].total += trade.quantity * trade.price;
      } else {
        // Sell: reduce quantity and invested proportionally based on average buy price
        if (summary[symbol].quantity > 0) {
          const avgBuyPrice = summary[symbol].total / summary[symbol].quantity;
          const qtyToSell = Math.min(trade.quantity, summary[symbol].quantity);
          summary[symbol].quantity -= qtyToSell;
          summary[symbol].total -= avgBuyPrice * qtyToSell;
          // Ensure values don't go negative due to floating point errors
          if (summary[symbol].total < 0) {
            summary[symbol].total = 0;
          }
          if (summary[symbol].quantity < 0) {
            summary[symbol].quantity = 0;
          }
        }
        // If trying to sell more than owned, ignore the excess (or handle short selling separately)
      }
    }

    const results = [];
    for (let symbol in summary) {
      const position = summary[symbol];
      // Skip positions with zero or negative quantity
      if (position.quantity <= 0) continue;

      // Skip positions with negative or zero total (safety check)
      if (position.total <= 0) {
        console.warn(`Warning: Invalid total for ${symbol}, skipping`);
        continue;
      }

      // Get current price using Indian price API
      let currentPrice;
      try {
        currentPrice = await getIndianStockPrice(symbol);
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error.message);
        // Skip this symbol if we can't get the price
        continue;
      }

      const avgBuyPrice = position.total / position.quantity;

      // Safety check: avgBuyPrice should always be positive
      if (avgBuyPrice <= 0 || !isFinite(avgBuyPrice)) {
        console.warn(`Warning: Invalid avgBuyPrice for ${symbol}, skipping`);
        continue;
      }

      results.push({
        symbol,
        quantity: position.quantity,
        avgBuyPrice,
        currentPrice,
        invested: position.total,
        currentValue: currentPrice * position.quantity,
        pl: currentPrice * position.quantity - position.total,
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
    // Sort trades by date to process chronologically
    const trades = await Trade.find({ userId: req.user.id }).sort({ date: 1 });

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
        // For sell: calculate average buy price BEFORE reducing quantity
        // Then reduce invested proportionally
        if (portfolio[s].quantity > 0) {
          const avgBuyPrice = portfolio[s].invested / portfolio[s].quantity;
          const qtyToSell = Math.min(trade.quantity, portfolio[s].quantity);
          portfolio[s].quantity -= qtyToSell;
          portfolio[s].invested -= avgBuyPrice * qtyToSell;
          // Ensure invested doesn't go negative
          if (portfolio[s].invested < 0) {
            portfolio[s].invested = 0;
          }
        }
      }
    });

    let totalInvested = 0, currentValue = 0, detailedAssets = [];

    for (let symbol in portfolio) {
      // Get current price using Indian price API
      let currentPrice;
      try {
        currentPrice = await getIndianStockPrice(symbol);
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error.message);
        // Skip this symbol if we can't get the price
        continue;
      }
      const { quantity, invested } = portfolio[symbol];
      
      // Safety check: ensure quantity and invested are valid
      if (quantity <= 0 || invested <= 0) {
        continue;
      }

      const value = quantity * currentPrice;
      const avgBuyPrice = invested / quantity;

      // Safety check: avgBuyPrice should always be positive
      if (avgBuyPrice <= 0) {
        console.warn(`Warning: Invalid avgBuyPrice for ${symbol}, skipping`);
        continue;
      }

      totalInvested += invested;
      currentValue += value;

      detailedAssets.push({
        name: symbol,
        quantity,
        price: avgBuyPrice,
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
