import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET user profile by username
router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "username is required" });

    const user = await User.findOne({ username }).select("username name username");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
