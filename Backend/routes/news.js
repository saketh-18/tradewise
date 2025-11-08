import express from "express";
import axios from "axios";
const router = express.Router();
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`)
        const result = response.data;
        if(!result) return res.status(404).json({message : "Error fetching news"});
        const newsData = result.slice(0,40);
        const not_market = newsData.filter((el) => el.source != "MarketWatch");
        res.json(not_market);
    }
    catch (err) { 
    console.error("News Fetch Error:", err);
    res.status(500).json({ message: "Error fetching News" });
    }
})

router.get("/:symbol", async (req, res) => { 
    try {
        const { symbol } =  req.params;
        console.log(symbol)
        const response = await axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=2025-01-15&to=2025-06-20&token=${FINNHUB_API_KEY}`);
        const result = response.data;  
        // console.log(result);
        const data = result.slice(0,20);
    
        res.json(data);
    } catch(err){
        console.log("Error fetching symbol news", err);
        res.status(500).json({message : "Error fetching News"});
    }
})

export default router;


// https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2025-05-15&to=2025-06-20&token=d1cjenhr01qvlf60d2ogd1cjenhr01qvlf60d2p0