import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await axios.get('https://content.guardianapis.com/search?api-key=0c41d3be-6eb5-445f-b8b8-2514ca3c7639&q=stockmarket&section=business&page-size=12')
        const result = response.data.response.results;
        if(!result) return res.status(404).json({message : "Error fetching news"});
        res.json(result);
    }
    catch (err) { 
    console.error("News Fetch Error:", err);
    res.status(500).json({ message: "Error fetching News" });
    }
})

export default router;