import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:query", async (req, res) => {
  const { query } = req.params;
  const exchange = req.query.exchange || "NSE"; // default to NSE

  try {
    const response = await fetch(
      `https://symbol-search.tradingview.com/symbol_search/?text=${query}&exchange=${exchange}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Symbol search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
