// routes/auth.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cookieParser from "cookie-parser";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Register
router.post("/register", async (req, res) => {
  const { name , username , email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name , username , email, password: hash, watchlist: [] });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    // console.log(email , password);
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log(req.body);
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7h" });

    // TODO: In production, change secure to true and sameSite to "none"
    // Also ensure your frontend domain is in the CORS origin list
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Change to true in production (requires HTTPS)
      sameSite: "none", // Change to "none" in production if frontend/backend are on different domains
      path: "/",
      maxAge: 7 * 60 * 60 * 1000 // 7 hours
    });

    res.json({ 
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  // console.log("---- LOGOUT REQUEST ----");
  // console.log("Cookies received from client:", req.cookies);

  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Change to true in production (requires HTTPS)
    sameSite: "none", // Change to "none" in production if frontend/backend are on different domains
    path: "/",       // must match login
    maxAge: 0  // Immediately expire the cookie
  });

  // console.log("Cleared token cookie");

  // Check if cookie still exists in req after clearing
  // console.log("Cookies after clearCookie call:", req.cookies);

  res.status(200).json({ message: "Logged out successfully" });
});



export default router;
