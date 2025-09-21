import express from "express";
import User from "../models/User.js";
import authenticateToken from "../middleware/auth.js";
const router = express.Router();

// GET user profile by username
router.get("/", authenticateToken, async (req, res) => {
  try {
    console.log("Profile route accessed, user from token:", req.user);
    const userId = req.user.id; // comes from JWT payload in middleware

    if (!userId) {
      console.log("No user ID found in token");
      return res.status(400).json({ message: "User ID not found in token" });
    }

    const user = await User.findById(userId).select("username name email"); 
    if (!user) {
      console.log("User not found in database for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Profile data found:", user);
    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
