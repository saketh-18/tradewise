import express from "express";
import { getIndianStockPrice, extractSymbolName } from '../utils/priceHelper.js';

const router = express.Router();

router.get("/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const price = await getIndianStockPrice(symbol);
        console.log(`Price for ${symbol}:`, price);
        res.json({ price });
    } catch(err) {
        console.error("Error in IndianPrice route:", err.message);
        res.status(500).json({ message: "Error fetching price: " + err.message });
    }
})

export default router;

// async function example() {
  

    // 1. Get all stock symbols
    //const symbols = await nse.getAllStockSymbols();
    //console.log("Symbols:", symbols);

  // 2. Get equity details (for example symbol "IRCTC")
//   const details = await nse.getEquityDetails("IRCTC");
  // console.log("Details of IRCTC:", details);

  // 3. Get historical data (range)
//   const range = {
//     start: new Date("2023-01-01"),
//     end: new Date("2023-3-31")
//   };
//   const hist = await nse.getEquityHistoricalData("IRCTC");
//   console.log("Price:", details.priceInfo.lastPrice);
// }

// example().catch(console.error);
// app.listen(3000);